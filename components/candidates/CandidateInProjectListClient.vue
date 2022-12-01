<template>
  <div class="mt-20 mb-12 grid grid-cols-1 gap-x-6 2xl:grid-cols-12" v-if="candidate">
    <div class="2xl:col-span-6">
      <div class="rounded-lg bg-white shadow-md relative pb-1">
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
              <span class="tbadge" :class="statusBadgeColor">
                {{ candidate.candidate_project_pivot.status | formatSnakeCaseString }}
              </span>
            </span>
          </div>

          <div class="flex items-end space-x-2 absolute top-0 transform -translate-y-1/2 right-6">
            <span
              class="tbadge--icon tbadge--green shadow-md"
              v-if="candidate.candidate_project_pivot.liked_by_client"
              v-tooltip="{ content: 'Liked by client', classes: ['tooltip--green'] }"
            >
              <IHThumbUp class="w-7 h-7" />
            </span>
          </div>

          <button class="tbtn tbtn--white absolute right-6 bottom-0 transform translate-y-1/2" @click="toggle">
            <template v-if="isExpanded"> Hide detailed info</template>
            <template v-else> Show detailed info</template>
          </button>
        </div>

        <div class="pt-3"></div>

        <div v-if="project.is_permanent && candidate.is_permanent" class="divide-y leading-normal">
          <div class="px-6 py-3 flex items-center space-x-6">
            <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">
              Candidate package<br />
              Max salary package
            </span>
            <table>
              <tbody>
                <tr
                  :class="{
                    'text-green-600':
                      candidate.candidate_project_pivot.basic_salary + candidate.candidate_project_pivot.bonus_eur <=
                      project.max_basic_salary + project.max_bonus_eur,
                    'text-red-600':
                      candidate.candidate_project_pivot.basic_salary + candidate.candidate_project_pivot.bonus_eur >
                      project.max_basic_salary + project.max_bonus_eur,
                  }"
                >
                  <td>
                    {{
                      (candidate.candidate_project_pivot.basic_salary + candidate.candidate_project_pivot.bonus_eur)
                        | currency
                    }}
                  </td>
                  <td
                    class="pl-6"
                    :class="{
                      'text-green-700':
                        project.max_basic_salary &&
                        candidate.candidate_project_pivot.basic_salary &&
                        candidate.candidate_project_pivot.basic_salary <= project.max_basic_salary,
                      'text-red-700':
                        project.max_basic_salary &&
                        candidate.candidate_project_pivot.basic_salary &&
                        candidate.candidate_project_pivot.basic_salary > project.max_basic_salary,
                    }"
                    v-if="candidate.candidate_project_pivot.basic_salary"
                  >
                    = {{ candidate.candidate_project_pivot.basic_salary | currency }}
                  </td>
                  <td
                    class="pl-1"
                    :class="{
                      'text-green-700':
                        project.max_bonus_eur &&
                        candidate.candidate_project_pivot.bonus_eur &&
                        candidate.candidate_project_pivot.bonus_eur <= project.max_bonus_eur,
                      'text-red-700':
                        project.max_bonus_eur &&
                        candidate.candidate_project_pivot.bonus_eur &&
                        candidate.candidate_project_pivot.bonus_eur > project.max_bonus_eur,
                    }"
                    v-if="candidate.candidate_project_pivot.bonus_eur"
                  >
                    + {{ candidate.candidate_project_pivot.bonus_eur | currency }}
                  </td>
                </tr>
                <tr>
                  <td>
                    {{ (project.max_basic_salary + project.max_bonus_eur) | currency }}
                  </td>
                  <td class="pl-6" v-if="project.max_basic_salary">= {{ project.max_basic_salary | currency }}</td>
                  <td class="pl-1" v-if="project.max_bonus_eur">+ {{ project.max_bonus_eur | currency }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="px-6 py-3 flex items-center space-x-6">
            <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">
              Next possible notice<br />
              Project start
            </span>
            <div class="grid grid-cols-2 gap-x-6">
              <div>
                <span
                  :class="{
                    'text-green-600': candidate.next_possible_notice_to <= project.project_start,
                    'text-red-600': candidate.next_possible_notice_to > project.project_start,
                  }"
                >
                  <template v-if="candidate.next_possible_notice_to">
                    {{ candidate.next_possible_notice_to | date }}
                  </template>
                  <template v-else> --- </template>
                </span>
                <br />
                <span class="">
                  {{ project.project_start | date }}
                </span>
              </div>

              <div v-if="candidate.period_of_notice">
                <span class="text-gray-500">Notice period</span><br />
                <span>{{ candidate.period_of_notice | noticePeriod }}</span>
              </div>
            </div>
          </div>

          <SlideUpDown class="divide-y ease-in-out" :active="isExpanded" :duration="350">
            <div class="px-6 py-3 flex items-center space-x-6">
              <span class="flex-none w-1/4 xl:w-1/3 text-gray-500"> Business car included </span>
              <table class="flex-auto">
                <tbody>
                  <tr>
                    <td class="w-1/4 text-gray-500 pr-6">Candidate</td>
                    <td
                      :class="{
                        'text-green-700':
                          candidate.is_business_car_included === project.is_business_car_included ||
                          (project.is_business_car_included && !candidate.is_business_car_included),
                      }"
                    >
                      {{ candidate.is_business_car_included ? 'Yes' : 'No' }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text-gray-500">Project</td>
                    <td>
                      {{ project.is_business_car_included ? 'Yes' : 'No' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="px-6 py-3 flex items-center space-x-6" v-if="candidate.other_bonus">
              <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">Other bonuses</span>
              <span>{{ candidate.other_bonus }}</span>
            </div>
          </SlideUpDown>
        </div>

        <div class="divide-y leading-normal" v-if="project.is_interim && candidate.is_interim">
          <template v-if="candidate.has_hourly_rate">
            <div class="px-6 py-3 flex items-center space-x-6">
              <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">Hourly rate</span>
              <table class="flex-auto">
                <tbody>
                  <tr>
                    <td class="w-1/4 text-gray-500 pr-6">Candidate</td>
                    <td>
                      <span
                        v-if="candidate.candidate_project_pivot.retail_daily_rate"
                        :class="{
                          'text-green-700':
                            project.max_daily_rate &&
                            candidate.candidate_project_pivot.retail_daily_rate &&
                            candidate.candidate_project_pivot.retail_daily_rate <= project.max_daily_rate,
                          'text-red-700':
                            project.max_daily_rate &&
                            candidate.candidate_project_pivot.retail_daily_rate &&
                            candidate.candidate_project_pivot.retail_daily_rate > project.max_daily_rate,
                        }"
                      >
                        {{ (candidate.candidate_project_pivot.retail_daily_rate / 8) | currency }}
                      </span>
                      <span v-else>---</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-gray-500">Project max</td>
                    <td>
                      <span v-if="project.max_daily_rate">
                        {{ (project.max_daily_rate / 8) | currency }}
                      </span>
                      <span v-else>---</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-else>
            <div class="px-6 py-3 flex items-center space-x-6">
              <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">Daily rate</span>
              <table class="flex-auto">
                <tbody>
                  <tr>
                    <td class="w-1/4 text-gray-500">Candidate</td>
                    <td>
                      <span
                        v-if="candidate.candidate_project_pivot.retail_daily_rate"
                        :class="{
                          'text-green-700':
                            project.max_daily_rate &&
                            candidate.candidate_project_pivot.retail_daily_rate &&
                            candidate.candidate_project_pivot.retail_daily_rate <= project.max_daily_rate,
                          'text-red-700':
                            project.max_daily_rate &&
                            candidate.candidate_project_pivot.retail_daily_rate &&
                            candidate.candidate_project_pivot.retail_daily_rate > project.max_daily_rate,
                        }"
                      >
                        {{ candidate.candidate_project_pivot.retail_daily_rate | currency }}
                      </span>
                      <span v-else>---</span>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-gray-500">Project max</td>
                    <td>
                      <span v-if="project.max_daily_rate">
                        {{ project.max_daily_rate | currency }}
                      </span>
                      <span v-else>---</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <div class="px-6 py-3 flex items-center space-x-6">
            <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">Expenses included</span>
            <table class="flex-auto">
              <tbody>
                <tr>
                  <td class="w-1/4 text-gray-500 pr-6">Candidate</td>
                  <td
                    :class="{
                      'text-green-700':
                        candidate.expenses_included === project.expenses_included ||
                        (!project.expenses_included && candidate.expenses_included),
                    }"
                  >
                    {{ candidate.expenses_included ? 'Yes' : 'No' }}
                  </td>
                </tr>
                <tr>
                  <td class="text-gray-500">Project</td>
                  <td>
                    {{ project.expenses_included ? 'Yes' : 'No' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="px-6 py-3 flex items-center space-x-6">
            <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">
              Available from<br />
              Project start
            </span>
            <span>
              <span
                :class="{
                  'text-green-700': candidate.available_from <= project.project_start,
                  'text-red-700': candidate.available_from > project.project_start,
                }"
              >
                {{ candidate.available_from | date }} </span
              ><br />
              <span>
                {{ project.project_start | date }}
              </span>
            </span>
          </div>
        </div>

        <SlideUpDown class="border-t divide-y ease-in-out" :active="isExpanded" :duration="350">
          <div class="px-6 py-3 flex items-center space-x-6" v-if="candidate.nationalities.length > 0">
            <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">Nationalities</span>
            <div class="text-xs -mb-2 -mr-2">
              <span class="tbadge tbadge--blue mr-2 mb-2" v-for="nationality in candidate.nationalities">
                {{ nationality.name }}
              </span>
            </div>
          </div>

          <div class="px-6 py-3 flex items-center space-x-6" v-if="candidate.desired_job">
            <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">Desired position</span>
            <div>
              {{ candidate.desired_job }}
            </div>
          </div>

          <div class="px-6 py-3 flex items-center space-x-6" v-if="candidate.location">
            <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">Location</span>
            <div>
              {{ candidate.location.full_address }}
            </div>
          </div>

          <div class="px-6 py-3" v-if="project.industries.length > 0">
            <div class="text-gray-500 mb-3">Industries</div>
            <div class="text-xs">
              <div class="-mr-2">
                <span class="tbadge tbadge--green mr-2 mb-2" v-for="industry in candidate.industriesCalculated.match">
                  {{ industry }}
                </span>
              </div>
              <div class="-mr-2">
                <span class="tbadge tbadge--red mr-2 mb-2" v-for="industry in candidate.industriesCalculated.missing">
                  {{ industry }}
                </span>
              </div>
              <div class="-mb-2 -mr-2">
                <span class="tbadge mr-2 mb-2" v-for="industry in candidate.industriesCalculated.extra">
                  {{ industry }}
                </span>
              </div>
            </div>
          </div>

          <div class="px-6 py-3" v-if="project.skills.length > 0">
            <div class="text-gray-500 mb-3">Skills</div>
            <div class="text-xs">
              <div class="-mr-2">
                <span class="tbadge tbadge--green mr-2 mb-2" v-for="skill in candidate.skillsCalculated.match">
                  {{ skill }}
                </span>
              </div>
              <div class="-mr-2">
                <span class="tbadge tbadge--red mr-2 mb-2" v-for="skill in candidate.skillsCalculated.missing">
                  {{ skill }}
                </span>
              </div>
              <div class="-mb-2 -mr-2">
                <span class="tbadge mr-2 mb-2" v-for="skill in candidate.skillsCalculated.extra">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <div class="px-6 py-3" v-if="project.certifications.length > 0">
            <div class="text-gray-500 mb-3">Certifications</div>
            <div class="text-xs">
              <div class="-mr-2">
                <span
                  class="tbadge tbadge--green mr-2 mb-2"
                  v-for="certification in candidate.certificationsCalculated.match"
                >
                  {{ certification }}
                </span>
              </div>
              <div class="-mr-2">
                <span
                  class="tbadge tbadge--red mr-2 mb-2"
                  v-for="certification in candidate.certificationsCalculated.missing"
                >
                  {{ certification }}
                </span>
              </div>
              <div class="-mb-2 -mr-2">
                <span class="tbadge mr-2 mb-2" v-for="certification in candidate.certificationsCalculated.extra">
                  {{ certification }}
                </span>
              </div>
            </div>
          </div>

          <div class="px-6 py-3" v-if="project.it_skills.length > 0">
            <div class="text-gray-500 mb-3">IT Skills</div>
            <div class="text-xs">
              <div class="-mr-2">
                <span class="tbadge tbadge--green mr-2 mb-2" v-for="itSkill in candidate.itSkillsCalculated.match">
                  {{ itSkill }}
                </span>
              </div>
              <div class="-mr-2">
                <span class="tbadge tbadge--red mr-2 mb-2" v-for="itSkill in candidate.itSkillsCalculated.missing">
                  {{ itSkill }}
                </span>
              </div>
              <div class="-mb-2 -mr-2">
                <span class="tbadge mr-2 mb-2" v-for="itSkill in candidate.itSkillsCalculated.extra">
                  {{ itSkill }}
                </span>
              </div>
            </div>
          </div>
        </SlideUpDown>

        <div class="px-6 -mt-6 -mb-1 transform translate-y-1/2 flex justify-between" style="min-height: 28px">
          <!-- LEFT BLOCK OF BUTTONS (RED BLOCK) -->
          <div class="flex items-center space-x-2">
            <!-- ALMOST ALWAYS VISIBLE ACTIONS -->
            <button
              type="button"
              class="tbtn-icon tbtn--red"
              @click="openRejectModal()"
              v-tooltip="{
                content: 'Reject',
                classes: ['tooltip--red'],
              }"
              :disabled="candidate.buttonStatus.reject !== ButtonStatus.ACTIVE"
              v-if="isRejectable"
            >
              <IHBan
                class="w-6 h-6"
                :class="{ 'animate-pulse': candidate.buttonStatus.reject === ButtonStatus.PROCESSING }"
              />
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <button
              type="button"
              class="tbtn-icon tbtn--red"
              @click="openThumbsDownModal()"
              v-tooltip="{
                content: 'Unlike',
                classes: ['tooltip--red'],
              }"
              :disabled="candidate.buttonStatus.thumbDown !== ButtonStatus.ACTIVE"
              v-if="isDislikeable"
            >
              <IHThumbDown
                class="w-6 h-6"
                :class="{ 'animate-pulse': candidate.buttonStatus.thumbDown === ButtonStatus.PROCESSING }"
              />
            </button>
            <button
              type="button"
              class="tbtn-icon tbtn--green"
              @click="openThumbsUpModal()"
              v-tooltip="{
                content: 'Like',
                classes: ['tooltip--green'],
              }"
              :disabled="candidate.buttonStatus.thumbUp !== ButtonStatus.ACTIVE"
              v-if="isLikeable"
            >
              <IHThumbUp
                class="w-6 h-6"
                :class="{ 'animate-pulse': candidate.buttonStatus.thumbUp === ButtonStatus.PROCESSING }"
              />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10 2xl:col-span-6 2xl:mt-0 space-y-6">
      <div class="rounded-lg bg-white shadow-md" v-if="candidate.candidate_project_pivot.is_shortlisted">
        <div class="px-6 py-5 border-b flex items-center justify-between space-x-6 relative">
          <div class="flex items-center space-x-4">
            <IHFolder class="w-6 h-6 text-gray-700" />
            <h3>
              CV Documents
              <span class="text-gray-500">&middot; {{ candidate.cv_documents.length }}</span>
            </h3>
          </div>
        </div>
        <DocumentsWrapper class="divide-y" :documents="candidate.cv_documents" :is-sharing-enabled="true">
          <template v-slot:document="slotProps">
            <DocumentRow class="px-6 py-3" v-bind="slotProps" />
          </template>
        </DocumentsWrapper>
      </div>

      <div class="rounded-lg bg-white shadow-md">
        <div class="px-6 py-5 border-b flex items-center justify-between space-x-6 relative">
          <div class="flex items-center space-x-4">
            <IHAnnotation class="w-6 h-6 text-gray-700" />
            <h3>Your feedback</h3>
          </div>
          <div class="flex items-center space-x-2">
            <button
              class="tbtn-icon tbtn--yellow tbtn-icon--small"
              @click="startEditingClientNotes()"
              v-tooltip="{ content: 'Edit', classes: ['tooltip--yellow'] }"
              v-if="!isEditingClientNotes"
            >
              <IHPencil class="w-5 h-5" />
            </button>
            <template v-else>
              <button
                class="tbtn-icon tbtn--green tbtn-icon--small"
                v-tooltip="{ content: 'Save', classes: ['tooltip--green'] }"
                @click="saveEditionClientNotes()"
              >
                <IHCheck class="w-5 h-5" />
              </button>
              <button
                class="tbtn-icon tbtn--red tbtn-icon--small"
                v-tooltip="{ content: 'Discard', classes: ['tooltip--red'] }"
                @click="discardEditionClientNotes()"
              >
                <IHX class="w-5 h-5" />
              </button>
            </template>
          </div>
        </div>
        <div class="px-6 py-5">
          <div v-if="!candidate.candidate_project_pivot.client_notes && !isEditingClientNotes">
            <button class="underline" @click="startEditingClientNotes()">Tell us your thoughts</button>
            about this candidate.
          </div>

          <p v-if="!isEditingClientNotes" class="whitespace-pre-line">{{
            candidate.candidate_project_pivot.client_notes
          }}</p>
          <FTextarea
            style="margin: 0"
            class="no-padding"
            v-model="form.client_notes"
            v-else
            ref="clientNotesFTextarea"
          />
        </div>
      </div>

      <SlideUpDown class="space-y-6 ease-in-out" :active="isExpanded" :duration="350">
        <div class="rounded-lg bg-white shadow-md">
          <div class="px-6 py-5 border-b flex items-center space-x-4 relative">
            <div class="flex items-center space-x-4">
              <IHCalendar class="w-6 h-6 text-gray-700" />
              <h3>
                Events within project
                <span class="text-gray-500">&middot; {{ candidate.events_in_project.length }}</span>
              </h3>
            </div>
          </div>
          <table class="bg-white w-full overflow-hidden rounded-b-lg">
            <tbody class="divide-y">
              <EventTableRow
                class=""
                v-for="event in candidate.events_in_project"
                :event="event"
                :key="`ceip_${event.id}`"
              ></EventTableRow>
            </tbody>
          </table>
        </div>

        <div class="rounded-lg bg-white shadow-md">
          <div class="px-6 py-5 border-b flex items-center justify-between space-x-6 relative">
            <div class="flex items-center space-x-4">
              <IHOfficeBuilding class="w-6 h-6 text-gray-700" />
              <h3>
                Worked at companies
                <span class="text-gray-500">&middot; {{ candidate.worked_at_companies.length }}</span>
              </h3>
            </div>
          </div>

          <div class="divide-y">
            <div class="flex items-center px-6 py-3" v-for="companyPivot in candidate.worked_at_companies">
              <LImg
                class="flex-none mr-6 w-16 h-16 overflow-hidden rounded-full bg-gray-200 ring-white ring-2"
                :image="companyPivot.company.logo ? companyPivot.company.logo.sizes.PROFILE_IMAGE : null"
              >
                <IHOfficeBuilding class="w-8 h-8 text-gray-400" />
              </LImg>
              <div class="flex-auto space-y-0.5">
                <div class="flex items-baseline space-x-4 justify-between">
                  <span class="text-base">
                    {{ companyPivot.job_title }}
                  </span>
                  <span class="tbadge tbadge--blue" v-if="companyPivot.job_level">
                    {{ companyPivot.job_level | formatSnakeCaseString }}
                  </span>
                </div>
                <div class="text-gray-700">
                  {{ companyPivot.company.aliasOrName }}
                </div>
                <div class="text-gray-500">
                  {{ [companyPivot.from, companyPivot.till] | dateRange }}
                </div>
                <!--                <div-->
                <!--                  class="-mr-2 -mb-2"-->
                <!--                  v-if="companyPivot.main_responsibilities && companyPivot.main_responsibilities.length > 0"-->
                <!--                >-->
                <!--                  <span class="text-xs mr-2 mb-2" v-for="item in companyPivot.main_responsibilities">-->
                <!--                    {{ item }}-->
                <!--                  </span>-->
                <!--                </div>-->
              </div>
            </div>
          </div>
        </div>
      </SlideUpDown>
    </div>

    <!-- MODALS -->

    <client-only>
      <SweetModal ref="modalRejectCandidate" title="Reject candidate">
        <form @submit.prevent="onRejectCandidateSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 gap-4">
            <FTextarea label="Rejecting note (optional)" v-model="modalForm.note" />
          </div>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="submit" class="tbtn tbtn--red">Reject candidate</button>
          </div>
        </form>
      </SweetModal>

      <SweetModal ref="modalThumbUpCandidate" title="Like candidate">
        <form @submit.prevent="onThumbUpCandidateSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 gap-4">
            <FTextarea label="Leave a note (optional)" v-model="modalForm.note" />
          </div>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="submit" class="tbtn tbtn--green">Like candidate</button>
          </div>
        </form>
      </SweetModal>

      <SweetModal ref="modalThumbDownCandidate" title="Unlike candidate">
        <form @submit.prevent="onThumbDownCandidateSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 gap-4">
            <FTextarea label="Leave a note (optional)" v-model="modalForm.note" />
          </div>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="submit" class="tbtn tbtn--red">Unlike candidate</button>
          </div>
        </form>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import {
  CandidateInProjectForClientFragment,
  CandidateStatusInProject,
  GetProjectByTokenQuery,
  Maybe,
} from '@/graphql/GQLTypes'
import { DateTime } from 'luxon'
import SlideUpDown from 'vue-slide-up-down'
import { AdditionalCandidateData, ButtonStatus } from '~/store'
import { ValidationObserver } from 'vee-validate'
import DocumentsWrapper from '~/components/documents/DocumentsWrapper.vue'
import DocumentRow from '~/components/documents/DocumentRow.vue'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import IHFolder from '~/components/globals/icons/heroicons/IHFolder.vue'
import IHOfficeBuilding from '~/components/globals/icons/heroicons/IHOfficeBuilding.vue'
import IHAnnotation from '~/components/globals/icons/heroicons/IHAnnotation.vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import IHCheck from '~/components/globals/icons/heroicons/IHCheck.vue'
import IHX from '~/components/globals/icons/heroicons/IHX.vue'
import FTextarea from '~/components/globals/form/FTextarea.vue'
import IHBan from '~/components/globals/icons/heroicons/IHBan.vue'
import IHCalendar from '~/components/globals/icons/heroicons/IHCalendar.vue'
import EventTableRow from '~/components/events/EventTableRow.vue'
import IHThumbUp from '~/components/globals/icons/heroicons/IHThumbUp.vue'
import IHThumbDown from '~/components/globals/icons/heroicons/IHThumbDown.vue'

@Component({
  components: {
    IHThumbDown,
    IHThumbUp,
    EventTableRow,
    IHCalendar,
    IHBan,
    IHX,
    IHCheck,
    IHPencil,
    IHAnnotation,
    IHOfficeBuilding,
    IHFolder,
    IHUserFilled,
    DocumentRow,
    DocumentsWrapper,
    SlideUpDown,
    ValidationObserver,
  },
})
export default class CandidateInProjectListClient extends Vue {
  ButtonStatus = ButtonStatus
  $refs!: {
    clientNotesFTextarea: FTextarea
    modalRejectCandidate: any
    modalThumbUpCandidate: any
    modalThumbDownCandidate: any
  }

  @Prop()
  candidate?: AdditionalCandidateData & CandidateInProjectForClientFragment
  @Prop()
  project?: GetProjectByTokenQuery['getProjectByToken']

  publicUrl = this.$config.publicUrl

  modalForm: {
    note: string
  } = {
    note: '',
  }

  isExpanded = false

  isEditingClientNotes = false
  isSendingToServer = false

  form: {
    client_notes: Maybe<string>
  } = {
    client_notes: null,
  }

  get statusBadgeColor() {
    switch (this.candidate!.candidate_project_pivot!.status) {
      case CandidateStatusInProject.RejectedByBlackbull:
      case CandidateStatusInProject.RejectedByClient:
        return 'tbadge--red'
      case CandidateStatusInProject.RejectedByCandidate:
        return 'tbadge--pink'
      case CandidateStatusInProject.OnHold:
        return 'tbadge--yellow'
      case CandidateStatusInProject.Placed:
        return 'tbadge--green'
      default:
        return 'tbadge--blue'
    }
  }

  get age() {
    if (!this.candidate || !this.candidate.person.birthdate) {
      return ''
    }
    return Math.floor(Math.abs(DateTime.fromISO(this.candidate.person.birthdate).diffNow('years').as('years')))
  }

  get isRejectable() {
    return (
      [
        CandidateStatusInProject.Longlisted,
        CandidateStatusInProject.Shortlisted,
        CandidateStatusInProject.OnHold,
        CandidateStatusInProject.ClientInterview,
        CandidateStatusInProject.SecondClientInterview,
        CandidateStatusInProject.AdditionalClientInterview,
        CandidateStatusInProject.FinalClientInterview,
        CandidateStatusInProject.UnderOffer,
      ].includes(this.candidate!.candidate_project_pivot!.status) &&
      this.candidate!.buttonStatus.removeFromLonglist === ButtonStatus.ACTIVE
    )
  }

  get isLikeable() {
    return this.candidate && this.isRejectable && this.candidate.candidate_project_pivot!.liked_by_client !== true
  }

  get isDislikeable() {
    return this.candidate && this.isRejectable && this.candidate.candidate_project_pivot!.liked_by_client === true
  }

  toggle() {
    this.isExpanded = !this.isExpanded
  }

  async startEditingClientNotes() {
    this.form.client_notes = this.candidate!.candidate_project_pivot!.client_notes!
    this.isEditingClientNotes = true
    await this.$nextTick()
    this.$refs.clientNotesFTextarea.focus()
  }

  async saveEditionClientNotes() {
    if (this.isSendingToServer) {
      return
    }

    this.isSendingToServer = true
    await this.$store.dispatch('project/updateClientNoteForCandidateInProject', {
      candidate: this.candidate,
      projectId: this.project!.id,
      note: this.form.client_notes,
    })
    this.isSendingToServer = false
    this.isEditingClientNotes = false
  }

  discardEditionClientNotes() {
    this.isEditingClientNotes = false
  }

  openRejectModal() {
    if (this.candidate!.buttonStatus.reject === ButtonStatus.PROCESSING) {
      return
    }

    // reset form values
    this.modalForm.note = ''

    this.$refs.modalRejectCandidate.open()
  }

  onRejectCandidateSubmit() {
    this.$refs.modalRejectCandidate.close()

    this.$store.dispatch('project/rejectCandidateByClient', {
      candidate: this.candidate,
      projectId: this.project!.id,
      note: this.modalForm.note,
    })
  }

  openThumbsUpModal() {
    if (this.candidate!.buttonStatus.thumbUp === ButtonStatus.PROCESSING) {
      return
    }

    // reset form values
    this.modalForm.note = ''

    this.$refs.modalThumbUpCandidate.open()
  }

  onThumbUpCandidateSubmit() {
    this.$refs.modalThumbUpCandidate.close()

    this.$store.dispatch('project/thumbUpCandidateByClient', {
      candidate: this.candidate,
      projectId: this.project!.id,
      note: this.modalForm.note,
    })
  }

  openThumbsDownModal() {
    if (this.candidate!.buttonStatus.thumbDown === ButtonStatus.PROCESSING) {
      return
    }

    // reset form values
    this.modalForm.note = ''

    this.$refs.modalThumbDownCandidate.open()
  }

  onThumbDownCandidateSubmit() {
    this.$refs.modalThumbDownCandidate.close()

    this.$store.dispatch('project/thumbDownCandidateByClient', {
      candidate: this.candidate,
      projectId: this.project!.id,
      note: this.modalForm.note,
    })
  }
}
</script>
