<template>
  <div class="mt-20 mb-12 grid grid-cols-1 gap-x-6 2xl:grid-cols-12" v-if="candidate">
    <div class="2xl:col-span-6 flex flex-col space-y-6">
      <div class="rounded-lg bg-white shadow-md relative">
        <!-- pb-6 -->
        <div class="border-b px-6 py-4 flex items-center justify-between relative z-10">
          <div class="absolute left-1/2 transform -translate-x-1/2 -top-20">
            <LImg
              class="w-44 h-44 overflow-hidden rounded-full bg-gray-200 shadow-lg ring-2 ring-white"
              :image="candidate.person.foto ? candidate.person.foto.sizes.PROFILE_IMAGE : null"
            >
              <IHUserFilled class="w-44 h-44 text-gray-400 mt-9" />
            </LImg>
          </div>

          <div class="flex flex-col items-start w-1/2">
            <h3 class="text-xl pr-28">{{ candidate.person.full_name }}</h3>
            <span class="text-gray-500 mt-0.5 h-4 leading-4">
              <span class="" v-if="candidate.person.gender">{{ candidate.person.gender }}</span
              ><template v-if="candidate.person.gender && age">,</template>
              <span class="" v-if="age"> {{ age }} years old</span>
            </span>
            <span class="flex items-center space-x-1 mt-2">
              <span class="tbadge tbadge--green">
                {{ candidate.candidate_project_pivot.status | formatSnakeCaseString }}
              </span>
            </span>
          </div>

          <div class="flex items-center space-x-2">
            <!-- here goes possible action-buttons -->
          </div>
        </div>

        <div class="divide-y">
          <div class="px-6 py-3 flex items-center space-x-6">
            <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">Placement start</span>
            <div>
              {{ project.placed_start_at | date }}
            </div>
          </div>

          <template v-if="project.is_permanent && candidate.is_permanent">
            <div class="px-6 py-3 flex items-center space-x-6 leading-normal">
              <span class="flex-none w-1/4 xl:w-1/3 text-gray-500"> Package </span>
              <table>
                <tbody>
                  <tr>
                    <td>
                      {{
                        (candidate.candidate_project_pivot.basic_salary + candidate.candidate_project_pivot.bonus_eur)
                          | currency
                      }}
                    </td>
                    <td class="pl-6" v-if="candidate.candidate_project_pivot.basic_salary">
                      = {{ candidate.candidate_project_pivot.basic_salary | currency }}
                    </td>
                    <td class="pl-1" v-if="candidate.candidate_project_pivot.bonus_eur">
                      + {{ candidate.candidate_project_pivot.bonus_eur | currency }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <template class="divide-y leading-normal" v-if="project.is_interim && candidate.is_interim">
            <template v-if="candidate.has_hourly_rate">
              <div class="px-6 py-3 flex items-center space-x-6 leading-normal">
                <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">Hourly rate</span>
                <span v-if="candidate.candidate_project_pivot.retail_daily_rate">
                  {{ (candidate.candidate_project_pivot.retail_daily_rate / 8) | currency }}
                </span>
                <span v-else>---</span>
              </div>
            </template>
            <template v-else>
              <div class="px-6 py-3 flex items-center space-x-6 leading-normal">
                <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">Daily rate </span>
                <span v-if="candidate.candidate_project_pivot.retail_daily_rate">
                  {{ candidate.candidate_project_pivot.retail_daily_rate | currency }}
                </span>
                <span v-else>---</span>
              </div>
            </template>
          </template>
        </div>
      </div>

      <div class="rounded-lg bg-white shadow-md" v-if="project.is_interim && candidate.is_interim">
        <div class="px-6 py-5 border-b flex items-center justify-between space-x-6 relative">
          <div class="flex items-center space-x-4">
            <IHClock class="w-6 h-6 text-gray-700" />
            <h3>Working hours</h3>
          </div>
        </div>
        <table class="bg-white w-full overflow-hidden rounded-b-lg">
          <tbody class="divide-y">
            <WorkingHoursRow
              class=""
              v-for="(workingHours, index) in workingHoursList"
              :working-hours="workingHours"
              :key="`wh_${workingHours.id}`"
              @openWorkingHoursModal="openWorkingHoursModal"
              @deletedWorkingHours="deletedWorkingHours(index)"
            ></WorkingHoursRow>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mt-10 2xl:col-span-6 2xl:mt-0 space-y-6">
      <div class="rounded-lg bg-white shadow-md">
        <div class="px-6 py-5 border-b flex items-center space-x-4 relative">
          <div class="flex items-center space-x-4">
            <IHCalendar class="w-6 h-6 text-gray-700" />
            <h3>
              Events within project
              <span class="text-gray-500">&middot; {{ candidate.events_in_project.length }}</span>
            </h3>
          </div>

          <div class="flex items-center space-x-4">
            <button
              class="tbtn-icon tbtn--white tbtn-icon--small"
              @click="toggleEventsVisibility"
              v-if="hiddenEvents.length > 0"
            >
              <span
                class="transform transition duration-300 ease-in-out"
                :class="{ 'rotate-180': areAllEventsVisible }"
              >
                <IHChevronDown class="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
        <table class="bg-white w-full overflow-hidden rounded-b-lg">
          <tbody class="divide-y">
            <EventTableRow
              class=""
              v-for="event in lastHappenedEvents"
              :event="event"
              :key="`ceip_${event.id}`"
            ></EventTableRow>
          </tbody>
        </table>
        <SlideUpDown class="border-t ease-in-out" :active="areAllEventsVisible" :duration="350">
          <table class="bg-white w-full overflow-hidden rounded-b-lg">
            <tbody class="divide-y">
              <EventTableRow
                class=""
                v-for="event in hiddenEvents"
                :event="event"
                :key="`ceip_${event.id}`"
              ></EventTableRow>
            </tbody>
          </table>
        </SlideUpDown>
      </div>
    </div>
    <!-- TODO: Show candidate documents -->
    <!-- MODALS -->
    <WorkingHoursModal
      ref="workingHoursModal"
      :candidate="candidate"
      :project="project"
      @workingHoursUpdate="onWorkingHoursChanged"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { GetProjectForViewQuery, Maybe, WorkingHoursFragment } from '@/graphql/GQLTypes'
import { DateTime } from 'luxon'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import SlideUpDown from 'vue-slide-up-down'
import { ValidationObserver } from 'vee-validate'
import EventTableRow from '~/components/events/EventTableRow.vue'
import IHPlus from '~/components/globals/icons/heroicons/IHPlus.vue'
import DocumentsWrapper from '~/components/documents/DocumentsWrapper.vue'
import DocumentRow from '~/components/documents/DocumentRow.vue'
import IHClipboardList from '~/components/globals/icons/heroicons/IHClipboardList.vue'
import IHCalendar from '~/components/globals/icons/heroicons/IHCalendar.vue'
import IHChevronDown from '~/components/globals/icons/heroicons/IHChevronDown.vue'
import IHClock from '~/components/globals/icons/heroicons/IHClock.vue'
import WorkingHoursRow from '~/components/workingHours/WorkingHoursRow.vue'
import WorkingHoursModal from '~/components/modals/WorkingHoursModal.vue'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'

@Component({
  components: {
    IHUserFilled,
    WorkingHoursModal,
    WorkingHoursRow,
    IHClock,
    IHChevronDown,
    IHCalendar,
    IHClipboardList,
    DocumentRow,
    DocumentsWrapper,
    IHPlus,
    EventTableRow,
    LabeledValue,
    SlideUpDown,
    ValidationObserver,
  },
})
export default class PlacedCandidateInProjectClient extends Vue {
  $refs!: {
    workingHoursModal: WorkingHoursModal
  }

  @Prop({ required: true })
  candidate!: NonNullable<NonNullable<GetProjectForViewQuery['project']>['placed_candidate']>
  @Prop({ required: true })
  project!: NonNullable<GetProjectForViewQuery['project']>

  publicUrl = this.$config.publicUrl

  areAllEventsVisible = false
  workingHoursList: WorkingHoursFragment[] = []

  eventsCountInPreview = 4

  get lastHappenedEvents() {
    if (!this.candidate.events_in_project) {
      return []
    }
    return this.candidate.events_in_project.slice(0, this.eventsCountInPreview)
  }

  get hiddenEvents() {
    if (!this.candidate.events_in_project) {
      return []
    }
    return this.candidate.events_in_project.slice(this.eventsCountInPreview)
  }

  get age() {
    if (!this.candidate.person.birthdate) {
      return ''
    }
    return Math.floor(Math.abs(DateTime.fromISO(this.candidate.person.birthdate).diffNow('years').as('years')))
  }

  created() {
    this.workingHoursList = this.candidate.working_hours
  }

  toggleEventsVisibility() {
    this.areAllEventsVisible = !this.areAllEventsVisible
  }

  openWorkingHoursModal(options) {
    this.$refs.workingHoursModal.open(options)
  }

  deletedWorkingHours(index) {
    this.workingHoursList.splice(index, 1)
  }

  onWorkingHoursChanged(workingHours: WorkingHoursFragment) {
    const itemIndex = this.workingHoursList.findIndex((item) => item.id === workingHours.id)
    if (itemIndex === -1) {
      this.workingHoursList.unshift(workingHours)
    } else {
      this.workingHoursList.splice(itemIndex, 1, workingHours)
    }
  }
}
</script>
