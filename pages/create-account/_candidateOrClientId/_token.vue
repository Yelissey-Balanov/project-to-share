<template>
  <div>
    <div class="flex flex-col items-center justify-center min-h-screen pt-5 pb-20 px-4 -mb-12">
      <LicenseLogo class="w-64 mb-12" />

      <h1 class="mb-6 text-center">
        {{ candidateOrClient.person.title }} {{ candidateOrClient.person.firstname }}
        {{ candidateOrClient.person.lastname }}
      </h1>

      <div class="max-w-md w-full rounded-lg bg-white shadow-md px-8 py-8" v-if="!accountUser">
        <ValidationObserver class="space-y-6" tag="form" @submit.prevent="submitForm" ref="formValidationObserver">
          <p> Bitte geben Sie Ihre Daten ein, um Ihren Zugang zu erstellen. </p>

          <FInput v-model="form.email" label="E-Mail" type="email" :rules="'required|email'" errorLabel="E-Mail" />

          <FInput
            v-model="form.password"
            label="Passwort"
            type="password"
            autocomplete="new-password"
            :rules="'required'"
            errorLabel="Passwort"
            ref="passwordInput"
          />

          <FInput
            v-model="form.confirmPassword"
            label="Password wiederholen"
            type="password"
            autocomplete="new-password"
            :rules="'required|confirmed:' + ($refs.passwordInput ? $refs.passwordInput.id : '')"
            errorLabel="Password wiederholen"
          />

          <FCheckbox
            v-model="form.agree_terms_of_use"
            :rules="{ required: { allowFalse: false } }"
            errorLabel="Nutzungsbedingunen"
          >
            <span
              >Ich stimme den
              <a href="/terms-of-use" class="text-blue-700 hover:underline" target="_blank">Nutzungsbedingungen</a>
              zu</span
            >
          </FCheckbox>

          <FCheckbox
            v-model="form.agree_data_storage"
            :rules="{ required: { allowFalse: false } }"
            errorLabel="Speicherung der Daten"
          >
            <span>
              Ich willige in die
              <button class="hover:underline text-blue-700" type="button" @click="$refs.dataStorageConsentModal.open()">
                Speicherung meiner Daten
              </button>
              ein
            </span>
          </FCheckbox>
          <FCheckbox
            v-model="form.agree_terms_privacy"
            :rules="{ required: { allowFalse: false } }"
            errorLabel="Datenschutzerklärung"
          >
            <span
              >Ich habe die
              <a href="/terms-privacy" class="text-blue-700 hover:underline" target="_blank">Datenschutzerklärung</a>
              zur Kenntnis genommen</span
            >
          </FCheckbox>

          <button type="submit" class="tbtn tbtn--blue w-full" :disabled="isSubmitting">
            <template v-if="!isSubmitting"> Konto erstellen</template>
            <template v-else> Konto wird erstellt...</template>
          </button>
        </ValidationObserver>
      </div>
    </div>

    <DataStorageConsent ref="dataStorageConsentModal" />
    <TermsFooter :use-nuxt-link="false" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import {
  CreateUserForCandidateMutation,
  CreateUserForCandidateMutationVariables,
  CreateUserForClientMutation,
  CreateUserForClientMutationVariables,
  GetCandidateByAccountCreationTokenQuery,
  GetCandidateByAccountCreationTokenQueryVariables,
  GetClientByAccountCreationTokenQuery,
  GetClientByAccountCreationTokenQueryVariables,
} from '~/graphql/GQLTypes'
import CreateUserForCandidate from '~/graphql/ressources/candidates/CreateUserForCandidate.gql'
import CreateUserForClient from '~/graphql/ressources/clients/CreateUserForClient.gql'
import GetCandidateByAccountCreationToken from '~/graphql/ressources/candidates/GetCandidateByAccountCreationToken.gql'
import GetClientByAccountCreationToken from '~/graphql/ressources/clients/GetClientByAccountCreationToken.gql'
import FInput from '~/components/globals/form/FInput.vue'
import TermsFooter from '~/components/TermsFooter.vue'
import { State } from 'nuxt-property-decorator'
import DataStorageConsent from '~/components/modals/DataStorageConsent.vue'
import LicenseLogo from '~/components/LicenseLogo.vue'

@Component({
  components: {
    LicenseLogo,
    DataStorageConsent,
    TermsFooter,
    ValidationObserver,
  },
  async asyncData({ app, route, error, redirect }) {
    const token = route.params.token
    const isClient = token.substr(0, 3) === 'CL|'
    let candidateOrClient
    try {
      if (isClient) {
        const res = await app.apolloProvider!.defaultClient.query<GetClientByAccountCreationTokenQuery>({
          query: GetClientByAccountCreationToken,
          variables: {
            client_id: parseInt(route.params.candidateOrClientId),
            token: route.params.token,
          } as GetClientByAccountCreationTokenQueryVariables,
        })
        candidateOrClient = res.data.getClientByAccountCreationToken
      } else {
        const res = await app.apolloProvider!.defaultClient.query<GetCandidateByAccountCreationTokenQuery>({
          query: GetCandidateByAccountCreationToken,
          variables: {
            candidate_id: parseInt(route.params.candidateOrClientId),
            token: route.params.token,
          } as GetCandidateByAccountCreationTokenQueryVariables,
        })
        candidateOrClient = res.data.getCandidateByAccountCreationToken
      }

      return {
        isClient,
        candidateOrClient,
      }
    } catch (e) {
      console.warn(e)
      return redirect('/')
    }
  },
  head() {
    return {
      title: 'Create account',
    }
  },
})
export default class CreateUserForCandidateOrClientPage extends Vue {
  $refs!: {
    dataStorageConsentModal: DataStorageConsent
    passwordInput: FInput
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  @State((state) => state.account.user)
  accountUser

  candidateOrClient!:
    | GetCandidateByAccountCreationTokenQuery['getCandidateByAccountCreationToken']
    | GetClientByAccountCreationTokenQuery['getClientByAccountCreationToken']

  isClient!: boolean

  form = {
    email: '',
    password: '',
    confirmPassword: '',
    agree_terms_of_use: false,
    agree_terms_privacy: false,
    agree_data_storage: false,
  }

  isSubmitting = false

  mounted() {}

  async submitForm() {
    if (this.isSubmitting) {
      return
    }

    if (!(await validateObserver(this.$refs.formValidationObserver))) {
      return
    }

    this.isSubmitting = true
    try {
      const commonVariables = {
        token: this.$route.params.token,
        email: this.form.email,
        password: this.form.password,
      }

      if (this.isClient) {
        await this.$apollo.mutate<CreateUserForClientMutation>({
          mutation: CreateUserForClient,
          variables: {
            ...commonVariables,
            client_id: this.candidateOrClient!.id,
          } as CreateUserForClientMutationVariables,
        })
      } else {
        await this.$apollo.mutate<CreateUserForCandidateMutation>({
          mutation: CreateUserForCandidate,
          variables: {
            ...commonVariables,
            candidate_id: this.candidateOrClient!.id,
          } as CreateUserForCandidateMutationVariables,
        })
      }

      // if we land here - everything went good, login user
      await this.$store.dispatch('account/loginUser', {
        email: this.form.email,
        password: this.form.password,
      })

      // handle redirect after login
      await this.$router.push('/')
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }
}
</script>
