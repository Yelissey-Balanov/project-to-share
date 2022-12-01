<template>
  <div>
    <client-only>
      <SweetModal
        :blocking="true"
        ref="modalEventForm"
        :title="followUpEvent ? 'Create follow up event' : event ? 'Edit event' : 'Create new event'"
      >
        <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver" class="space-y-6">
          <LabeledValue
            v-if="followUpEvent"
            :value="followUpEvent"
            formatted="{group} {type}"
            label="Event"
          />
          <div class="grid grid-cols-2 gap-4">
            <LabeledValue
              v-if="!client && !candidate && !company"
              value="Loading..."
              label="Candidate, client or company"
            />
            <LabeledValue v-if="!client && !candidate && !company && !project" value="Loading..." label="Project" />

            <LabeledValue v-if="client" :value="client" formatted="{person.full_name}" label="Client" />
            <LabeledValue v-if="candidate" :value="candidate" formatted="{person.full_name}" label="Candidate" />
            <LabeledValue v-if="company" :value="company" formatted="{aliasOrName}" label="Company" />

            <LabeledValue v-if="project" :value="project" formatted="{title}" label="Project" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <FSelectSimple
              v-model="form.group"
              label="Group"
              :options="eventGroupOptions"
              :nullable="false"
              :rules="'required'"
              errorLabel="group"
            />
            <FSelectSimple
              v-model="form.type"
              label="Type"
              :options="eventTypeOptions"
              :nullable="false"
              :rules="'required'"
              errorLabel="type"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <FDatePicker v-model="form.day" label="Day" rules="required" errorLabel="day" />
            <FInput v-model="form.time" label="Time (HH:MM)" :rules="'time'" errorLabel="time" />
          </div>
          <div class="grid grid-cols-1 gap-4" v-if="isPlacedStartAtVisible">
            <FDatePicker
              v-model="form.placed_start_at"
              label="Placement start"
              :rules="isPlacedStartAtVisible ? 'required' : ''"
              errorLabel="new position start"
            />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FTextarea v-model="form.notes" label="Notes" />
          </div>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="submit" class="tbtn tbtn--blue">
              <template v-if="!isSubmitting">
                <template v-if="!event"> Create event</template>
                <template v-else> Update event</template>
              </template>
              <template v-else>
                <template v-if="!event"> Creating event...</template>
                <template v-else> Updating event...</template>
              </template>
            </button>
          </div>
        </ValidationObserver>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import {
  Candidate,
  Client,
  CreateEventMutation,
  CreateEventMutationVariables,
  Event,
  EventGroup,
  EventType,
  GetEventQuery,
  GetEventQueryVariables,
  Maybe,
  Project,
  RefreshDataAfterPlacingEventQueryVariables,
  UpdateEventMutation,
  UpdateEventMutationVariables,
  UpdateProjectMutation,
  UpdateProjectMutationVariables,
  RefreshDataAfterPlacingEventQuery,
  Company,
} from '~/graphql/GQLTypes'
import formatSnakeCaseString from '~/helpers/formatSnakeCaseString'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import { validateObserver } from '~/helpers/validationHelpers'
import { ValidationObserver } from 'vee-validate'
import {
  groupedCandidateEventTypeOptions,
  groupedCandidateWithinProjectEventTypeOptions,
  groupedClientEventTypeOptions,
} from '~/helpers/eventHelpers'
import CreateEvent from '@/graphql/ressources/events/CreateEvent.gql'
import GetEvent from '@/graphql/ressources/events/GetEvent.gql'
import UpdateEvent from '@/graphql/ressources/events/UpdateEvent.gql'
import UpdateProject from '@/graphql/ressources/projects/UpdateProject.gql'
import RefreshDataAfterPlacingEvent from '@/graphql/ressources/projects/RefreshDataAfterPlacingEvent.gql'
import { State } from '~/node_modules/nuxt-property-decorator'
import { DateTime } from 'luxon'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { toISODate } from '~/helpers/dateHelpers'

@Component({
  components: { LabeledValue, ValidationObserver },
})
export default class AddEventModal extends Vue {
  $refs!: {
    modalEventForm: any
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  candidate: Maybe<Candidate> = null
  client: Maybe<Client> = null
  company: Maybe<Company> = null
  project: Maybe<Project> = null
  event: Maybe<Event> = null
  followUpEvent: Maybe<Event> = null

  form: {
    group: Maybe<EventGroup>
    type: Maybe<EventType>
    notes: Maybe<string>
    day: Maybe<Date>
    time: Maybe<string>
    placed_start_at: Maybe<Date>
  } = {
    group: EventGroup.Contact,
    type: null,
    notes: null,
    day: null,
    time: null,
    placed_start_at: null,
  }

  eventGroupOptions = {}
  eventTypeOptions = {}

  isSubmitting = false

  @State((state) => state.account.user)
  accountUser

  get isPlacedStartAtVisible() {
    return !this.event && this.form.group === EventGroup.Offer && this.form.type === EventType.Accepted
  }

  mounted() {
    this.$bus.$on('openEventFormModal', (eventable: Candidate | Client | Company, project?: Project) => {
      this.event = null
      this.client = null
      this.candidate = null
      this.company = null
      if (eventable && eventable.__typename === 'Client') {
        this.client = eventable
      } else if (eventable && eventable.__typename === 'Candidate') {
        this.candidate = eventable
      } else if (eventable && eventable.__typename === 'Company') {
        this.company = eventable
      } else {
        console.error('candidateOrClient parameter is not valid!')
        return
      }
      this.project = project ? project : null

      // reset form values
      this.form.notes = null
      this.form.group = EventGroup.Contact
      this.form.placed_start_at = null

      // set current timestamp as time value
      const datetime = DateTime.local()
      this.form.day = datetime.toJSDate()
      this.form.time = datetime.toFormat('HH:mm')

      this.$refs.modalEventForm!.open()
    })

    this.$bus.$on('openFollowUpEventFormModal', (event?: Event) => {
      if (event && event.__typename === 'Event') {
        this.client = null
        this.candidate = null
        this.company = null
        this.project = null
        this.followUpEvent = event
      } else {
        console.error('event parameter is not valid!')
        return
      }

      // reset form values
      this.form.notes = null
      this.form.group = EventGroup.Contact
      this.form.placed_start_at = null

      // set current timestamp as time value
      const datetime = DateTime.local()
      this.form.day = datetime.toJSDate()
      this.form.time = datetime.toFormat('HH:mm')

      // load project and candidate/client
      this.$apollo
        .query<GetEventQuery>({
          query: GetEvent,
          variables: {
            id: this.followUpEvent.id,
          } as GetEventQueryVariables,
        })
        .then(({ data }) => {
          if (data.event!.eventable!.__typename === 'Candidate') {
            this.candidate = data.event!.eventable! as Candidate
          } else if (data.event!.eventable!.__typename === 'Client') {
            this.client = data.event!.eventable! as Client
          } else if (data.event!.eventable!.__typename === 'Company') {
            this.company = data.event!.eventable! as Company
          }
          this.project = data.event!.project as Project
        })

      this.$refs.modalEventForm!.open()
    })

    this.$bus.$on('openEventFormModalEdit', (event: Event) => {
      if (event && event.__typename === 'Event') {
        this.client = null
        this.candidate = null
        this.company = null
        this.project = null
        this.event = event
      } else {
        console.error('event parameter is not valid!')
        return
      }

      // reset form values
      this.form.notes = this.event.notes!
      this.form.group = null
      this.form.type = null
      this.form.placed_start_at = null

      // set current timestamp as time value
      const datetime = DateTime.fromISO(this.event.happened_at)
      this.form.day = datetime.toJSDate()
      this.form.time = datetime.toFormat('HH:mm')

      // load project and candidate/client
      this.$apollo
        .query<GetEventQuery>({
          query: GetEvent,
          variables: {
            id: this.event.id,
          } as GetEventQueryVariables,
        })
        .then(({ data }) => {
          if (data.event!.eventable!.__typename === 'Candidate') {
            this.candidate = data.event!.eventable! as Candidate
          } else if (data.event!.eventable!.__typename === 'Client') {
            this.client = data.event!.eventable! as Client
          } else if (data.event!.eventable!.__typename === 'Company') {
            this.company = data.event!.eventable! as Company
          }
          this.project = data.event!.project as Project
          this.form.group = data.event!.group
          this.form.type = data.event!.type!
        })

      this.$refs.modalEventForm!.open()
    })
  }

  @Watch('project')
  @Watch('candidate')
  onCandidateOrProjectChanged() {
    const optionsSource = this.project
      ? groupedCandidateWithinProjectEventTypeOptions
      : groupedCandidateEventTypeOptions
    const eventGroupOptions = {}
    Object.keys(optionsSource).forEach((eventGroupValue) => {
      eventGroupOptions[eventGroupValue] = formatSnakeCaseString(eventGroupValue)
    })
    this.eventGroupOptions = eventGroupOptions
    this.onGroupChanged()
  }

  @Watch('client')
  @Watch('company')
  onClientChanged() {
    const eventGroupOptions = {}
    Object.keys(groupedClientEventTypeOptions).forEach((eventGroupValue) => {
      eventGroupOptions[eventGroupValue] = formatSnakeCaseString(eventGroupValue)
    })
    this.eventGroupOptions = eventGroupOptions
    this.onGroupChanged()
  }

  @Watch('form.group')
  onGroupChanged() {
    if (!this.form.group) {
      this.eventGroupOptions = { loading: 'Loading...' }
      this.eventTypeOptions = { loading: 'Loading...' }
      return
    }
    if (this.client || this.company) {
      this.eventTypeOptions = groupedClientEventTypeOptions[this.form.group]
    } else if (this.candidate) {
      this.eventTypeOptions = groupedCandidateWithinProjectEventTypeOptions[this.form.group]
    } else {
      // console.error('Neither client nor candidate is defined. Could not fetch event type options');
      return
    }
    if (this.event && this.event.type && Object.keys(this.eventTypeOptions).includes(this.event.type!)) {
      this.form.type = this.event.type
    } else {
      this.form.type = Object.keys(this.eventTypeOptions)[0] as EventType
    }
  }

  async onSubmit() {
    if (this.isSubmitting) {
      return
    }

    if (!(await validateObserver(this.$refs.formValidationObserver))) {
      return
    }

    this.isSubmitting = true
    const updateOrCreate = this.event ? this.updateEvent : this.createNewEvent

    try {
      await updateOrCreate()
      await this.updateProjectPlacedStartAt()
      await this.$apollo.provider.defaultClient.clearStore()
      await this.updateCandidateAndProjectStates()

      this.isSubmitting = false
      if (this.$refs.modalEventForm) {
        this.$refs.modalEventForm.close()
      }
      this.$bus.showSuccessModal('Event was successfully created', 2000)
    } catch (err) {
      this.isSubmitting = false
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  private async createNewEvent() {
    let eventable = {
      type: '',
      id: 0,
    }
    if (this.client) {
      eventable.type = 'App\\Client'
      eventable.id = this.client.id
    } else if (this.candidate) {
      eventable.type = 'App\\Candidate'
      eventable.id = this.candidate.id
    } else if (this.company) {
      eventable.type = 'App\\Company'
      eventable.id = this.company.id
    }
    const variables: CreateEventMutationVariables = {
      input: {
        eventable_type: eventable.type,
        eventable_id: eventable.id,
        project_id: this.project ? this.project.id : null,
        user_id: this.accountUser.id,
        group: this.form.group!,
        type: this.form.type!,
        notes: this.form.notes,
        happened_at: DateTime.fromFormat(`${toISODate(this.form.day)} ${this.form.time}`, 'yyyy-MM-dd HH:mm')
          .toUTC()
          .toISO(),
      },
    }

    const { data } = await this.$apollo.mutate<CreateEventMutation>({
      mutation: CreateEvent,
      variables,
    })

    if (this.candidate) {
      this.$store.commit('candidate/addEvent', { event: data!.createEvent })
      if (this.project) {
        this.$store.commit('project/addEventToCandidateInList', {
          event: data!.createEvent,
          candidate: this.candidate,
        })
      }
    } else if (this.client) {
      this.$store.commit('client/addEvent', { event: data!.createEvent })
      if (this.project) {
        this.$store.commit('project/addClientEvent', { event: data!.createEvent })
      }
    } else if (this.company) {
      this.$store.commit('company/addEvent', { event: data!.createEvent })
    }
  }

  private async updateEvent() {
    const variables: UpdateEventMutationVariables = {
      id: this.event!.id,
      input: {
        group: this.form.group!,
        type: this.form.type!,
        notes: this.form.notes,
        happened_at: DateTime.fromFormat(`${toISODate(this.form.day)} ${this.form.time}`, 'yyyy-MM-dd HH:mm')
          .toUTC()
          .toISO(),
      },
    }

    const { data } = await this.$apollo.mutate<UpdateEventMutation>({
      mutation: UpdateEvent,
      variables,
    })

    this.$store.commit('event/updateEvent', { event: this.event, responseData: data!.updateEvent })
  }

  private async updateProjectPlacedStartAt() {
    if (!this.isPlacedStartAtVisible) {
      return
    }

    const variables: UpdateProjectMutationVariables = {
      id: this.project!.id,
      input: {
        placed_start_at: toISODate(this.form.placed_start_at),
      },
    }

    const { data } = await this.$apollo.mutate<UpdateProjectMutation>({
      mutation: UpdateProject,
      variables,
    })

    this.project!.placed_start_at = variables.input.placed_start_at
  }

  private async updateCandidateAndProjectStates() {
    if (!this.candidate || !this.project) {
      return
    }
    // fetch candidate status in project, project status, candidates data
    const variables: RefreshDataAfterPlacingEventQueryVariables = {
      projectId: this.project.id,
      candidate_id: this.candidate.id,
    }

    const { data } = await this.$apollo.query<RefreshDataAfterPlacingEventQuery>({
      query: RefreshDataAfterPlacingEvent,
      variables,
    })

    this.$store.commit('project/refreshCandidateInProjectData', {
      candidate: this.candidate,
      data: data.project!.candidate,
    })

    this.project.status = data.project!.status
    this.project.status_note = data.project!.status_note
    this.project.placed_start_at = data.project!.placed_start_at
    this.project.placed_candidate = {
      ...this.project.placed_candidate,
      ...(data.project!.placed_candidate as any),
    }
  }

  destroyed() {
    this.$bus.$off('openEventFormModal')
    this.$bus.$off('openEventFormModalEdit')
  }
}
</script>
