<template>
  <div class="flex flex-col items-center justify-center min-h-screen pb-20 px-4">
    <LicenseLogo class="w-64 mb-12" />

    <h1 class="mb-6 text-center">Login to your account</h1>
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

        <FInput
          v-model="form.password"
          label="Password"
          type="password"
          :checkAutofilled="true"
          :rules="'required'"
          errorLabel="password"
        />

        <button type="submit" class="tbtn tbtn--blue w-full">Login</button>
      </ValidationObserver>
    </div>
    <div class="max-w-md w-full mt-4 px-8 text-right"><nuxt-link to="/reset-password">Forgot password?</nuxt-link></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import { MeQuery, UserRole } from '~/graphql/GQLTypes'
import { State } from 'nuxt-property-decorator'
import LicenseLogo from '~/components/LicenseLogo.vue'

@Component({
  middleware: 'guest',
  components: {
    LicenseLogo,
    ValidationObserver,
  },
  head() {
    return {
      title: 'Login',
    }
  },
})
export default class Login extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  form = {
    email: '',
    password: '',
  }

  waitingResponse = false

  async submitForm() {
    if (this.waitingResponse) {
      return
    }

    if (!(await validateObserver(this.$refs.formValidationObserver, false))) {
      return
    }

    this.waitingResponse = true
    this.$store
      .dispatch('account/loginUser', {
        email: this.form.email,
        password: this.form.password,
      })
      .then((user: NonNullable<MeQuery['me']>) => {
        this.waitingResponse = false
        // handle redirect after login
        if (this.$route.query.redirect) {
          this.$router.replace(decodeURIComponent(this.$route.query.redirect as string))
        } else {
          this.$router.push('/')
        }
      })
      .catch((err) => {
        this.waitingResponse = false
        console.error(err)
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
}
</script>
