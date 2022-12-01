<template>
  <tr class="group">
    <td class="pl-4 pr-3 py-3 w-9 relative">
      <span class="absolute left-0 top-0 bottom-0 w-0.5 bg-green-500" v-if="isInFuture"></span>
      <div class="flex -space-x-2 items-center">
        <template v-if="displayUser">
          <nuxt-link :to="`/users/${event.user.id}`" v-if="event.user">
            <div v-if="areImagesDisplayed" class="small-foto">
              <LImg
                class="flex-none flex items-center justify-center bg-blue-100 ring-white ring-1 text-blue-600"
                v-tooltip="`${event.user.firstname} ${event.user.lastname}`"
                :image="event.user.foto ? event.user.foto.sizes.PROFILE_IMAGE : null"
              >
                {{ event.user.firstname.substr(0, 1) }}{{ event.user.lastname.substr(0, 1) }}
              </LImg>
            </div>
            <div v-else>{{ event.user.firstname }} {{ event.user.lastname }}</div>
          </nuxt-link>
          <span
            class="flex-none tbadge--blue flex items-center justify-center ring-white ring-2 w-12 h-12 rounded-full"
            v-tooltip="'No user assigned to this event'"
            v-else
          >
            --
          </span>
        </template>
        <template v-if="displayEventable">
          <nuxt-link
            v-if="
              event.eventable &&
              (event.eventable.__typename === 'Client' || event.eventable.__typename === 'Candidate') &&
              event.eventable.person
            "
            :to="`/${event.eventable.__typename === 'Client' ? 'clients' : 'candidates'}/${event.eventable.id}`"
            class="small-foto"
          >
            <LImg
              class="overflow-hidden ring-white ring-2"
              :image="event.eventable.person.foto ? event.eventable.person.foto.sizes.PROFILE_IMAGE : null"
              v-tooltip="event.eventable.__typename + ': ' + event.eventable.person.full_name"
            >
              <IHUserFilled class="w-12 h-12 text-gray-400 mt-3" />
            </LImg>
          </nuxt-link>
          <nuxt-link
            v-else-if="event.eventable && event.eventable.__typename === 'Company'"
            :to="`/companies}/${event.eventable.id}`"
            class="small-foto"
          >
            <LImg
              class="overflow-hidden ring-white ring-2"
              :image="event.eventable.logo ? event.eventable.logo.sizes.PROFILE_IMAGE : null"
              v-tooltip="event.eventable.__typename + ': ' + event.eventable.aliasOrName"
            >
              <IHOfficeBuilding class="w-8 h-8 text-gray-400" />
            </LImg>
          </nuxt-link>
          <template v-else>
            <span class="w-12 h-12"> </span>
          </template>
        </template>
      </div>
    </td>
    <td class="px-3 py-3 text-center">
      <div class="text-xs text-green-600 mb-0.5" v-if="isInFuture">Upcoming</div>
      <div class="">{{ event.happened_at | date }}</div>
      <div class="text-gray-500 text-xs">{{ event.happened_at | time }}</div>
    </td>
    <td class="px-3 py-3">
      <span class="flex flex-col items-start whitespace-nowrap">
        <span class="tbadge text-xs rounded-full" :class="eventBadgeColor">
          {{ event.group | replaceUnderscoreWithSpace }}
        </span>
        <span class="px-2.5 mt-0.5 text-xs text-gray-500" v-if="event.type">
          {{ event.type | replaceUnderscoreWithSpace }}
        </span>
      </span>
    </td>
    <td class="px-3 py-3 leading-normal w-full">
      <nuxt-link class="font-bold mb-1" v-if="event.project" :to="`/projects/${event.project.id}`">
        {{ event.project.title }}</nuxt-link
      >
      <div
        class="w-full"
        :class="{ 'cursor-pointer': noteRest, 'whitespace-pre-line': displayFullNote }"
        @click="displayFullNote = !displayFullNote"
      >
        <!--
        -->{{ shortNote }}
        <template v-if="noteRest">
          <template v-if="displayFullNote"> {{ noteRest }}</template>
          <template v-else>...</template> </template
        ><!--
    --></div
      >
    </td>
    <td class="px-4 py-3 relative">
      <div
        class="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out bg-white absolute top-0 bottom-0 right-0 px-4"
      >
        <button
          type="button"
          class="tbtn-icon tbtn-icon--small tbtn--white"
          v-tooltip="{ content: 'Copy text to clipboard', classes: ['tooltip--white'] }"
          @click="copyTextToClipboard"
          v-if="event.notes"
        >
          <IHDuplicate class="w-5 h-5" />
        </button>
<!--        <button-->
<!--          v-if="isEmployee"-->
<!--          type="button"-->
<!--          class="tbtn-icon tbtn-icon&#45;&#45;small tbtn&#45;&#45;blue"-->
<!--          @click="overviewEvent"-->
<!--          v-tooltip="{ content: 'Show details', classes: ['tooltip&#45;&#45;blue'] }"-->
<!--        >-->
<!--          <IHEye class="w-5 h-5" />-->
<!--        </button>-->
        <template v-if="isEditable">
<!--          <button-->
<!--            class="tbtn-icon tbtn&#45;&#45;green tbtn-icon&#45;&#45;small relative"-->
<!--            @click="addFollowUpEvent"-->
<!--            v-tooltip="{ content: 'Add Follow Up Event', classes: ['tooltip&#45;&#45;green'] }"-->
<!--          >-->
<!--            <IHCalendar class="w-4 h-4 relative -left-[3px] -bottom-0.5" />-->
<!--            <IHPlus class="w-4 h-4 absolute right-0 top-0.5" />-->
<!--          </button>-->
          <button
            type="button"
            class="tbtn-icon tbtn-icon--small tbtn--white"
            v-tooltip="{ content: 'Edit Event', classes: ['tooltip--white'] }"
            @click="editEvent"
          >
            <IHPencil class="w-5 h-5" />
          </button>
          <button
            type="button"
            class="tbtn-icon tbtn-icon--small tbtn--red"
            v-tooltip="{ content: 'Delete Event', classes: ['tooltip--red'] }"
            @click="deleteEvent"
          >
            <IHDelete class="w-5 h-5" />
          </button>
        </template>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import IHDelete from '~/components/globals/icons/heroicons/IHDelete.vue'
import {
  DeleteEventMutationVariables,
  EventGroup,
  EventType,
  EventWithUserAndProjectAndEventableFragment,
  EventWithUserAndProjectFragment,
  EventWithUserFragment,
  UserRole,
  Event,
} from '~/graphql/GQLTypes'
import DeleteEvent from '~/graphql/ressources/events/DeleteEvent.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import IHEye from '~/components/globals/icons/heroicons/IHEye.vue'
import IHOfficeBuilding from '~/components/globals/icons/heroicons/IHOfficeBuilding.vue'
import IHDuplicate from '~/components/globals/icons/heroicons/IHDuplicate.vue'
import copyToClipboard from '~/helpers/copyToClipboard'
import IHCalendar from '~/components/globals/icons/heroicons/IHCalendar.vue'
import IHPlus from '~/components/globals/icons/heroicons/IHPlus.vue'
import { namespace } from 'nuxt-property-decorator'

@Component({
  components: { IHPlus, IHCalendar, IHDuplicate, IHOfficeBuilding, IHEye, IHUserFilled, IHDelete, IHPencil },
})
export default class EventTableRow extends Vue {
  @Prop()
  event!: (EventWithUserFragment | EventWithUserAndProjectFragment | EventWithUserAndProjectAndEventableFragment) &
    Pick<Event, 'project'> &
    Pick<Event, 'eventable'>

  @Prop({ default: true })
  displayUser?: boolean

  @Prop({ default: false })
  displayEventable?: boolean

  @Prop({ default: true })
  areImagesDisplayed!: boolean

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  shortNote = ''
  noteRest = ''

  displayFullNote = false
  isInFuture = false

  private maxStrLength = 120

  get isEditable() {
    return (
      this.isEmployee &&
      this.event &&
      this.event.user &&
      this.event.user.id === this.$store.state.account.user.id &&
      ![EventGroup.OnHold, EventGroup.Reject, EventGroup.Reactivated].includes(this.event.group)
    )
  }

  get eventBadgeColor() {
    if (this.event.group === EventGroup.Reactivated || this.event.group === EventGroup.Like) {
      return 'tbadge--green'
    }

    if (
      this.event.group === EventGroup.Reject ||
      (this.event.group === EventGroup.Offer && this.event.type === EventType.Rejected) ||
      this.event.group === EventGroup.Unlike
    ) {
      return 'tbadge--red'
    }

    return 'tbadge--blue'
  }

  @Watch('event.notes', { immediate: true })
  onEventNotesChanged() {
    if (this.event && this.event.notes) {
      if (this.event.notes.length > this.maxStrLength) {
        const spaceIndex = this.event.notes.substr(0, this.maxStrLength).lastIndexOf(' ')
        this.shortNote = this.event.notes.substr(0, spaceIndex)
        this.noteRest = this.event.notes.substr(spaceIndex)
      } else {
        this.shortNote = this.event.notes
        this.noteRest = ''
      }
    } else {
      this.shortNote = ''
      this.noteRest = ''
    }
  }

  @Watch('event.happened_at', { immediate: true })
  onEventHappenedAtChanged() {
    const eventDate = new Date(this.event!.happened_at)
    this.isInFuture = new Date() < eventDate
  }

  created() {}

  overviewEvent() {
    this.$emit('onOverviewEvent', this.event)
  }

  addFollowUpEvent() {
    this.$bus.openFollowUpEventFormModal(this.event)
  }

  editEvent() {
    this.$bus.openEventFormModalEdit(this.event)
  }

  copyTextToClipboard() {
    copyToClipboard(this.event.notes)
  }

  deleteEvent() {
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this event?', () => {
      const variables: DeleteEventMutationVariables = {
        id: this.event.id,
      }
      this.$apollo
        .mutate({
          mutation: DeleteEvent,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('Event was successfully removed', 3000)
          this.$emit('onEventDeleted', this.event)
          // TODO: remove following like by utilising emitted event
          this.$store.commit('project/removeClientEvent', this.event.id)
          await this.$apollo.provider.defaultClient.clearStore()
        })
        .catch((err) => {
          this.$bus.showErrorModal({
            errors: apolloParseErrors(err),
          })
        })
    })
  }
}
</script>
