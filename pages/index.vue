<template>
  <div class="container pt-5">
    <h2>Dashboard</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { UserRole } from '~/graphql/GQLTypes'

@Component({
  // middleware: 'auth',
  middleware({ store, redirect }) {
    const user = store.state.account.user
    if (!user) {
      return redirect('/login')
    }
    // todo: change later to dashboard, when it gets implemented
    if (user.roles.includes(UserRole.Candidate) && user.candidate && user.candidate.id) {
      return redirect(`/candidates/${user.candidate.id}`)
    } else if (user.roles.includes(UserRole.Client) && user.client && user.client.id) {
      return redirect(`/clients/my-projects`)
    } else {
      return redirect('/projects')
    }
  },
  head() {
    return {
      title: 'Dashboard',
    }
  },
})
export default class Dashboard extends Vue {}
</script>
