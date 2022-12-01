<template>
  <client-only>
    <SweetModal ref="modal" :title="modalTitle">
      <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
        <!--          <FTextarea v-model="form.notes" label="Notes" />-->

        <template v-if="currentPage === Page.DATE_SELECTION">
          <h3 class="text-center font-semibold text-xl mb-6">Please select days</h3>
          <v-calendar
            locale="en"
            :firstDayOfWeek="2"
            class="mx-auto block border-0"
            :attributes="calendarAttributes"
            @dayclick="onDayClick"
            :columns="calendarColumns"
            :max-date="new Date()"
            :from-page="calendarFromPage"
            transition="slide-h"
          />
          <div class="mt-8 flex justify-end">
            <button class="tbtn tbtn--blue" type="button" @click="nextStep()">Next</button>
          </div>
        </template>

        <template v-if="currentPage === Page.HOURS_AND_NOTES_INPUT">
          <h3 class="text-center font-semibold text-xl mb-6">Please enter hours per day</h3>
          <WorkingHoursCalculationPreview
            :purchasing-daily-rate="candidate.candidate_project_pivot.purchasing_daily_rate"
            :retail-daily-rate="candidate.candidate_project_pivot.retail_daily_rate"
            :sum-units="sumUnits"
            :sum-days="form.selection.length"
            :is-hourly-rate="candidate.has_hourly_rate"
          />
          <div class="mt-8 grid grid-cols-5 gap-4">
            <template v-if="candidate.has_hourly_rate">
              <template v-for="item in form.selection">
                <FInput
                  class="col-span-2 md:col-span-1"
                  v-model="item.hours"
                  :label="item.dateStringified"
                  :rules="'required'"
                  :asFloat="true"
                  ref="hoursInput"
                />
                <FInput class="col-span-3 md:col-span-4" v-model="item.note" label="Note" />
              </template>
            </template>
            <template v-else>
              <FInput
                class="col-span-5"
                v-model="item.note"
                :label="`${item.dateStringified} Note`"
                v-for="item in form.selection"
                :key="`dn_${item.id}`"
              />
            </template>
          </div>
          <div class="mt-8 flex justify-between">
            <button class="tbtn tbtn--white" type="button" @click="previousStep()" key="back-btn">Back</button>
            <button class="tbtn tbtn--blue" type="button" @click="nextStep()">Next</button>
          </div>
        </template>

        <template v-if="currentPage === Page.PREVIEW">
          <h3 class="text-center font-semibold text-xl mb-6" v-if="!readOnly">Please confirm working time</h3>

          <div
            class="accent mb-6 -mx-8 px-8 whitespace-pre-line"
            :class="statusNoteClasses"
            v-if="!selectionWasChanged && workingHours && workingHours.status_note"
            >{{ workingHours.status_note }}</div
          >

          <v-calendar
            locale="en"
            :firstDayOfWeek="2"
            class="mx-auto block border-0 mb-6"
            :attributes="calendarPreviewAttributes"
            :columns="calendarColumns"
            :max-date="new Date()"
            :from-page="calendarFromPage"
            transition="slide-h"
          />

          <div class="mb-8">
            <div class="mb-2 flex items-center justify-between">
              <h4 class="text-center text-lg">Daily Notes</h4>

              <button type="button" class="tbtn tbtn--white" @click="displayUnitDetails = !displayUnitDetails">
                <template v-if="displayUnitDetails"> Hide daily notes</template>
                <template v-else> Show daily notes</template>
              </button>
            </div>
            <SlideUpDown class="ease-in-out" :active="displayUnitDetails" :duration="350">
              <WorkingHoursUnitsNotesTable
                :units="selectionWasChanged || !workingHours ? form.selection : workingHours.units"
              />
            </SlideUpDown>
          </div>

          <WorkingHoursCalculationPreview
            class="mb-6"
            :purchasing-daily-rate="candidate.candidate_project_pivot.purchasing_daily_rate"
            :retail-daily-rate="candidate.candidate_project_pivot.retail_daily_rate"
            :sum-units="sumUnits"
            :sum-days="form.selection.length"
            :is-hourly-rate="candidate.has_hourly_rate"
          />

          <div class="mt-8 flex justify-between space-x-2" v-if="!readOnly">
            <button
              class="tbtn tbtn--blue"
              type="button"
              @click="jumpToPage(Page.DATE_SELECTION)"
              v-if="workingHours && !selectionWasChanged"
            >
              Modify
            </button>
            <button class="tbtn tbtn--white" type="button" @click="previousStep()" key="back-btn" v-else>Back</button>
            <div class="flex space-x-2">
              <button
                class="tbtn tbtn--blue"
                type="button"
                @click="saveDraft()"
                v-if="canSaveDraft && !hideSaveDraftBtn"
              >
                Save draft
              </button>
              <button
                class="tbtn tbtn--green"
                type="button"
                @click="setSubmitAction(SubmitAction.SUBMIT_TO_CLIENT)"
                v-if="canSubmitToClient"
              >
                Submit to the client
              </button>
              <template v-if="canModify">
                <button
                  class="tbtn tbtn--blue"
                  type="button"
                  @click="setSubmitAction(SubmitAction.SUBMIT_TO_CANDIDATE)"
                >
                  Save changes and send to the candidate
                </button>
              </template>
              <template v-if="canAcceptOrDecline">
                <button class="tbtn tbtn--green" type="button" @click="setSubmitAction(SubmitAction.ACCEPT)">
                  Accept
                </button>
                <button class="tbtn tbtn--red" type="button" @click="setSubmitAction(SubmitAction.DECLINE)">
                  Decline
                </button>
              </template>
            </div>
          </div>
        </template>

        <template v-if="currentPage === Page.STATUS_NOTE_INPUT">
          <h3 class="text-center font-semibold text-xl mb-6">Would you like to write some notes?</h3>
          <FTextarea v-model="form.status_note" ref="notesInput" />
          <div class="mt-8 flex justify-between space-x-2">
            <button class="tbtn tbtn--white" type="button" @click="previousStep()" key="back-btn">Back</button>
            <div class="flex space-x-2">
              <button
                class="tbtn tbtn--green"
                type="button"
                @click="submitToClient()"
                v-if="currentSubmitAction === SubmitAction.SUBMIT_TO_CLIENT"
              >
                Submit to the client
              </button>
              <button
                class="tbtn tbtn--blue"
                type="button"
                @click="modifyAndSubmitToCandidate()"
                v-else-if="currentSubmitAction === SubmitAction.SUBMIT_TO_CANDIDATE"
              >
                Submit to the candidate
              </button>
              <button
                class="tbtn tbtn--green"
                type="button"
                @click="acceptWorkingHours()"
                v-else-if="currentSubmitAction === SubmitAction.ACCEPT"
              >
                Accept
              </button>
              <button
                class="tbtn tbtn--red"
                type="button"
                @click="declineWorkingHours()"
                v-else-if="currentSubmitAction === SubmitAction.DECLINE"
              >
                Decline
              </button>
            </div>
          </div>
        </template>
      </ValidationObserver>
    </SweetModal>
  </client-only>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import {
  ApproveWorkingHoursMutation,
  ApproveWorkingHoursMutationVariables,
  Candidate,
  CreateWorkingHoursMutation,
  CreateWorkingHoursMutationVariables,
  DeclineWorkingHoursMutation,
  DeclineWorkingHoursMutationVariables,
  Maybe,
  ModifyWorkingHoursByClientMutation,
  ModifyWorkingHoursByClientMutationVariables,
  Project,
  SubmitWorkingHoursRequestToClientMutation,
  SubmitWorkingHoursRequestToClientMutationVariables,
  UpdateWorkingHoursMutation,
  UpdateWorkingHoursMutationVariables,
  WorkingHoursFragment,
  WorkingHoursStatus,
} from '~/graphql/GQLTypes'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import { validateObserver } from '~/helpers/validationHelpers'
import { ValidationObserver } from 'vee-validate'
import CreateWorkingHours from '@/graphql/ressources/workingHours/CreateWorkingHours.gql'
import UpdateWorkingHours from '@/graphql/ressources/workingHours/UpdateWorkingHours.gql'
import SubmitWorkingHoursRequestToClient from '@/graphql/ressources/workingHours/SubmitWorkingHoursRequestToClient.gql'
import ModifyWorkingHoursByClient from '@/graphql/ressources/workingHours/ModifyWorkingHoursByClient.gql'
import ApproveWorkingHours from '@/graphql/ressources/workingHours/ApproveWorkingHours.gql'
import DeclineWorkingHours from '@/graphql/ressources/workingHours/DeclineWorkingHours.gql'
import { namespace } from '~/node_modules/nuxt-property-decorator'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { DateTime } from 'luxon'
import WorkingHoursCalculationPreview from '~/components/workingHours/WorkingHoursCalculationPreview.vue'
import { parseDateFromISO, toISODate } from '~/helpers/dateHelpers'
import WorkingHoursUnitsNotesTable from '~/components/workingHours/WorkingHoursUnitsNotesTable.vue'
import SlideUpDown from 'vue-slide-up-down'

enum Page {
  DATE_SELECTION = 'DATE_SELECTION',
  HOURS_AND_NOTES_INPUT = 'HOURS_AND_NOTES_INPUT',
  PREVIEW = 'PREVIEW',
  STATUS_NOTE_INPUT = 'STATUS_NOTE_INPUT',
}

enum SubmitAction {
  ACCEPT,
  DECLINE,
  SUBMIT_TO_CLIENT,
  SUBMIT_TO_CANDIDATE,
}

@Component({
  components: {
    WorkingHoursUnitsNotesTable,
    WorkingHoursCalculationPreview,
    LabeledValue,
    ValidationObserver,
    SlideUpDown,
  },
})
export default class WorkingHoursModal extends Vue {
  Page = Page
  SubmitAction = SubmitAction
  $refs!: {
    modal: any
    hoursInput: any
    notesInput: any
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  currentPage = Page.DATE_SELECTION
  currentSubmitAction: Maybe<SubmitAction> = null
  readOnly = false
  displayUnitDetails = false

  @Prop({ required: true })
  candidate!: Candidate

  @Prop({ required: true })
  project!: Project

  workingHours: Maybe<WorkingHoursFragment> = null

  form: {
    selection: Array<{
      id: string
      date: Date
      dateStringified: string
      hours: Maybe<number>
      note: Maybe<string>
    }>
    status_note: string
  } = {
    selection: [],
    status_note: '',
  }

  isSubmitting = false

  @(namespace('account').Getter('isCandidate'))
  isCandidate!: boolean

  @(namespace('account').Getter('isClient'))
  isClient!: boolean

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  hideSaveDraftBtn = false
  selectionWasChanged = false
  calendarFromPage: any = null

  get modalTitle() {
    if (!this.workingHours) {
      return 'Create new working hours report'
    } else {
      if (this.readOnly) {
        return 'Working hours report details'
      }
      switch (this.workingHours.status) {
        case WorkingHoursStatus.Draft:
          return 'Edit working hours report'
        case WorkingHoursStatus.ModifiedByClient:
        case WorkingHoursStatus.RequestedByCandidate:
          return 'Review working hours report'
      }
    }
    // return a space as title, to prevent additional style on sweet modal
    return ' '
  }

  get calendarColumns() {
    if (process.server) {
      return 1
    }
    /* @ts-ignore */
    return this.$screens({ default: 1, md: 2 })
  }

  get calendarAttributes() {
    return this.form.selection.map((date) => ({
      highlight: true,
      dates: date.date,
    }))
  }

  get calendarPreviewAttributes() {
    if (this.selectionWasChanged || !this.workingHours || !this.workingHours.units_diff) {
      return this.form.selection.map((date) => {
        const obj: any = {
          highlight: true,
          dates: date.date,
        }
        if (date.hours) {
          obj.popover = {
            label: `${date.hours} hour${date.hours! > 1 ? 's' : ''}`,
          }
        }
        return obj
      })
    }

    // if selection was not changed, then we should display differences in the calendar
    const attributesArray = this.form.selection.map((selection) => {
      const obj: any = {
        highlight: true,
        dates: selection.date,
      }
      let hours = `${selection.hours} hour${selection.hours! > 1 ? 's' : ''}`
      obj.popover = {
        label: '',
      }
      if (selection.hours) {
        obj.popover.label = hours
      }
      if (this.workingHours!.units_diff!.changed.includes(selection.id)) {
        obj.highlight = 'yellow'
        obj.popover.label = selection.hours ? `Changed to ${hours}` : 'Changed note'
      }
      if (this.workingHours!.units_diff!.new.includes(selection.id)) {
        obj.highlight = 'green'
        obj.popover.label = selection.hours ? `New entry: ${hours}` : 'This day was added'
      }
      return obj
    })
    this.workingHours!.units_diff!.removed.forEach((removedDateId) => {
      attributesArray.push({
        highlight: 'red',
        dates: parseDateFromISO(removedDateId),
        popover: {
          label: 'This day was removed',
        },
      })
    })

    return attributesArray
  }

  get sumUnits() {
    if (this.candidate.has_hourly_rate) {
      let hours = 0
      this.form.selection.forEach((s) => {
        if (s.hours) {
          hours += s.hours
        }
      })
      return hours
    } else {
      return this.form.selection.length
    }
  }

  get canSaveDraft() {
    return (
      (this.isEmployee || this.isCandidate) &&
      (!this.workingHours || (this.workingHours && this.workingHours.status === WorkingHoursStatus.Draft))
    )
  }

  get canSubmitToClient() {
    return (
      (this.isEmployee || this.isCandidate) &&
      (!this.workingHours ||
        (this.workingHours &&
          (this.workingHours.status === WorkingHoursStatus.Draft ||
            (this.workingHours.status === WorkingHoursStatus.ModifiedByClient && this.selectionWasChanged))))
    )
  }

  get canAcceptOrDecline() {
    return (
      !this.selectionWasChanged &&
      this.workingHours &&
      ((this.workingHours.status === WorkingHoursStatus.RequestedByCandidate && (this.isEmployee || this.isClient)) ||
        (this.workingHours.status === WorkingHoursStatus.ModifiedByClient && (this.isEmployee || this.isCandidate)))
    )
  }

  get canModify() {
    return (
      this.selectionWasChanged &&
      this.workingHours &&
      this.workingHours.status === WorkingHoursStatus.RequestedByCandidate &&
      (this.isEmployee || this.isClient)
    )
  }

  get statusNoteClasses() {
    const classes: string[] = []
    if (this.readOnly) {
      classes.push('-mt-6')
    }
    if (
      this.workingHours &&
      (this.workingHours.status === WorkingHoursStatus.ApprovedByClient ||
        this.workingHours.status === WorkingHoursStatus.ApprovedByCandidate)
    ) {
      classes.push('accent--green')
    } else if (
      this.workingHours &&
      (this.workingHours.status === WorkingHoursStatus.DeclinedByClient ||
        this.workingHours.status === WorkingHoursStatus.DeclinedByCandidate)
    ) {
      classes.push('accent--red')
    } else {
      classes.push('accent--blue')
    }
    return classes
  }

  onDayClick(day) {
    const idx = this.form.selection.findIndex((d) => d.id === day.id)
    if (idx >= 0) {
      this.form.selection.splice(idx, 1)
    } else {
      this.form.selection.push({
        id: day.id,
        date: day.date,
        dateStringified: DateTime.fromJSDate(day.date).toLocaleString({
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        hours: null,
        note: null,
      })
    }
  }

  async open(
    opt: {
      workingHours?: Maybe<WorkingHoursFragment>
      page?: Maybe<Page>
      hideSaveDraftBtn?: boolean
      readOnly?: boolean
    } = {}
  ) {
    this.workingHours = opt.hasOwnProperty('workingHours') ? opt.workingHours! : null
    this.hideSaveDraftBtn = opt.hasOwnProperty('hideSaveDraftBtn') ? opt.hideSaveDraftBtn! : false
    this.readOnly = opt.hasOwnProperty('readOnly') ? opt.readOnly! : false

    if (this.workingHours) {
      this.form.selection = this.workingHours.units.map((unit) => {
        const date = parseDateFromISO(unit.date)!
        return {
          hours: unit.hours!,
          note: unit.note!,
          date: date,
          dateStringified: DateTime.fromJSDate(date).toLocaleString({
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
          id: unit.date,
        }
      })
    } else {
      this.form.selection = []
    }
    this.form.status_note = ''

    this.currentSubmitAction = null
    this.jumpToPage(opt.hasOwnProperty('page') ? opt.page! : Page.DATE_SELECTION)
    await this.$nextTick()

    this.selectionWasChanged = false

    if (this.$refs.modal) {
      this.$refs.modal.open()
    } else {
      console.warn('modal object is not accessible')
    }
  }

  async nextStep() {
    switch (this.currentPage) {
      case Page.DATE_SELECTION:
        this.jumpToPage(Page.HOURS_AND_NOTES_INPUT)
        break
      case Page.HOURS_AND_NOTES_INPUT:
        if (!(await validateObserver(this.$refs.formValidationObserver, false))) {
          return
        }
        this.jumpToPage(Page.PREVIEW)
        break
    }
  }

  previousStep() {
    switch (this.currentPage) {
      case Page.HOURS_AND_NOTES_INPUT:
        this.jumpToPage(Page.DATE_SELECTION)
        break
      case Page.PREVIEW:
        this.jumpToPage(Page.HOURS_AND_NOTES_INPUT)
        break
      case Page.STATUS_NOTE_INPUT:
        this.jumpToPage(Page.PREVIEW)
        break
    }
  }

  jumpToPage(nextPage: Page) {
    switch (nextPage) {
      case Page.DATE_SELECTION:
        this.calculateCalendarFromPage()
        this.currentPage = nextPage
        break
      case Page.HOURS_AND_NOTES_INPUT:
        this.sortFormSelection()
        this.currentPage = nextPage
        // this.$nextTick(() => {
        //   this.$refs.hoursInput[0].focus()
        // })
        break
      case Page.PREVIEW:
        this.sortFormSelection()
        this.checkForChanges()
        this.calculateCalendarFromPage()
        this.displayUnitDetails = false
        this.currentPage = nextPage
        break
      case Page.STATUS_NOTE_INPUT:
        this.currentPage = nextPage
        this.$nextTick(() => {
          this.$refs.notesInput.focus()
        })
        break
    }
    this.$refs.modal.$refs.content.scrollTop = 0
  }

  setSubmitAction(submitAction: SubmitAction) {
    this.currentSubmitAction = submitAction
    this.jumpToPage(Page.STATUS_NOTE_INPUT)
  }

  async saveDraft() {
    if (this.isSubmitting || !(this.isCandidate || this.isEmployee)) {
      return
    }

    this.isSubmitting = true
    const updateOrCreate = this.workingHours ? this.updateDraftWorkingHours : this.createWorkingHours

    try {
      const workingHoursUpdate = await updateOrCreate()
      await this.$apollo.provider.defaultClient.clearStore()

      this.isSubmitting = false
      this.$refs.modal!.close()
      this.$bus.showSuccessModal('Working hours draft were successfully saved', 2000)
      this.$emit('workingHoursUpdate', workingHoursUpdate)
    } catch (err) {
      this.isSubmitting = false
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createWorkingHours() {
    const variables: CreateWorkingHoursMutationVariables = {
      input: {
        candidate_id: this.candidate!.id,
        project_id: this.project!.id,
        units: this.generateUnitsInput(),
      },
    }

    const { data } = await this.$apollo.mutate<CreateWorkingHoursMutation>({
      mutation: CreateWorkingHours,
      variables,
    })

    this.selectionWasChanged = false
    return data!.createWorkingHours!
  }

  async updateDraftWorkingHours() {
    const variables: UpdateWorkingHoursMutationVariables = {
      input: {
        id: this.workingHours!.id,
        units: this.generateUnitsInput(),
      },
    }

    const { data } = await this.$apollo.mutate<UpdateWorkingHoursMutation>({
      mutation: UpdateWorkingHours,
      variables,
    })

    return data!.updateWorkingHours
  }

  async submitToClient() {
    if (this.isSubmitting || !(this.isCandidate || this.isEmployee)) {
      return
    }

    this.isSubmitting = true

    try {
      if (!this.workingHours) {
        // if there is no workingHours object, create a draft
        this.workingHours = await this.createWorkingHours()
      }

      const variables: SubmitWorkingHoursRequestToClientMutationVariables = {
        input: {
          id: this.workingHours!.id,
          status_note: this.form.status_note,
        },
      }
      if (this.selectionWasChanged) {
        variables.input.units = this.generateUnitsInput()
      }

      const { data } = await this.$apollo.mutate<SubmitWorkingHoursRequestToClientMutation>({
        mutation: SubmitWorkingHoursRequestToClient,
        variables,
      })

      this.isSubmitting = false
      this.$refs.modal!.close()
      this.$bus.showSuccessModal('Working hours request was sent to the client', 2000)
      this.$emit('workingHoursUpdate', data!.submitWorkingHoursRequestToClient)
    } catch (err) {
      this.isSubmitting = false
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async modifyAndSubmitToCandidate() {
    if (this.isSubmitting || !(this.isClient || this.isEmployee)) {
      return
    }

    this.isSubmitting = true

    try {
      const { data } = await this.$apollo.mutate<ModifyWorkingHoursByClientMutation>({
        mutation: ModifyWorkingHoursByClient,
        variables: {
          input: {
            id: this.workingHours!.id,
            status_note: this.form.status_note,
            units: this.generateUnitsInput(),
          },
        } as ModifyWorkingHoursByClientMutationVariables,
      })

      this.isSubmitting = false
      this.$refs.modal!.close()
      this.$bus.showSuccessModal('Working hours were modified and sent back to candidate', 2000)
      this.$emit('workingHoursUpdate', data!.modifyWorkingHoursByClient!)
    } catch (err) {
      this.isSubmitting = false
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async acceptWorkingHours() {
    if (this.isSubmitting || !this.workingHours) {
      return
    }

    this.isSubmitting = true

    try {
      const { data } = await this.$apollo.mutate<ApproveWorkingHoursMutation>({
        mutation: ApproveWorkingHours,
        variables: {
          id: this.workingHours.id,
          status_note: this.form.status_note,
        } as ApproveWorkingHoursMutationVariables,
      })

      this.isSubmitting = false
      this.$refs.modal!.close()
      this.$bus.showSuccessModal('Working hours were approved', 2000)
      this.$emit('workingHoursUpdate', data!.approveWorkingHours)
    } catch (err) {
      this.isSubmitting = false
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async declineWorkingHours() {
    if (this.isSubmitting || !this.workingHours) {
      return
    }

    this.isSubmitting = true

    try {
      const { data } = await this.$apollo.mutate<DeclineWorkingHoursMutation>({
        mutation: DeclineWorkingHours,
        variables: {
          id: this.workingHours.id,
          status_note: this.form.status_note,
        } as DeclineWorkingHoursMutationVariables,
      })

      this.isSubmitting = false
      this.$refs.modal!.close()
      this.$bus.showSuccessModal('Working hours were declined', 2000)
      this.$emit('workingHoursUpdate', data!.declineWorkingHours)
    } catch (err) {
      this.isSubmitting = false
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  calculateCalendarFromPage() {
    let dt: DateTime
    if (this.form.selection.length === 0) {
      dt = DateTime.local().minus({ month: 1 })
    } else {
      dt = DateTime.fromJSDate(this.form.selection[0].date)
    }
    this.calendarFromPage = {
      month: dt.month,
      year: dt.year,
    }
  }

  sortFormSelection() {
    this.form.selection.sort((a, b) => {
      if (a.id > b.id) {
        return 1
      } else if (a.id < b.id) {
        return -1
      } else {
        return 0
      }
    })
  }

  checkForChanges() {
    if (!this.workingHours) {
      this.selectionWasChanged = true
    } else {
      if (this.workingHours.units.length !== this.form.selection.length) {
        this.selectionWasChanged = true
        return
      }

      for (let i = 0; i < this.workingHours.units.length; ++i) {
        if (
          this.workingHours.units[i].date !== this.form.selection[i].id ||
          this.workingHours.units[i].hours !== this.form.selection[i].hours ||
          this.workingHours.units[i].note !== this.form.selection[i].note
        ) {
          this.selectionWasChanged = true
          return
        }
      }
      this.selectionWasChanged = false
    }
  }

  private generateUnitsInput() {
    return this.form.selection.map((selection) => ({
      date: toISODate(selection.date)!,
      hours: selection.hours,
      note: selection.note,
    }))
  }
}
</script>
