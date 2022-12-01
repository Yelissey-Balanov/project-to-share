import { Prop, Vue } from 'vue-property-decorator'
import Component from 'vue-class-component'
import { Plugin } from '@nuxt/types'
import { Eventable, GetPeopleByNameQuery, Maybe, Project } from '~/graphql/GQLTypes'
import { AddToBucketItemType } from '~/helpers/types'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { Store } from 'vuex'
import { RootState } from '~/store'
;(window as any).Pusher = Pusher

@Component
export class EventBus extends Vue {
  @Prop()
  $store!: Store<RootState>
  @Prop()
  $config!: any

  echo?: Echo

  created() {
    if (this.$store.state.account!.user) {
      this.connectWebSocket()
    }
  }

  connectWebSocket() {
    if (process.env.NUXT_ENV_IGNORE_WS) {
      console.warn('WebSocket would connect now, but it was disabled via environment variables!')
      return
    }
    if (!this.echo) {
      this.echo = new Echo({
        broadcaster: 'pusher',
        key: this.$config.wsKey,
        wsHost: this.$config.wsHost,
        wsPort: this.$config.wsPort,
        enabledTransports: ['ws', 'wss'],
        disableStats: true,
      })
    } else {
      this.echo.connect()
    }

    this.echo
      .channel('global')
      .listen('UpdateAvailable', (payload: { server: Maybe<string>; client: Maybe<string>; message: string }) => {
        const codeVersions = this.$store.state.codeVersions
        if (codeVersions.server === null || codeVersions.client === null) {
          this.$store.commit('setCodeVersions', payload)
        } else {
          if (codeVersions.server !== payload.server || codeVersions.client !== payload.client) {
            this.$emit('updateAvailable', payload.message)
          }
        }
      })
  }

  disconnectWebSocket() {
    if (!this.echo) {
      return
    }
    this.echo.disconnect()
  }

  showErrorModal(p: { errors: string[]; title?: string }, autocloseAfter?: number) {
    this.$emit('showErrorModal', p, autocloseAfter)
  }

  showSuccessModal(successText: string, autocloseAfter?: number) {
    this.$emit('showSuccessModal', successText, autocloseAfter)
  }

  showPromptModal(options: {
    title: string
    value: Maybe<string>
    label?: Maybe<string>
    cancelButtonText?: string
    submitButtonText?: string
    submitCallback: (value) => void
    cancelCallback?: () => void
  }) {
    this.$emit('showPromptModal', options)
  }

  showDeleteConfirmModal(message: string, callback: () => void) {
    this.$emit('showDeleteConfirmModal', message, callback)
  }

  showGenericModal() {
    this.$emit('showGenericModal')
  }

  hideGenericModal() {
    this.$emit('hideGenericModal')
  }

  openAddToBucketFormModal(
    itemTitle: string,
    itemType: AddToBucketItemType,
    itemIds: number[],
    callbackAfterSuccess: () => void = () => {}
  ) {
    this.$emit('openAddToBucketFormModal', itemTitle, itemType, itemIds, callbackAfterSuccess)
  }

  openEventFormModal(eventable, project?) {
    this.$emit('openEventFormModal', eventable, project)
  }

  openEventFormModalEdit(event) {
    this.$emit('openEventFormModalEdit', event)
  }
  openFollowUpEventFormModal(event) {
    this.$emit('openFollowUpEventFormModal', event)
  }

  openRevenueFormModal(project?) {
    this.$emit('openRevenueFormModal', project)
  }

  openRevenueFormModalEdit(revenue) {
    this.$emit('openRevenueFormModalEdit', revenue)
  }

  // region person suggestion
  showPersonSuggestionModal(people: GetPeopleByNameQuery['people']) {
    this.$emit('showPersonSuggestionModal', people)
  }

  ignorePersonSuggestion() {
    this.$emit('ignorePersonSuggestion')
  }

  selectSuggestedPerson() {
    this.$emit('selectSuggestedPerson')
  }

  // endregion
}

const plugin: Plugin = ({ req, res, store, $config }, inject) => {
  const eventBus = new EventBus({
    propsData: {
      $store: store,
      $config,
    },
  })
  inject('bus', eventBus)
}

export default plugin
