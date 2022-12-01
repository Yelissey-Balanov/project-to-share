<template>
  <div class="flex flex-col justify-center items-center pt-8 px-4 pb-[20vh] min-h-screen">
    <div class="max-w-[400px] w-full flex flex-col items-center">
      <LicenseLogo class="mb-10" />
      <div class="self-stretch bg-white p-5 border border-gray-100">
        <h1 class="mt-0 text-center font-normal">Sign up</h1>

        <ValidationObserver tag="form" class="flex-col flex" @submit.prevent="submitForm" ref="formValidationObserver">
          <FInput v-model="form.email" label="Email" type="email" :rules="'required|email'" errorLabel="email" />

          <FInput
            v-model="form.password"
            label="Password"
            type="password"
            autocomplete="new-password"
            :rules="'required'"
            errorLabel="password"
          />

          <FInput v-model="form.firstname" label="Firstname" />
          <FInput v-model="form.lastname" label="Lastname" />

          <button type="submit" class="tbtn tbtn-blue self-end"> Sign up </button>
        </ValidationObserver>
      </div>
      <div class="mt-3 px-5 self-end">
        Already have an account?
        <nuxt-link to="/login">Login</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import LicenseLogo from '~/components/LicenseLogo.vue'

@Component({
  components: {
    LicenseLogo,
    ValidationObserver,
  },
  head() {
    return {
      title: 'Sign-up',
    }
  },
  middleware: ({ redirect }) => {
    return redirect(302, '/')
  },
})
export default class Register extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  form = {
    email: '',
    password: '',
    firstname: '',
    lastname: '',
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
      .dispatch('account/registerUser', {
        email: this.form.email,
        password: this.form.password,
        firstname: this.form.firstname,
        lastname: this.form.lastname,
      })
      .then(() => {
        this.waitingResponse = false
        this.$router.push('/')
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
