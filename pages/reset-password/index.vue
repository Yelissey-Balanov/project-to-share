<template>
  <div class="flex flex-col items-center justify-center min-h-screen pb-20 px-4">
    <LicenseLogo class="w-64 mb-12" />

    <h1 class="mb-6 text-center">Let's find your account</h1>

    <div class="max-w-md w-full rounded-lg bg-white shadow-md px-8 py-8">
      <ValidationObserver class="space-y-6" tag="form" @submit.prevent="submitForm" ref="formValidationObserver">
        <FInput
          v-model="form.email"
          label="Email"
          type="email"
          :checkAutofilled="true"
          :rules="'required|email'"
          errorLabel="email"
        />
        <p class="text-center">
          We'll send you an email. If you don't see our mail in your inbox, please check your spam folder.
        </p>
        <button type="submit" class="tbtn tbtn--blue w-full" :disabled="isSubmitting">
          <template v-if="!isSubmitting"> Request password reset </template>
          <template v-else> Requesting password reset... </template>
        </button>
      </ValidationObserver>
    </div>
    <div class="max-w-md w-full mt-4 px-8 text-right">
      Do you remember your password?
      <nuxt-link to="/login">Login</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import {
  RequestPasswordResettingMutation,
  RequestPasswordResettingMutationVariables,
  MeQuery,
  UserRole,
} from '~/graphql/GQLTypes'
import { State } from 'nuxt-property-decorator'
import RequestPasswordResetting from '~/graphql/ressources/users/RequestPasswordResetting.gql'
import LicenseLogo from '~/components/LicenseLogo.vue'

@Component({
  middleware: 'guest',
  components: {
    LicenseLogo,
    ValidationObserver,
  },
  head() {
    return {
      title: 'Password reset',
    }
  },
})
export default class ResetPasswordRequestPage extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  form = {
    email: '',
  }

  isSubmitting = false

  async submitForm() {
    if (this.isSubmitting) {
      return
    }

    if (!(await validateObserver(this.$refs.formValidationObserver, false))) {
      return
    }

    this.isSubmitting = true

    try {
      const variables: RequestPasswordResettingMutationVariables = {
        email: this.form.email,
      }

      const result = await this.$apollo.mutate<RequestPasswordResettingMutation>({
        mutation: RequestPasswordResetting,
        variables,
      })

      this.$bus.showSuccessModal('Please check you mailbox to continue password resetting.', 5000)

      // handle redirect after login
      await this.$router.push('/login')
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
