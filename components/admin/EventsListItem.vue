<template>
  <div class="event" v-if="event && !isDeleted" :class="{ 'event--upcoming': isInFuture }">
    <div
      class="flex-none self-start mr-2.5 rounded-full border border-blue-700 text-white flex items-center justify-center bg-blue-700 w-7 h-7 text-base"
      v-tooltip="event.user ? `${event.user.firstname} ${event.user.lastname}` : 'No user assigned to this event'"
      v-if=""
    >
      {{ event.user ? event.user.firstname.substr(0, 1) + ' ' + event.user.lastname.substr(0, 1) : '--' }}
    </div>
    <div class="event__details">
      <div>
        <span :class="`text-${eventColor}`">
          <span class="tbadge" :class="`bg-${eventColor}-50 text-${eventColor}-700`">{{
            event.group | replaceUnderscoreWithSpace
          }}</span>
          <template v-if="event.type">
            {{ event.type | replaceUnderscoreWithSpace }}
          </template>
        </span>
        <span class="text-xs text-gray-400">
          {{ event.happened_at | datetime }}
          <span class="text-green-700" v-if="isInFuture">(upcoming)</span>
        </span>

        <template v-if="isEditable">
          <button type="button" class="action-btn text-orange-700 edit-btn hover:underline" @click="editEvent">
            Edit
          </button>
          <button type="button" class="action-btn text-red-700 hover:underline" @click="deleteEvent"> Delete </button>
        </template>
      </div>
      <div class="event__details__eventable" v-if="displayEventable">
        <template v-if="event.eventable.__typename === 'Client'">
          <span class="text-blue-700">Client:</span>
          <nuxt-link :to="`/clients/${event.eventable.id}`">
            {{ event.eventable.person.title }} {{ event.eventable.person.firstname }}
            {{ event.eventable.person.lastname }}
          </nuxt-link>
        </template>
        <template v-if="event.eventable.__typename === 'Candidate'">
          <span class="text-blue-700">Candidate:</span>
          <nuxt-link :to="`/candidates/${event.eventable.id}`">
            {{ event.eventable.person.title }} {{ event.eventable.person.firstname }}
            {{ event.eventable.person.lastname }}
          </nuxt-link>
        </template>
      </div>
      <nuxt-link v-if="event.project" class="event__details__project" :to="`/projects/${event.project.id}`">
        {{ event.project.title }}
      </nuxt-link>
      <span
        v-if="shortNote"
        class="text-xs text-gray-600 whitespace-pre-line"
        :class="{ 'cursor-pointer': noteRest }"
        @click="displayFullNote = !displayFullNote"
        ><!--
        -->{{ shortNote
        }}<template v-if="noteRest"
          ><template v-if="displayFullNote"> {{ noteRest }}</template
          ><template v-else>...</template></template
        ><!--
      --></span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import {
  DeleteEventMutationVariables,
  EventGroup,
  EventType,
  EventWithUserAndProjectAndEventableFragment,
  EventWithUserAndProjectFragment,
  EventWithUserFragment,
} from '~/graphql/GQLTypes'
import { State } from '~/node_modules/nuxt-property-decorator'
import DeleteEvent from '@/graphql/ressources/events/DeleteEvent.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'

@Component({
  components: {},
})
export default class EventsList extends Vue {
  @Prop()
  event!: EventWithUserFragment | EventWithUserAndProjectFragment | EventWithUserAndProjectAndEventableFragment
  @Prop({ default: false })
  displayEventable?: boolean

  shortNote = ''
  noteRest = ''

  displayFullNote = false
  isInFuture = false
  isDeleted = false

  private maxStrLength = 100

  @State((state) => state.account.user)
  accountUser

  get isEditable() {
    return (
      this.event &&
      this.accountUser &&
      this.event.user &&
      this.event.user.id === this.accountUser.id &&
      ![EventGroup.OnHold, EventGroup.Reject, EventGroup.Reactivated].includes(this.event.group)
    )
  }

  get eventColor() {
    if (this.isInFuture || this.event.group === EventGroup.Reactivated) {
      return 'green'
    }

    if (
      this.event.group === EventGroup.Reject ||
      (this.event.group === EventGroup.Offer && this.event.type === EventType.Rejected)
    ) {
      return 'red'
    }

    return 'primary'
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

  editEvent() {
    this.$bus.openEventFormModalEdit(this.event)
  }

  deleteEvent() {
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this event?', () => {
      const variables: DeleteEventMutationVariables = {
        id: this.event!.id,
      }
      this.$apollo
        .mutate({
          mutation: DeleteEvent,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('Event was successfully removed', 3000)
          this.isDeleted = true
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

<style scoped lang="scss">
@import '../../assets/scss/variables';

.event {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.event__details {
  display: flex;
  flex-direction: column;
}

.event__details__eventable {
  font-size: 13px;
}

.event__details__project {
  font-size: 13px;
}

.action-btn {
  font-size: 13px;
  opacity: 0;
  transform: translateX(5px);
  transition: all 0.2s ease;
}

.event:hover {
  .action-btn {
    opacity: 0.7;
    transform: translateX(0);

    &:hover {
      opacity: 1;
    }
  }
}
</style>
