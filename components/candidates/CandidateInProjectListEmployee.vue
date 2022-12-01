<template>
  <div class="mt-20 mb-12 grid grid-cols-1 gap-x-6 2xl:grid-cols-12" v-if="candidate">
    <div class="2xl:col-span-6">
      <div class="rounded-lg bg-white shadow-md relative pb-6">
        <div class="border-b px-6 py-4 flex items-center justify-between relative z-10">
          <a
            :href="`/candidates/${candidate.id}`"
            target="_blank"
            class="absolute left-1/2 transform -translate-x-1/2 -top-20 small-foto"
          >
            <LImg
              class="w-44 h-44 overflow-hidden rounded-full bg-gray-200 shadow-lg ring-2 ring-white"
              :image="candidate.person.foto ? candidate.person.foto.sizes.PROFILE_IMAGE : null"
            >
              <IHUserFilled class="w-44 h-44 text-gray-400 mt-9" />
            </LImg>
          </a>

          <div class="flex flex-col items-start w-1/2">
            <a class="text-xl pr-28" target="_blank" :href="`/candidates/${candidate.id}`">
              <h3>{{ candidate.person.full_name }}</h3>
            </a>
            <span class="text-gray-500 mt-0.5 h-4 leading-4">
              <span class="" v-if="candidate.person.gender">{{ candidate.person.gender }}</span
              ><template v-if="candidate.person.gender && age">,</template>
              <span class="" v-if="age"> {{ age }} years old</span>
            </span>
            <span class="flex items-center space-x-1 mt-2">
              <span
                class="tbadge"
                :class="statusBadgeColor"
                v-if="candidate.buttonStatus.removeFromLonglist !== ButtonStatus.PROCESSED"
              >
                {{ candidate.candidate_project_pivot.status | formatSnakeCaseString }}
              </span>
              <span class="tbadge tbadge--red" v-else>Removed</span>
              <span class="tbadge tbadge--yellow" v-if="candidate.is_research">Research candidate</span>
            </span>
          </div>
          <span class="tbadge text-base">
            {{ candidate.matchingScore }}
            <span class="text-sm text-gray-500">of {{ maxPossibleScore }} Points</span>
          </span>

          <div class="flex items-end space-x-2 absolute top-0 transform -translate-y-1/2 right-6">
            <span
              class="tbadge--icon tbadge--red shadow-md"
              v-if="candidate.caution"
              v-tooltip="{ content: 'At least in 1 project beyond first interview!', classes: ['tooltip--red'] }"
            >
              <IHExclamation class="w-7 h-7" />
            </span>
            <span
              class="tbadge--icon tbadge--red shadow-md"
              v-if="candidate.candidate_project_pivot.contradicted_at"
              v-tooltip="{
                content: 'Candidate has withdrawn the consent for data transmission!',
                classes: ['tooltip--red'],
              }"
            >
              <IHExclamation class="w-7 h-7" />
            </span>
            <span
              class="tbadge--icon tbadge--green shadow-md"
              v-if="candidate.was_placed"
              v-tooltip="{ content: 'At least 1 time placed', classes: ['tooltip--green'] }"
            >
              <IHCash class="w-7 h-7" />
            </span>
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

        <div class="accent accent--red mb-6 pt-8 pb-6" v-if="candidate.deleted_at">
          This candidate was deleted at {{ candidate.deleted_at | datetime }}, therefore it is not editable! If you wish
          to restore or force delete this candidate, go to the
          <a target="_blank" :href="`/candidates/${candidate.id}`">candidate page</a>.
        </div>

        <template v-if="isConsentRequestable">
          <div class="accent accent--red mb-6 pt-8 pb-6" v-if="!candidate.candidate_project_pivot.consent_sent_at">
            Candidate has not yet received a request for data transmission. Candidate is not visible for the client at
            the moment. Would you like to
            <button class="hover:underline" type="button" @click="openRequestConsentModal()"
              >send the request now</button
            >?
          </div>
          <div class="accent accent--yellow mb-6 pt-8 pb-6" v-else>
            This candidate received a request on {{ candidate.candidate_project_pivot.consent_sent_at | datetime }} for
            data transmission but has not yet consented. Would you like to
            <button class="hover:underline" type="button" @click="openRequestConsentModal()">send the request</button>
            again?
          </div>
        </template>
        <div class="accent accent--red mb-6 pt-8 pb-6" v-if="candidate.candidate_project_pivot.contradicted_at">
          The candidate has withdrawn the consent for data transmission on
          {{ candidate.candidate_project_pivot.contradicted_at | datetime }} and is not visible for the client anymore.
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
                      'text-green-600':
                        project.max_basic_salary &&
                        candidate.candidate_project_pivot.basic_salary &&
                        candidate.candidate_project_pivot.basic_salary <= project.max_basic_salary,
                      'text-red-600':
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
                      'text-green-600':
                        project.max_bonus_eur &&
                        candidate.candidate_project_pivot.bonus_eur &&
                        candidate.candidate_project_pivot.bonus_eur <= project.max_bonus_eur,
                      'text-red-600':
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
                        'text-green-600':
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
              <span class="flex-none w-1/4 xl:w-1/3 text-gray-500"> Hourly rate </span>
              <table class="flex-auto">
                <tbody>
                  <tr>
                    <td class="w-1/4 text-gray-500 pr-6">Purchasing</td>
                    <td>
                      <span
                        v-if="candidate.candidate_project_pivot.purchasing_daily_rate"
                        :class="{
                          'text-green-600':
                            project.max_daily_rate &&
                            candidate.candidate_project_pivot.purchasing_daily_rate &&
                            candidate.candidate_project_pivot.purchasing_daily_rate <= project.max_daily_rate,
                          'text-red-600':
                            project.max_daily_rate &&
                            candidate.candidate_project_pivot.purchasing_daily_rate &&
                            candidate.candidate_project_pivot.purchasing_daily_rate > project.max_daily_rate,
                        }"
                      >
                        {{ (candidate.candidate_project_pivot.purchasing_daily_rate / 8) | currency }}
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
                  <tr>
                    <td class="text-gray-500">Retail</td>
                    <td>
                      <span
                        v-if="candidate.candidate_project_pivot.retail_daily_rate"
                        :class="{
                          'text-green-600':
                            project.max_daily_rate &&
                            candidate.candidate_project_pivot.retail_daily_rate &&
                            candidate.candidate_project_pivot.retail_daily_rate <= project.max_daily_rate,
                          'text-red-600':
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
                    <td class="text-gray-500">Earning</td>
                    <td>
                      <span
                        v-if="
                          candidate.candidate_project_pivot.purchasing_daily_rate &&
                          candidate.candidate_project_pivot.retail_daily_rate
                        "
                        :class="[
                          candidate.candidate_project_pivot.retail_daily_rate -
                            candidate.candidate_project_pivot.purchasing_daily_rate >
                          0
                            ? 'text-green-600'
                            : 'text-red-600',
                        ]"
                      >
                        {{
                          ((candidate.candidate_project_pivot.retail_daily_rate -
                            candidate.candidate_project_pivot.purchasing_daily_rate) /
                            8)
                            | currency
                        }}
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
              <span class="flex-none w-1/4 xl:w-1/3 text-gray-500">Daily rate </span>
              <table class="flex-auto">
                <tbody>
                  <tr>
                    <td class="w-1/4 text-gray-500">Purchasing</td>
                    <td>
                      <span
                        v-if="candidate.candidate_project_pivot.purchasing_daily_rate"
                        :class="{
                          'text-green-600':
                            project.max_daily_rate &&
                            candidate.candidate_project_pivot.purchasing_daily_rate &&
                            candidate.candidate_project_pivot.purchasing_daily_rate <= project.max_daily_rate,
                          'text-red-600':
                            project.max_daily_rate &&
                            candidate.candidate_project_pivot.purchasing_daily_rate &&
                            candidate.candidate_project_pivot.purchasing_daily_rate > project.max_daily_rate,
                        }"
                      >
                        {{ candidate.candidate_project_pivot.purchasing_daily_rate | currency }}
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
                  <tr>
                    <td class="text-gray-500">Retail</td>
                    <td>
                      <span
                        v-if="candidate.candidate_project_pivot.retail_daily_rate"
                        :class="{
                          'text-green-600':
                            project.max_daily_rate &&
                            candidate.candidate_project_pivot.retail_daily_rate &&
                            candidate.candidate_project_pivot.retail_daily_rate <= project.max_daily_rate,
                          'text-red-600':
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
                    <td class="text-gray-500">Earning</td>
                    <td>
                      <span
                        v-if="
                          candidate.candidate_project_pivot.purchasing_daily_rate &&
                          candidate.candidate_project_pivot.retail_daily_rate
                        "
                        :class="[
                          candidate.candidate_project_pivot.retail_daily_rate -
                            candidate.candidate_project_pivot.purchasing_daily_rate >
                          0
                            ? 'text-green-600'
                            : 'text-red-600',
                        ]"
                      >
                        {{
                          (candidate.candidate_project_pivot.retail_daily_rate -
                            candidate.candidate_project_pivot.purchasing_daily_rate)
                            | currency
                        }}
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
                      'text-green-600':
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
                  'text-green-600': candidate.available_from <= project.project_start,
                  'text-red-600': candidate.available_from > project.project_start,
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

          <div class="px-6 py-3 flex items-center space-x-6" v-if="candidate.candidate_project_pivot.consented_at">
            <span class="flex-none w-1/4 xl:w-1/3 text-gray-500"> Consented on </span>
            <span class="text-green-600">
              {{ candidate.candidate_project_pivot.consented_at | datetime }}
            </span>
          </div>
        </SlideUpDown>

        <div
          class="absolute bottom-0 left-6 right-6 transform translate-y-1/2 flex justify-between"
          v-if="!candidate.deleted_at"
        >
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

            <button
              type="button"
              class="tbtn-icon tbtn--green"
              @click="reactivateCandidate()"
              v-tooltip="{
                content: 'Reactivate',
                classes: ['tooltip--green'],
              }"
              :disabled="candidate.buttonStatus.reactivate !== ButtonStatus.ACTIVE"
              v-if="isRejected"
            >
              <IHRefresh
                class="w-6 h-6"
                :class="{ 'animate-pulse': candidate.buttonStatus.reactivate === ButtonStatus.PROCESSING }"
              />
            </button>

            <!-- LONGLISTED -->
            <template
              v-if="
                candidate.candidate_project_pivot.status === CandidateStatusInProject.Longlisted &&
                candidate.buttonStatus.removeFromLonglist !== ButtonStatus.PROCESSED
              "
            >
              <button
                type="button"
                class="tbtn-icon tbtn--red"
                @click="removeFromLonglist()"
                v-tooltip="{
                  content: 'Remove from longlist',
                  classes: ['tooltip--red'],
                }"
                :disabled="candidate.buttonStatus.removeFromLonglist !== ButtonStatus.ACTIVE"
              >
                <IHMinus
                  class="w-6 h-6"
                  :class="{ 'animate-pulse': candidate.buttonStatus.removeFromLonglist === ButtonStatus.PROCESSING }"
                />
              </button>
            </template>

            <!-- SHORTLISTED -->
            <template v-if="candidate.candidate_project_pivot.status === CandidateStatusInProject.Shortlisted">
              <button
                type="button"
                class="tbtn-icon tbtn--red"
                @click="removeFromShortlist()"
                v-tooltip="{
                  content: 'Remove from shortlist',
                  classes: ['tooltip--red'],
                }"
                :disabled="candidate.buttonStatus.removeFromShortlist !== ButtonStatus.ACTIVE"
              >
                <IHChevronDoubleDown
                  class="w-6 h-6"
                  :class="{ 'animate-pulse': candidate.buttonStatus.removeFromShortlist === ButtonStatus.PROCESSING }"
                />
              </button>
            </template>
          </div>

          <div class="flex items-center space-x-2">
            <!-- LONGLISTED -->
            <template v-if="candidate.candidate_project_pivot.status === CandidateStatusInProject.Longlisted">
              <template v-if="candidate.buttonStatus.removeFromLonglist === ButtonStatus.ACTIVE">
                <button
                  type="button"
                  class="tbtn-icon tbtn--yellow"
                  @click="onHoldCandidate()"
                  v-tooltip="{
                    content: 'On hold',
                    classes: ['tooltip--yellow'],
                  }"
                  :disabled="candidate.buttonStatus.onHold !== ButtonStatus.ACTIVE"
                >
                  <IHPause
                    class="w-6 h-6"
                    :class="{ 'animate-pulse': candidate.buttonStatus.onHold === ButtonStatus.PROCESSING }"
                  />
                </button>
              </template>
              <template v-else-if="candidate.buttonStatus.removeFromLonglist === ButtonStatus.PROCESSED">
                <button
                  type="button"
                  class="tbtn-icon tbtn--blue"
                  @click="addToLonglist()"
                  v-tooltip="'Add to longlist'"
                  :disabled="candidate.buttonStatus.addToLonglist !== ButtonStatus.ACTIVE"
                >
                  <IHPlus
                    class="w-6 h-6"
                    :class="{ 'animate-pulse': candidate.buttonStatus.addToLonglist === ButtonStatus.PROCESSING }"
                  />
                </button>
              </template>
            </template>

            <template
              v-if="
                (candidate.candidate_project_pivot.status === CandidateStatusInProject.Longlisted &&
                  candidate.buttonStatus.removeFromLonglist === ButtonStatus.ACTIVE) ||
                candidate.candidate_project_pivot.status === CandidateStatusInProject.OnHold
              "
            >
              <button
                type="button"
                class="tbtn-icon tbtn--blue"
                @click="openShortlistPivotModal()"
                v-tooltip="'Move to shortlist'"
                :disabled="candidate.buttonStatus.addToShortlist !== ButtonStatus.ACTIVE"
              >
                <IHChevronDoubleUp
                  class="w-6 h-6"
                  :class="{ 'animate-pulse': candidate.buttonStatus.addToShortlist === ButtonStatus.PROCESSING }"
                />
              </button>
            </template>

            <!-- IN SHORT LIST -->
            <template v-if="candidate.candidate_project_pivot.is_shortlisted">
              <button
                type="button"
                class="tbtn-icon tbtn--blue"
                @click="openRequestConsentModal()"
                v-tooltip="'Request consent'"
                :disabled="candidate.buttonStatus.consent !== ButtonStatus.ACTIVE"
                v-if="isConsentRequestable && !candidate.candidate_project_pivot.consent_sent_at"
              >
                <IHandshake
                  class="w-7 h-7"
                  :class="{ 'animate-pulse': candidate.buttonStatus.consent === ButtonStatus.PROCESSING }"
                />
              </button>
              <button
                type="button"
                class="tbtn-icon tbtn--blue"
                @click="openShortlistPivotModal(false)"
                v-tooltip="'Change conditions'"
                :disabled="candidate.buttonStatus.changeConditions !== ButtonStatus.ACTIVE"
              >
                <IHClipboardList
                  class="w-6 h-6"
                  :class="{ 'animate-pulse': candidate.buttonStatus.changeConditions === ButtonStatus.PROCESSING }"
                />
              </button>
            </template>

            <button
              type="button"
              class="tbtn-icon tbtn--green"
              @click="addEvent()"
              v-tooltip="{
                content: 'Add new event',
                classes: ['tooltip--green'],
              }"
            >
              <IHCalendar class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-10 2xl:col-span-6 2xl:mt-0 space-y-6">
      <div class="rounded-lg bg-white shadow-md">
        <div class="px-6 py-5 border-b flex items-center justify-between space-x-6 relative">
          <div class="flex items-center space-x-4">
            <IHCalendar class="w-6 h-6 text-gray-700" />
            <h3>
              Events within project
              <span class="text-gray-500">&middot; {{ candidate.events_in_project.length }}</span>
            </h3>
          </div>

          <div class="flex items-center space-x-4">
            <button
              type="button"
              class="tbtn-icon tbtn--white tbtn-icon--small"
              @click="toggleEventsVisibility"
              v-if="!isExpanded && hiddenEvents.length > 0"
            >
              <span
                class="transform transition duration-300 ease-in-out"
                :class="{ 'rotate-180': areAllEventsVisible }"
              >
                <IHChevronDown class="w-5 h-5" />
              </span>
            </button>
            <button type="button" class="tbtn-icon tbtn--green tbtn-icon--small" @click="addEvent">
              <IHPlus class="w-5 h-5" />
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
        <SlideUpDown class="border-t ease-in-out" :active="isExpanded || areAllEventsVisible" :duration="350">
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

      <div class="rounded-lg bg-white shadow-md">
        <div class="px-6 py-5 border-b flex items-center justify-between space-x-6 relative">
          <div class="flex items-center space-x-4">
            <IHAnnotation class="w-6 h-6 text-gray-700" />
            <h3>Client feedback</h3>
          </div>
        </div>
        <div class="px-6 py-5">
          <div v-if="!candidate.candidate_project_pivot.client_notes">
            Client didn't give any feedback to this candidate.
          </div>
          <p v-else class="whitespace-pre-line">{{ candidate.candidate_project_pivot.client_notes }}</p>
        </div>
      </div>

      <SlideUpDown class="space-y-6 ease-in-out" :active="isExpanded" :duration="350">
        <div class="rounded-lg bg-white shadow-md">
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
      <SweetModal ref="modalRejectCandidate" title="Reject candidate from project">
        <form @submit.prevent="onRejectCandidateSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 gap-4">
            <FSelectSimple
              v-model="modalRejectForm.rejectedBy"
              :nullable="false"
              label="Rejected by"
              :options="rejectedByOptions"
            />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FTextarea label="Rejecting note (optional)" v-model="modalRejectForm.note" />
          </div>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="submit" class="tbtn tbtn--red">Reject candidate</button>
          </div>
        </form>
      </SweetModal>

      <SweetModal
        ref="modalShortlistPivot"
        :title="
          modalShortlistPivotForm.isMovingToShortlist ? 'Move candidate to shortlist' : 'Update candidates conditions'
        "
      >
        <ValidationObserver
          tag="form"
          @submit.prevent="onShortlistPivotSubmit()"
          ref="shortlistPivotFormValidationObserver"
          class="space-y-6"
        >
          <div v-if="modalShortlistPivotForm.isMovingToShortlist">
            As candidate is going to the short list, you have to specify conditions for the candidate within this
            project. Values may differ from regular candidate values.
          </div>
          <div class="grid grid-cols-2 gap-4" v-if="project.is_permanent && candidate.is_permanent">
            <FInput
              v-model="modalShortlistPivotForm.basic_salary"
              label="Basic salary"
              :asCurrency="true"
              :rules="'currency'"
              errorLabel="basic salary"
            />
            <FInput
              v-model="modalShortlistPivotForm.bonus_eur"
              label="Bonus"
              :asCurrency="true"
              :rules="'currency'"
              errorLabel="bonus"
            />
          </div>
          <div class="grid grid-cols-2 gap-4" v-if="project.is_interim && candidate.is_interim">
            <template v-if="candidate.has_hourly_rate">
              <FInput
                v-model="modalShortlistPivotForm.purchasing_rate"
                label="Purchasing hourly rate"
                :asCurrency="true"
                :rules="'currency'"
                errorLabel="purchasing hourly rate"
              />
              <FInput
                v-model="modalShortlistPivotForm.retail_rate"
                label="Retail hourly rate"
                :asCurrency="true"
                :rules="'currency'"
                errorLabel="retail hourly rate"
              />
            </template>
            <template v-else>
              <FInput
                v-model="modalShortlistPivotForm.purchasing_rate"
                label="Purchasing daily rate"
                :asCurrency="true"
                :rules="'currency'"
                errorLabel="purchasing daily rate"
              />
              <FInput
                v-model="modalShortlistPivotForm.retail_rate"
                label="Retail daily rate"
                :asCurrency="true"
                :rules="'currency'"
                errorLabel="retail daily rate"
              />
            </template>
          </div>
          <div class="form-action-buttons mt-0 mb-0">
            <button type="submit" class="tbtn tbtn--blue">
              {{ modalShortlistPivotForm.isMovingToShortlist ? 'Move candidate to shortlist' : 'Save changes' }}
            </button>
          </div>
        </ValidationObserver>
      </SweetModal>

      <SweetModal ref="modalChangeStatus" :title="changeStatusModalAttrs.title">
        <form @submit.prevent="onChangeStatusSubmit()">
          <div class="grid grid-cols-1 gap-4">
            <FTextarea label="Status note (optional)" v-model="changeStatusModalAttrs.form.note" />
          </div>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="submit" class="tbtn tbtn--blue">Submit</button>
          </div>
        </form>
      </SweetModal>

      <SweetModal ref="modalRequestConsent" title="Request consent">
        <p>
          You are about to send a consent request. Candidate will become an email with information about current project
          and link to consent.
        </p>

        <div class="flex items-center justify-end space-x-4 mb-0 mt-6">
          <button type="button" class="tbtn" @click="$refs.modalRequestConsent.close()">Cancel</button>
          <button type="button" class="tbtn tbtn--green" @click="sendConsentRequest()">Send request</button>
        </div>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { CandidateStatusInProject, GetProjectForViewQuery, Maybe } from '@/graphql/GQLTypes'
import { DateTime } from 'luxon'
import SlideUpDown from 'vue-slide-up-down'
import { ButtonStatus, CandidateInList } from '~/store'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import IHCash from '~/components/globals/icons/heroicons/IHCash.vue'
import IHExclamation from '~/components/globals/icons/heroicons/IHExclamation.vue'
import { State } from 'nuxt-property-decorator'
import EventTableRow from '~/components/events/EventTableRow.vue'
import IHPlus from '~/components/globals/icons/heroicons/IHPlus.vue'
import DocumentsWrapper from '~/components/documents/DocumentsWrapper.vue'
import DocumentRow from '~/components/documents/DocumentRow.vue'
import IHOfficeBuilding from '~/components/globals/icons/heroicons/IHOfficeBuilding.vue'
import IHBan from '~/components/globals/icons/heroicons/IHBan.vue'
import IHRefresh from '~/components/globals/icons/heroicons/IHRefresh.vue'
import IHMinus from '~/components/globals/icons/heroicons/IHMinus.vue'
import IHChevronDoubleDown from '~/components/globals/icons/heroicons/IHChevronDoubleDown.vue'
import IHPause from '~/components/globals/icons/heroicons/IHPause.vue'
import IHChevronDoubleUp from '~/components/globals/icons/heroicons/IHChevronDoubleUp.vue'
import IHClipboardList from '~/components/globals/icons/heroicons/IHClipboardList.vue'
import IHCalendar from '~/components/globals/icons/heroicons/IHCalendar.vue'
import IHFolder from '~/components/globals/icons/heroicons/IHFolder.vue'
import IHChevronDown from '~/components/globals/icons/heroicons/IHChevronDown.vue'
import IHAnnotation from '~/components/globals/icons/heroicons/IHAnnotation.vue'
import IHThumbUp from '~/components/globals/icons/heroicons/IHThumbUp.vue'
import IHandshake from '~/components/globals/icons/IHandshake.vue'

enum ChangeCandidateStatusTo {
  ON_HOLD,
  REACTIVATE,
}

@Component({
  components: {
    IHandshake,
    IHThumbUp,
    IHAnnotation,
    IHChevronDown,
    IHFolder,
    IHCalendar,
    IHClipboardList,
    IHChevronDoubleUp,
    IHPause,
    IHChevronDoubleDown,
    IHMinus,
    IHRefresh,
    IHBan,
    IHOfficeBuilding,
    DocumentRow,
    DocumentsWrapper,
    IHPlus,
    EventTableRow,
    IHExclamation,
    IHCash,
    IHUserFilled,
    SlideUpDown,
    ValidationObserver,
  },
})
export default class CandidateInProjectListEmployee extends Vue {
  ButtonStatus = ButtonStatus
  CandidateStatusInProject = CandidateStatusInProject

  $refs!: {
    modalRejectCandidate: any
    modalChangeStatus: any
    modalShortlistPivot: any
    modalRequestConsent: any
    shortlistPivotFormValidationObserver: InstanceType<typeof ValidationObserver>
  }

  @Prop()
  candidate?: CandidateInList
  @Prop()
  project?: GetProjectForViewQuery['project']

  @State((state) => state.project.projectAdditionalData.maxPossibleScore)
  maxPossibleScore!: number

  publicUrl = this.$config.publicUrl

  isExpanded = true
  areAllEventsVisible = false

  modalRejectForm: {
    rejectedBy: string
    note: string
  } = {
    rejectedBy: CandidateStatusInProject.RejectedByCandidate,
    note: '',
  }

  modalShortlistPivotForm: {
    isMovingToShortlist: boolean
    isSubmitting: boolean
    basic_salary: Maybe<number>
    bonus_eur: Maybe<number>
    purchasing_rate: Maybe<number>
    retail_rate: Maybe<number>
  } = {
    isMovingToShortlist: true,
    isSubmitting: false,
    basic_salary: null,
    bonus_eur: null,
    purchasing_rate: null,
    retail_rate: null,
  }

  changeStatusModalAttrs: {
    title: string
    buttonText: string
    newStatus: ChangeCandidateStatusTo
    form: {
      note: string
    }
  } = {
    title: '',
    buttonText: '',
    newStatus: ChangeCandidateStatusTo.ON_HOLD,
    form: {
      note: '',
    },
  }

  eventsCountInPreview = 4

  get isConsentRequestable() {
    if (!this.candidate) {
      return false
    }
    const pivot = this.candidate.candidate_project_pivot!
    return (
      pivot.is_shortlisted &&
      !pivot.consented_at &&
      !pivot.contradicted_at &&
      CandidateStatusInProject.Shortlisted === pivot.status
    )
  }

  get lastHappenedEvents() {
    if (!this.candidate || !this.candidate.events_in_project) {
      return []
    }
    return this.candidate.events_in_project.slice(0, this.eventsCountInPreview)
  }

  get hiddenEvents() {
    if (!this.candidate || !this.candidate.events_in_project) {
      return []
    }
    return this.candidate.events_in_project.slice(this.eventsCountInPreview)
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

  get isRejected() {
    return [
      CandidateStatusInProject.RejectedByCandidate,
      CandidateStatusInProject.RejectedByClient,
      CandidateStatusInProject.RejectedByBlackbull,
    ].includes(this.candidate!.candidate_project_pivot!.status)
  }

  get rejectedByOptions() {
    const options: any = {
      Candidate: 'Candidate',
    }

    if (
      [
        CandidateStatusInProject.Longlisted,
        CandidateStatusInProject.Shortlisted,
        CandidateStatusInProject.OnHold,
      ].includes(this.candidate!.candidate_project_pivot!.status)
    ) {
      options.Blackbull = 'Blackbull'
    }

    if (
      [
        CandidateStatusInProject.Shortlisted,
        CandidateStatusInProject.ClientInterview,
        CandidateStatusInProject.SecondClientInterview,
        CandidateStatusInProject.AdditionalClientInterview,
        CandidateStatusInProject.FinalClientInterview,
        CandidateStatusInProject.UnderOffer,
      ].includes(this.candidate!.candidate_project_pivot!.status)
    ) {
      options.Client = 'Client'
    }

    return options
  }

  get age() {
    if (!this.candidate || !this.candidate.person.birthdate) {
      return ''
    }
    return Math.floor(Math.abs(DateTime.fromISO(this.candidate.person.birthdate).diffNow('years').as('years')))
  }

  toggleEventsVisibility() {
    this.areAllEventsVisible = !this.areAllEventsVisible
  }

  toggle() {
    this.isExpanded = !this.isExpanded
  }

  openShortlistPivotModal(movingToShortlist = true) {
    this.modalShortlistPivotForm.isMovingToShortlist = movingToShortlist
    if (movingToShortlist) {
      this.modalShortlistPivotForm.basic_salary = this.candidate!.basic_salary!
      this.modalShortlistPivotForm.bonus_eur = this.candidate!.bonus_eur!
      this.modalShortlistPivotForm.purchasing_rate =
        this.candidate!.has_hourly_rate && this.candidate!.daily_rate
          ? this.candidate!.daily_rate / 8
          : this.candidate!.daily_rate!
      this.modalShortlistPivotForm.retail_rate =
        this.candidate!.has_hourly_rate && this.project!.max_daily_rate
          ? this.project!.max_daily_rate / 8
          : this.project!.max_daily_rate!
    } else {
      this.modalShortlistPivotForm.basic_salary = this.candidate!.candidate_project_pivot!.basic_salary!
      this.modalShortlistPivotForm.bonus_eur = this.candidate!.candidate_project_pivot!.bonus_eur!
      this.modalShortlistPivotForm.purchasing_rate =
        this.candidate!.has_hourly_rate && this.candidate!.candidate_project_pivot!.purchasing_daily_rate
          ? this.candidate!.candidate_project_pivot!.purchasing_daily_rate / 8
          : this.candidate!.candidate_project_pivot!.purchasing_daily_rate!
      this.modalShortlistPivotForm.retail_rate =
        this.candidate!.has_hourly_rate && this.candidate!.candidate_project_pivot!.retail_daily_rate
          ? this.candidate!.candidate_project_pivot!.retail_daily_rate / 8
          : this.candidate!.candidate_project_pivot!.retail_daily_rate!
    }
    this.$refs.modalShortlistPivot.open()
  }

  removeFromShortlist() {
    if (this.candidate!.buttonStatus.removeFromShortlist === ButtonStatus.PROCESSING) {
      return
    }

    this.$store.dispatch('project/removeFromShortlist', {
      candidate: this.candidate,
      projectId: this.project!.id,
    })
  }

  removeFromLonglist() {
    if (this.candidate!.buttonStatus.removeFromLonglist === ButtonStatus.PROCESSING) {
      return
    }

    this.$store.dispatch('project/removeFromLonglist', {
      candidate: this.candidate,
      projectId: this.project!.id,
    })
  }

  addToLonglist() {
    if (this.candidate!.buttonStatus.addToLonglist === ButtonStatus.PROCESSING) {
      return
    }

    this.$store.dispatch('project/addToLonglist', {
      candidate: this.candidate,
      projectId: this.project!.id,
    })
  }

  openRejectModal() {
    if (this.candidate!.buttonStatus.reject === ButtonStatus.PROCESSING) {
      return
    }

    // reset form values
    this.modalRejectForm.rejectedBy = 'Candidate'
    this.modalRejectForm.note = ''

    this.$refs.modalRejectCandidate.open()
  }

  onRejectCandidateSubmit() {
    this.$refs.modalRejectCandidate.close()

    this.$store.dispatch('project/rejectCandidateBy' + this.modalRejectForm.rejectedBy, {
      candidate: this.candidate,
      projectId: this.project!.id,
      note: this.modalRejectForm.note,
    })
  }

  onHoldCandidate() {
    if (this.candidate!.buttonStatus.onHold === ButtonStatus.PROCESSING) {
      return
    }

    this.changeStatusModalAttrs.title = 'On hold candidate'
    this.changeStatusModalAttrs.newStatus = ChangeCandidateStatusTo.ON_HOLD
    // reset form values
    this.changeStatusModalAttrs.form.note = ''

    this.$refs.modalChangeStatus.open()
  }

  reactivateCandidate() {
    if (this.candidate!.buttonStatus.reactivate === ButtonStatus.PROCESSING) {
      return
    }

    this.changeStatusModalAttrs.title = 'Reactivate candidate'
    this.changeStatusModalAttrs.newStatus = ChangeCandidateStatusTo.REACTIVATE
    // reset form values
    this.changeStatusModalAttrs.form.note = ''

    this.$refs.modalChangeStatus.open()
  }

  onChangeStatusSubmit() {
    this.$refs.modalChangeStatus.close()
    if (this.changeStatusModalAttrs.newStatus === ChangeCandidateStatusTo.ON_HOLD) {
      this.$store.dispatch('project/onHoldCandidateInProject', {
        candidate: this.candidate,
        projectId: this.project!.id,
        note: this.changeStatusModalAttrs.form.note,
      })
    } else if (this.changeStatusModalAttrs.newStatus === ChangeCandidateStatusTo.REACTIVATE) {
      this.$store.dispatch('project/reactivateCandidateInProject', {
        candidate: this.candidate,
        projectId: this.project!.id,
        note: this.changeStatusModalAttrs.form.note,
      })
    }
  }

  openRequestConsentModal() {
    this.$refs.modalRequestConsent.open()
  }

  sendConsentRequest() {
    if (this.candidate!.buttonStatus.consent === ButtonStatus.PROCESSING) {
      return
    }
    this.$refs.modalRequestConsent.close()
    this.$store.dispatch('project/sendConsentRequest', {
      candidate: this.candidate,
      projectId: this.project!.id,
    })
  }

  addEvent() {
    this.$bus.openEventFormModal(this.candidate, this.project)
  }

  async onShortlistPivotSubmit() {
    if (this.modalShortlistPivotForm.isSubmitting) {
      return
    }

    if (!(await validateObserver(this.$refs.shortlistPivotFormValidationObserver))) {
      return
    }
    this.modalShortlistPivotForm.isSubmitting = true
    this.$refs.modalShortlistPivot.close()

    const dispatchCommand = this.modalShortlistPivotForm.isMovingToShortlist
      ? 'project/moveToShortlist'
      : 'project/updateCandidateProjectPivot'

    this.$store
      .dispatch(dispatchCommand, {
        candidate: this.candidate,
        projectId: this.project!.id,
        basic_salary: this.modalShortlistPivotForm.basic_salary,
        bonus_eur: this.modalShortlistPivotForm.bonus_eur,
        purchasing_daily_rate:
          this.candidate!.has_hourly_rate && this.modalShortlistPivotForm.purchasing_rate
            ? this.modalShortlistPivotForm.purchasing_rate * 8
            : this.modalShortlistPivotForm.purchasing_rate,
        retail_daily_rate:
          this.candidate!.has_hourly_rate && this.modalShortlistPivotForm.retail_rate
            ? this.modalShortlistPivotForm.retail_rate * 8
            : this.modalShortlistPivotForm.retail_rate,
      })
      .then(() => {
        this.modalShortlistPivotForm.isSubmitting = false
      })
      .catch(() => {
        this.modalShortlistPivotForm.isSubmitting = false
      })
  }
}
</script>
