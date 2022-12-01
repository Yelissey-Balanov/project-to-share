<template>
  <div class="flex flex-col items-center justify-center min-h-screen py-20 px-4">
    <LicenseLogo class="w-64 mb-12" />

    <div class="text-base max-w-xl w-full rounded-lg bg-white shadow-md pt-14 pb-8 px-8 relative mt-12">
      <div class="absolute -top-10 left-0 right-0 flex justify-center -space-x-3">
        <LImg
          class="shadow-lg w-20 h-20 overflow-hidden rounded-full bg-gray-200 ring-white ring-2"
          :image="project.company.logo ? project.company.logo.sizes.PROFILE_IMAGE : null"
          v-tooltip="project.company.aliasOrName"
        >
          <IHOfficeBuilding class="w-8 h-8 text-gray-400" />
        </LImg>
      </div>

      <h1 class="mb-10 text-center">Einwilligung zur Weitergabe personenbezogener&nbsp;Daten</h1>

      <p>
        Hiermit willige ich, {{ candidate.person.full_name }}, in die Weitergabe meiner Daten gemäß DSGVO zu folgendem
        Zweck ein:
      </p>
      <p>
        Vorstellung auf die Position des <b>{{ project.title }}</b> beim Unternehmen
        <b>{{ project.company.name }}{{ project.company.legal_form ? ' ' + project.company.legal_form : '' }}</b
        >.
      </p>
      <p>Diese Einwilligung kann ich jederzeit widerrufen.</p>
      <p>
        Eine Weitergabe über den o.g. Zweck hinaus ist nicht gestattet und bedarf einer weiteren Einwilligung
        meinerseits.
      </p>
      <p>
        Außerdem bestätige ich, dass ich mich nicht selbst auf die o.g. Position beworben habe. Auch habe ich keiner
        dritten Partei (z.B. Personalberatung) eine Einwilligung zur Weiterleitung meiner Daten erteilt. Sollte dies
        geschehen sein, erfolgte dies ohne mein Wissen.
      </p>

      <template v-if="contradicted_at">
        <p class="text-red-600">Der Weitergabe der Daten wurde am {{ contradicted_at | datetime }} wiedersprochen.</p>
        <div class="space-y-3 mt-8 flex flex-col">
          <button type="button" @click="sendConsent()" class="tbtn tbtn--blue w-full">Erneut einwilligen</button>
        </div>
      </template>

      <template v-else-if="consented_at">
        <p class="text-green-600"> Die Weitergabe der Daten wurde am {{ consented_at | datetime }} eingewilligt. </p>
        <div class="space-y-3 mt-8 flex flex-col">
          <button type="button" @click="openContradictionModal()" class="tbtn tbtn--transparent w-full"
            >Einwilligung widerrufen</button
          >
        </div>
      </template>

      <template v-else>
        <div class="space-y-3 mt-8 flex flex-col">
          <button type="button" @click="sendConsent()" class="tbtn tbtn--blue w-full">Bestätigen</button>
          <button type="button" @click="openContradictionModal()" class="tbtn tbtn--transparent w-full"
            >Ablehnen</button
          >
        </div>
      </template>
    </div>

    <client-only>
      <SweetModal ref="modalContradictConfirm" title="Die Einwilligung widerrufen">
        <p>
          Bitte beachten Sie, dass wir Sie ohne Ihre Einwilligung nicht bzw. nicht weiter als Kandidat für diese
          Position berücksichtigen können.
        </p>

        <div class="mt-6 flex space-x-2 justify-end">
          <button type="button" class="tbtn tbtn--transparent" @click="$refs.modalContradictConfirm.close()">
            Abbrechen
          </button>
          <button type="button" class="tbtn tbtn--red" @click="sendContradiction">Einwilligung widerrufen</button>
        </div>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  ConsentCandidateInProjectMutation,
  ConsentCandidateInProjectMutationVariables,
  ContradictCandidateInProjectMutation,
  ContradictCandidateInProjectMutationVariables,
  GetConsentForCandidateInProjectQuery,
  GetConsentForCandidateInProjectQueryVariables,
} from '~/graphql/GQLTypes'
import GetConsentForCandidateInProject from '~/graphql/ressources/candidates/GetConsentForCandidateInProject.gql'
import ConsentCandidateInProject from '~/graphql/ressources/candidates/ConsentCandidateInProject.gql'
import ContradictCandidateInProject from '~/graphql/ressources/candidates/ContradictCandidateInProject.gql'
import IHOfficeBuilding from '~/components/globals/icons/heroicons/IHOfficeBuilding.vue'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import LicenseLogo from '~/components/LicenseLogo.vue'

@Component({
  components: { LicenseLogo, IHUserFilled, IHOfficeBuilding },
  head() {
    return {
      title: 'Einwilligung erteilen',
    }
  },
  async asyncData({ app, route, error }) {
    const data = {
      project: null as any,
      candidate: null as any,
      projectId: Number.parseInt(route.params.id),
      candidateId: Number.parseInt(route.params.candidateId),
      timestamp: route.query.t,
      consented_at: null as any,
      contradicted_at: null as any,
    }
    try {
      const res = await app.apolloProvider!.defaultClient.query<GetConsentForCandidateInProjectQuery>({
        query: GetConsentForCandidateInProject,
        variables: {
          projectId: data.projectId,
          candidateId: data.candidateId,
          timestamp: data.timestamp,
        } as GetConsentForCandidateInProjectQueryVariables,
      })
      data.project = res.data.getConsentForCandidateInProject!.project
      data.candidate = res.data.getConsentForCandidateInProject!.candidate
      data.consented_at = res.data.getConsentForCandidateInProject!.consented_at
      data.contradicted_at = res.data.getConsentForCandidateInProject!.contradicted_at
    } catch (e) {
      console.log(e)
    }

    if (!data.project) {
      return error({ statusCode: 404 })
    }

    return data
  },
})
export default class ConsentCandidateInProjectPage extends Vue {
  $refs!: {
    modalContradictConfirm: any
  }

  project!: NonNullable<GetConsentForCandidateInProjectQuery['getConsentForCandidateInProject']>['project']
  candidate!: NonNullable<GetConsentForCandidateInProjectQuery['getConsentForCandidateInProject']>['candidate']
  projectId!: number
  candidateId!: number
  timestamp!: string
  consented_at!: string
  contradicted_at!: string

  waitingResponse = false

  openContradictionModal() {
    this.$refs.modalContradictConfirm.open()
  }

  async sendContradiction() {
    if (this.waitingResponse) {
      return
    }

    this.waitingResponse = true
    this.$refs.modalContradictConfirm.close()

    this.$apollo
      .mutate<ContradictCandidateInProjectMutation>({
        mutation: ContradictCandidateInProject,
        variables: {
          timestamp: this.timestamp,
          projectId: this.projectId,
          candidateId: this.candidateId,
        } as ContradictCandidateInProjectMutationVariables,
      })
      .then(({ data }) => {
        this.contradicted_at = data?.contradictCandidateInProject!.contradicted_at!
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
      .finally(() => {
        this.waitingResponse = false
      })
  }

  async sendConsent() {
    if (this.waitingResponse) {
      return
    }

    this.waitingResponse = true

    this.$apollo
      .mutate<ConsentCandidateInProjectMutation>({
        mutation: ConsentCandidateInProject,
        variables: {
          timestamp: this.timestamp,
          projectId: this.projectId,
          candidateId: this.candidateId,
        } as ConsentCandidateInProjectMutationVariables,
      })
      .then(({ data }) => {
        this.consented_at = data?.consentCandidateInProject!.consented_at!
        this.contradicted_at = data?.consentCandidateInProject!.contradicted_at!
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
      .finally(() => {
        this.waitingResponse = false
      })
  }
}
</script>
