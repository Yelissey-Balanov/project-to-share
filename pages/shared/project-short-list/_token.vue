<template>
  <div class="min-h-screen flex flex-col justify-between">
    <div class="flex flex-col items-center justify-center min-h-screen pb-20 px-4 -mb-12" v-if="!project">
      <h1 class="mb-6 text-center">Projekt Shortlist</h1>
      <div class="max-w-md w-full rounded-lg bg-white shadow-md px-8 py-8">
        <ValidationObserver class="space-y-6" tag="form" @submit.prevent="submitPassword" ref="formValidationObserver">
          <p>
            Bitte beachten Sie unsere
            <a class="underline" href="/terms-of-use" target="_blank">Nutzungsbedingungen</a> sowie unsere
            <a class="underline" href="/terms-privacy" target="_blank">Datenschutzerklärung</a>.
          </p>

          <p>
            Geben Sie nachfolgend bitte das Ihnen übermittelte Passwort ein, um Zugriff auf das geteilte Projekt zu
            erlangen.
          </p>

          <FInput
            v-model="form.password"
            label="Passwort"
            type="password"
            :checkAutofilled="true"
            :rules="'required'"
            autocomplete="new-password"
            errorLabel="password"
          />

          <button type="submit" class="tbtn tbtn--blue w-full">
            <template v-if="!waitingResponse"> Passwort überprüfen</template>
            <template v-else> Laden...</template>
          </button>
        </ValidationObserver>
      </div>
    </div>

    <div class="container pt-5" v-else>
      <div class="flex w-full justify-between items-center mb-6 space-x-8">
        <h1 class="my-2 mx-auto">{{ project.title }}</h1>
        <!--        <h1>Project overview</h1>-->
        <!--        TODO: Feedback button -->
        <!--        <div class="flex items-center space-x-2" v-if="!project.deleted_at">-->
        <!--          <button type="button" class="tbtn-icon tbtn&#45;&#45;white" v-tooltip="'Add to bucket'" @click="addToBucket">-->
        <!--            <IHCollection class="w-6 h-6" />-->
        <!--          </button>-->
        <!--        </div>-->
      </div>

      <ProjectViewForClient :project="project" :showLongListTab="project.current_shared_link.is_longlist_shared" />
    </div>

    <TermsFooter :use-nuxt-link="false" :key="'tfk_' + termsFooterKey" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import GetProjectByToken from '~/graphql/ressources/projects/GetProjectByToken.gql'
import { GetProjectByTokenQuery, GetProjectByTokenQueryVariables } from '~/graphql/GQLTypes'
import TermsFooter from '~/components/TermsFooter.vue'
import ProjectViewForClient from '~/components/projects/ProjectViewForClient.vue'

@Component({
  components: {
    ProjectViewForClient,
    TermsFooter,
    ValidationObserver,
  },
  head() {
    const $this = this as SharedProjectShortList
    return {
      title: !$this.project ? 'Enter password to access the project' : 'Project ' + $this.project.title,
    }
  },
})
export default class SharedProjectShortList extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  project: GetProjectByTokenQuery['getProjectByToken'] = null

  form = {
    password: '',
  }

  termsFooterKey = 1

  waitingResponse = false

  private storedPassword: string = ''

  mounted() {
    this.storedPassword = localStorage.getItem(this.$route.params.token) as string
    if (this.storedPassword) {
      this.form.password = this.storedPassword
      this.submitPassword()
    }
  }

  async submitPassword() {
    if (this.waitingResponse) {
      return
    }

    // revalidate disabled inputs
    await Vue.nextTick()
    if (!(await validateObserver(this.$refs.formValidationObserver, false))) {
      return
    }

    this.waitingResponse = true
    const variables: GetProjectByTokenQueryVariables = {
      token: this.$route.params.token,
      password: this.form.password,
    }
    this.$apollo
      .query<GetProjectByTokenQuery>({
        query: GetProjectByToken,
        variables,
      })
      .then(({ data }) => {
        this.waitingResponse = false

        if (!this.storedPassword) {
          localStorage.setItem(this.$route.params.token, this.form.password)
          localStorage.setItem('accessedSharedProject', 'true')
          this.termsFooterKey++
        }

        this.project = data.getProjectByToken

        this.$store.commit('project/setProjectAdditionalData', this.project)
        // TODO: querying may be optimized! because if longlist is shared, we serve data for shortlisted candidates twice
        if (this.project!.candidates.length > 0) {
          this.$store.commit('project/setProjectCandidates', this.project!.candidates)
        } else {
          this.$store.commit('project/setProjectCandidates', this.project!.shortlisted_candidates)
        }
        this.$store.commit('project/setSharedProject', variables)
      })
      .catch((err) => {
        this.waitingResponse = false
        localStorage.removeItem(this.$route.params.token)
        console.error(err)
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
}
</script>
