<template>
  <div>
    <p class="text-center" v-if="paginatorInfo && paginatorInfo.total === 0">
      No candidates found that satisfy project needs.
      <br />
      Make sure projects industries, skills and certifications are defined.
    </p>
    <div class="suitable-candidates">
      <div
        class="suitable-candidate box-of-grouped-fields hover:shadow-gray-900"
        v-for="candidate of candidates"
        :key="'suitableCandidate_' + candidate.id"
      >
        <CandidateProfileImageWithBadges class="suitable-candidate__candidate-piwb" :candidate="candidate" />

        <div class="suitable-candidate__name">
          <a target="_blank" :href="`/candidates/${candidate.id}`">
            <h3>{{ candidate.person.title }} {{ candidate.person.firstname }} {{ candidate.person.lastname }}</h3>
          </a>
          <span class="tbadge tbadge--orange" v-if="candidate.is_research">Research candidate</span>
        </div>

        <div class="suitable-candidate__age">
          <template v-if="candidate.person.gender">
            {{ candidate.person.gender }}
            <template v-if="candidate.person.birthdate">,</template>
          </template>
          <template v-if="candidate.person.birthdate">
            {{ calculateAge(candidate.person.birthdate) }} years old
          </template>
        </div>

        <div class="suitable-candidate__block-near-image">
          <div class="grid grid-cols-2 gap-4">
            <LabeledValue
              :value="candidate.certificationsCalculated.match"
              label="Matched certifications"
              class="green-pills"
            />
            <LabeledValue :value="candidate.itSkillsCalculated.match" label="Matched IT Skills" class="green-pills" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <LabeledValue
              :value="candidate.industriesCalculated.match"
              label="Matched industries"
              class="green-pills"
            />
            <LabeledValue :value="candidate.skillsCalculated.match" label="Matched skills" class="green-pills" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <LabeledValue
            :value="candidate.certificationsCalculated.missing"
            label="Missing certifications"
            class="red-pills"
          />
          <LabeledValue :value="candidate.itSkillsCalculated.missing" label="Missing IT Skills" class="red-pills" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <LabeledValue :value="candidate.industriesCalculated.missing" label="Missing industries" class="red-pills" />
          <LabeledValue :value="candidate.skillsCalculated.missing" label="Missing skills" class="red-pills" />
        </div>

        <div class="grid grid-cols-1 gap-4">
          <LabeledValue
            :value="candidate.industriesCalculated.extra"
            label="Additional industries"
            class="gray-pills"
          />
        </div>

        <div class="grid grid-cols-1 gap-4">
          <LabeledValue :value="candidate.skillsCalculated.extra" label="Additional skills" class="gray-pills" />
        </div>

        <div class="grid grid-cols-1 gap-4">
          <LabeledValue
            :value="candidate.certificationsCalculated.extra"
            label="Additional certifications"
            class="gray-pills"
          />
        </div>

        <div class="grid grid-cols-1 gap-4">
          <LabeledValue :value="candidate.itSkillsCalculated.extra" label="Additional IT Skills" class="gray-pills" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <LabeledValue :value="candidate.desired_job" label="Desired position" />
          <LabeledValue :value="candidate.location" attr="full_address" label="Location" />
        </div>

        <template v-if="project.is_interim && candidate.is_interim">
          <h4>Interim</h4>
          <div class="grid grid-cols-3 gap-4">
            <LabeledValue
              :value="candidate.daily_rate"
              :asCurrency="true"
              label="Candidates daily rate / Max daily rate"
              :class="{
                'text-green-700':
                  project.max_daily_rate && candidate.daily_rate && candidate.daily_rate <= project.max_daily_rate,
                'text-red-700':
                  project.max_daily_rate && candidate.daily_rate && candidate.daily_rate > project.max_daily_rate,
              }"
              :compareToValue="project.max_daily_rate"
              compareToValueClass="text-black"
              :forceComparedToValue="true"
            />

            <LabeledValue
              :value="candidate.expenses_included"
              :asBoolean="true"
              label="Expenses included"
              :class="{
                'text-green-700':
                  candidate.expenses_included === project.expenses_included ||
                  (!project.expenses_included && candidate.expenses_included),
              }"
              :compareToValue="project.expenses_included"
              compareToValueClass="text-black"
              :forceComparedToValue="true"
            />

            <LabeledValue
              :value="dateFilter(candidate.available_from)"
              label="Available from / Project start"
              :class="{
                'text-green-700': candidate.available_from <= project.project_start,
                'text-red-700': candidate.available_from > project.project_start,
              }"
              :compareToValue="dateFilter(project.project_start)"
              compareToValueClass="text-black"
              :forceComparedToValue="true"
            />
          </div>
        </template>

        <template v-if="project.is_permanent && candidate.is_permanent">
          <h4>Permanent</h4>
          <div class="grid grid-cols-3 gap-4">
            <LabeledValue
              :value="candidate.basic_salary"
              :asCurrency="true"
              label="Candidates basic salary / Max basic salary"
              :class="{
                'text-green-700':
                  project.max_basic_salary &&
                  candidate.basic_salary &&
                  candidate.basic_salary <= project.max_basic_salary,
                'text-red-700':
                  project.max_basic_salary &&
                  candidate.basic_salary &&
                  candidate.basic_salary > project.max_basic_salary,
              }"
              :compareToValue="project.max_basic_salary"
              compareToValueClass="text-black"
              :forceComparedToValue="true"
            />

            <LabeledValue
              :value="candidate.bonus_eur"
              :asCurrency="true"
              label="Candidates bonus / Max bonus"
              :class="{
                'text-green-700':
                  project.max_bonus_eur && candidate.bonus_eur && candidate.bonus_eur <= project.bonus_eur,
                'text-red-700': project.max_bonus_eur && candidate.bonus_eur && candidate.bonus_eur > project.bonus_eur,
              }"
              :compareToValue="project.max_bonus_eur"
              compareToValueClass="text-black"
              :forceComparedToValue="true"
            />

            <LabeledValue
              :value="candidate.is_business_car_included"
              :asBoolean="true"
              label="Business car included"
              :class="{
                'text-green-700':
                  candidate.is_business_car_included === project.is_business_car_included ||
                  (project.is_business_car_included && !candidate.is_business_car_included),
              }"
              :compareToValue="project.is_business_car_included"
              compareToValueClass="text-black"
              :forceComparedToValue="true"
            />
          </div>
          <div class="grid grid-cols-3 gap-4">
            <LabeledValue :value="noticePeriodFilter(candidate.period_of_notice)" label="Notice period" />

            <LabeledValue
              :value="dateFilter(candidate.next_possible_notice_to)"
              label="Next possible notice / Project start"
              :class="{
                'text-green-700': candidate.next_possible_notice_to <= project.project_start,
                'text-red-700': candidate.next_possible_notice_to > project.project_start,
              }"
              :compareToValue="dateFilter(project.project_start)"
              compareToValueClass="text-black"
              :forceComparedToValue="true"
            />

            <LabeledValue :value="candidate.other_bonus" label="Other bonuses" />
          </div>
        </template>

        <h4>CV Documents</h4>
        <DocumentsList :documents="candidate.cv_documents">
          <template v-slot:errorText>Candidate has no documents with CV Tag.</template>
        </DocumentsList>

        <br />
        <div class="flex space-x-2">
          <button
            type="button"
            class="tbtn tbtn--red"
            style="margin-right: auto"
            v-if="candidate.buttonStatus.addToLonglist === ButtonStatus.PROCESSED"
            @click="removeFromLonglist(candidate)"
            :disabled="candidate.buttonStatus.removeFromLonglist !== ButtonStatus.ACTIVE"
          >
            <template v-if="candidate.buttonStatus.removeFromLonglist === ButtonStatus.ACTIVE">
              Remove from longlist
            </template>
            <template v-else-if="candidate.buttonStatus.removeFromLonglist === ButtonStatus.PROCESSING">
              Removing from longlist...
            </template>
            <template v-else> Removed from longlist </template>
          </button>

          <button
            type="button"
            class="tbtn"
            :class="{
              'tbtn--gray': candidate.buttonStatus.addToLonglist !== ButtonStatus.PROCESSED,
              'tbtn--green': candidate.buttonStatus.addToLonglist === ButtonStatus.PROCESSED,
            }"
            @click="addToLonglist(candidate)"
            :disabled="candidate.buttonStatus.addToLonglist !== ButtonStatus.ACTIVE"
          >
            <template v-if="candidate.buttonStatus.addToLonglist === ButtonStatus.ACTIVE"> Add to longlist </template>
            <template v-else-if="candidate.buttonStatus.addToLonglist === ButtonStatus.PROCESSING">
              Adding to longlist...
            </template>
            <template v-else> Added to longlist </template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { GetProjectForAddingCandidatesQuery, GetSuitableCandidatesForProjectQuery, Maybe } from '@/graphql/GQLTypes'
import { DateTime } from 'luxon'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import DocumentsList from '~/components/admin/DocumentsList.vue'
import { State } from '~/node_modules/nuxt-property-decorator'
import { ButtonStatus, SuitableCandidate } from '~/store'
import CandidateProfileImageWithBadges from '~/components/admin/CandidateProfileImageWithBadges.vue'

@Component({
  components: { CandidateProfileImageWithBadges, DocumentsList, LabeledValue },
})
export default class SuitableCandidatesForProject extends Vue {
  ButtonStatus = ButtonStatus

  @Prop({ required: true })
  project!: GetProjectForAddingCandidatesQuery['project']

  @Prop({ required: true })
  paginatorInfo!: Maybe<
    NonNullable<GetSuitableCandidatesForProjectQuery['suitableCandidatesForProject']>['paginatorInfo']
  >

  publicUrl = this.$config.publicUrl
  dateFilter = this.$options.filters!.date
  noticePeriodFilter = this.$options.filters!.noticePeriod

  @State((state) => state.project.projectCandidates.suitable)
  candidates!: SuitableCandidate[]

  @State((state) => state.project.projectAdditionalData.maxPossibleScore)
  maxPossibleScore!: number

  calculateAge(birthdate) {
    return Math.floor(Math.abs(DateTime.fromISO(birthdate).diffNow('years').as('years')))
  }

  addToLonglist(candidate: SuitableCandidate) {
    if (candidate.buttonStatus.addToLonglist === ButtonStatus.PROCESSING) {
      return
    }

    this.$store.dispatch('project/addToLonglist', {
      candidate,
      projectId: this.project!.id,
    })
  }

  removeFromLonglist(candidate: SuitableCandidate) {
    if (candidate.buttonStatus.removeFromLonglist === ButtonStatus.PROCESSING) {
      return
    }

    this.$store.dispatch('project/removeFromLonglist', {
      candidate,
      projectId: this.project!.id,
    })
  }
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/variables';

.suitable-candidate {
  position: relative;
  margin-left: 100px;
  margin-top: calc(85px + 2em);

  h4 {
    margin-bottom: 0.85em;
    margin-top: 1em;
  }
}

.suitable-candidate__candidate-piwb {
  top: calc(-1.5em - 85px);
  left: calc(-1.5em - 100px);
}

.suitable-candidate__name {
  position: absolute;
  top: -29px;
  left: 120px;
  display: flex;
  align-items: center;

  > .badge {
    margin-left: 0.5em;
  }

  > a {
    color: $color-text;
  }

  h3 {
    font-size: 1.5em;
    line-height: 1.3;
    font-weight: 400;
    margin: 0;
  }
}

.suitable-candidate__age {
  position: absolute;
  top: -28px;
  right: 15px;
  font-size: 1.3em;
  line-height: 1.5;
  font-weight: 300;
  color: $color-gray-dark;
}

.suitable-candidate__block-near-image {
  padding-left: 100px;
}
</style>
