<template>
  <div class="flex flex-col items-center justify-center min-h-screen pb-20 px-4">
    <LicenseLogo class="w-64 mb-12" />

    <h1 class="mb-6 text-center">Password reset</h1>
    <div class="max-w-md w-full rounded-lg bg-white shadow-md px-8 py-8">
      <ValidationObserver class="space-y-6" tag="form" @submit.prevent="submitForm" ref="formValidationObserver">
        <p class="text-center"> Please enter your email and new password for your account. </p>

        <FInput v-model="form.email" label="Email" type="email" :rules="'required|email'" errorLabel="email" />

        <FInput
          v-model="form.password"
          label="New password"
          type="password"
          autocomplete="new-password"
          :rules="'required'"
          errorLabel="password"
          ref="passwordInput"
        />

        <FInput
          v-model="form.confirmPassword"
          label="Confirm new password"
          type="password"
          autocomplete="new-password"
          :rules="'required|confirmed:' + ($refs.passwordInput ? $refs.passwordInput.id : '')"
          errorLabel="confirm password"
        />

        <button type="submit" class="tbtn tbtn--blue w-full" :disabled="isSubmitting">
          <template v-if="!isSubmitting"> Change password </template>
          <template v-else> Changing password... </template>
        </button>
      </ValidationObserver>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import {
  ChangeUserPasswordMutation,
  ChangeUserPasswordMutationVariables,
  IsResetPasswordTokenValidQuery,
  IsResetPasswordTokenValidQueryVariables,
} from '~/graphql/GQLTypes'
import IsResetPasswordTokenValid from '~/graphql/ressources/users/IsResetPasswordTokenValid.gql'
import ChangeUserPassword from '~/graphql/ressources/users/ChangeUserPassword.gql'
import FInput from '~/components/globals/form/FInput.vue'
import LicenseLogo from '~/components/LicenseLogo.vue'

@Component({
  components: {
    LicenseLogo,
    ValidationObserver,
  },
  async asyncData({ app, route, error }) {
    try {
      const res = await app.apolloProvider!.defaultClient.query<IsResetPasswordTokenValidQuery>({
        query: IsResetPasswordTokenValid,
        variables: {
          token: route.params.token,
        } as IsResetPasswordTokenValidQueryVariables,
      })
      if (!res.data.isResetPasswordTokenValid) {
        throw new Error('Token is not valid')
      }
    } catch (e) {
      return error({ statusCode: 404 })
    }
  },
  head() {
    return {
      title: 'Reset password',
    }
  },
})
export default class ResetPasswordPage extends Vue {
  $refs!: {
    passwordInput: FInput
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  form = {
    email: '',
    password: '',
    confirmPassword: '',
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
      const variables: ChangeUserPasswordMutationVariables = {
        token: this.$route.params.token,
        email: this.form.email,
        password: this.form.password,
      }

      const result = await this.$apollo.mutate<ChangeUserPasswordMutation>({
        mutation: ChangeUserPassword,
        variables,
      })

      this.$bus.showSuccessModal('Your password was successfully changed. You will be automatically logged in.', 5000)

      // if we land here - everything went good, login user
      await this.$store.dispatch('account/loginUser', {
        email: this.form.email,
        password: this.form.password,
      })

      // handle redirect after login
      await this.$router.push('/')
    } catch (err) {
      this.isSubmitting = false
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }
}
</script>
