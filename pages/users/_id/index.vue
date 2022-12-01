<template>
  <div v-if="user" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/users" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>

      <h1>{{ user.email }}</h1>
      <div class="flex items-center space-x-2">
        <button
          class="tbtn-icon tbtn--green"
          @click="loginAsUser"
          v-if="isAdmin"
          v-tooltip="{ content: 'Login as user', classes: ['tooltip--green'] }"
        >
          <IHLogin class="w-6 h-6" />
        </button>
        <nuxt-link :to="`/users/${user.id}/form`" class="tbtn-icon tbtn--blue" v-tooltip="'Edit'">
          <IHPencil class="w-6 h-6" />
        </nuxt-link>
      </div>
    </div>
    <div class="grid gap-6 mb-8 grid-cols-1 xl:grid-cols-11">
      <div class="xl:col-span-7 flex flex-col space-y-6">
        <div class="card">
          <div class="card-header">
            <div>
              <h3>User information</h3>
            </div>
          </div>
          <div class="card-body">
            <div>
              <span class="card-item-title first-col-1-4">Firstname</span>
              <span>{{ user.firstname }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-4">Lastname</span>
              <span>{{ user.lastname }}</span>
            </div>
            <div v-if="user.contact_email">
              <span class="card-item-title first-col-1-4">Contact email</span>
              <a :href="`mailto:${user.contact_email}`">{{ user.contact_email }}</a>
            </div>
            <div v-if="user.contact_number">
              <span class="card-item-title first-col-1-4">Contact number</span>
              <a :href="`tel:${user.contact_number}`">{{ user.contact_number }}</a>
            </div>
            <div>
              <span class="card-item-title first-col-1-4">Email</span>
              <a :href="`mailto:${user.email}`">{{ user.email }}</a>
            </div>

            <div v-if="user.roles.length > 0">
              <span class="card-item-title first-col-1-4">Roles</span>
              <span class="-mb-2 -mr-2">
                <div class="tbadge tbadge--blue mr-2 mb-2" v-for="role in user.roles">
                  {{ role }}
                </div>
              </span>
            </div>
            <div>
              <span class="card-item-title first-col-1-4">Registered at</span>
              <span>{{ dateTimeFilter(user.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="xl:col-span-4 flex flex-col space-y-6">
        <div class="card">
          <div class="card-body">
            <div class="flex justify-center">
              <LImg
                class="!flex-none w-48 h-48 border-gray-400 border-2 overflow-hidden rounded-full bg-gray-200"
                :image="user.foto ? user.foto.sizes.PROFILE_IMAGE : null"
              >
                <IHUserFilled class="w-48 h-48 text-gray-400 mt-12" />
              </LImg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, namespace, Vue } from 'nuxt-property-decorator'

import GetUserForView from '@/graphql/ressources/users/GetUserForView.gql'
import { GetUserForViewQuery, UserRole } from '~/graphql/GQLTypes'
import HistoryList from '~/components/admin/HistoryList.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import IHLogin from '~/components/globals/icons/heroicons/IHLogin.vue'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'

@Component({
  components: {
    IHUserFilled,
    IHLogin,
    IHPencil,
    IHChevronLeft,
    HistoryList,
  },
  async asyncData({ app, route }) {
    const data: any = {
      userId: Number.parseInt(route.params.id),
    }
    if (data.userId) {
      const res = await app.apolloProvider!.defaultClient.query<GetUserForViewQuery>({
        query: GetUserForView,
        variables: {
          id: data.userId,
        },
      })
      data.user = res.data.user
    }
    return data
  },
  head() {
    return {
      title: (this as UsersView).user!.email!,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.UserManager,
  },
})
export default class UsersView extends Vue {
  user: GetUserForViewQuery['user'] = null
  dateTimeFilter = this.$options.filters!.datetime
  publicUrl = this.$config.publicUrl

  @(namespace('account').Getter('isAdmin'))
  isAdmin!: boolean

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.user) {
      this.$router.push('/users')
      return
    }
  }

  loginAsUser() {
    this.$store.dispatch('account/loginAsUser', { userId: this.user!.id })
  }
}
</script>
