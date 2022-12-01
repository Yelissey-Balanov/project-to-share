<template>
  <div>
    <transition name="fade">
      <div class="progress-line" v-if="gqlLoadingCounter > 0"></div>
    </transition>

    <nav class="border-r border-r-slate-300 bg-slate-200 h-screen fixed top-0 left-0 z-[99] overflow-y-auto w-[190px]">
      <ul class="m-0 flex flex-col px-0 py-2.5 w-full h-full">
        <li class="flex items-center justify-center px-0 py-2.5">
          <img src="~assets/imgs/logo-icon-text.svg" width="148" height="44" />
        </li>

        <template v-if="isCandidate && accountUser.candidate && accountUser.candidate.id">
          <nuxt-link tag="li" :to="`/candidates/${accountUser.candidate.id}`" key="my-candidate-profile">
            <a>My candidate profile</a>
          </nuxt-link>
          <nuxt-link tag="li" :to="`/candidates/my-projects`" key="my-candidate-projects">
            <a>My projects</a>
          </nuxt-link>
        </template>

        <template v-if="isClient && accountUser.client && accountUser.client.id">
          <nuxt-link tag="li" :to="`/clients/my-projects`" key="my-client-projects">
            <a>My projects</a>
          </nuxt-link>
          <nuxt-link
            tag="li"
            :to="`/clients/${accountUser.client.id}`"
            v-if="accountUser.client && accountUser.client.id"
            kay="my-client-profile"
          >
            <a>My client profile</a>
          </nuxt-link>
        </template>

        <template v-if="isEmployee">
          <nuxt-link tag="li" to="/my" key="my">
            <a>Dashboard</a>
          </nuxt-link>
          <nuxt-link tag="li" to="/revenues" v-if="accountUser.roles.includes(UserRole.RevenueManager)" key="revenues">
            <a>Revenues</a>
          </nuxt-link>
          <li style="margin-top: 20px"></li>

          <nuxt-link tag="li" to="/projects" key="projects">
            <a>Projects</a>
          </nuxt-link>
          <nuxt-link tag="li" to="/clients" key="clients">
            <a>Clients</a>
          </nuxt-link>
          <nuxt-link tag="li" to="/companies" key="companies">
            <a>Companies</a>
          </nuxt-link>
          <nuxt-link tag="li" to="/candidates" key="candidates">
            <a>Candidates</a>
          </nuxt-link>
          <nuxt-link tag="li" to="/buckets" key="buckets">
            <a>Buckets</a>
          </nuxt-link>

          <li style="margin-top: 20px"></li>
          <nuxt-link tag="li" to="/industries" key="industries">
            <a>
              Industries
              <transition name="tag-counter">
                <span class="tbadge tbadge--small tbadge--slate" v-if="notReviewedIndustries > 0">
                  {{ notReviewedIndustries }}
                </span>
              </transition>
            </a>
          </nuxt-link>
          <nuxt-link tag="li" to="/skills" key="skills">
            <a>
              Skills
              <transition name="tag-counter">
                <span class="tbadge tbadge--small tbadge--slate" v-if="notReviewedSkills > 0">
                  {{ notReviewedSkills }}
                </span>
              </transition>
            </a>
          </nuxt-link>
          <nuxt-link tag="li" to="/it-skills" key="it-skills">
            <a>
              IT Skills
              <transition name="tag-counter">
                <span class="tbadge tbadge--small tbadge--slate" v-if="notReviewedItSkills > 0">
                  {{ notReviewedItSkills }}
                </span>
              </transition>
            </a>
          </nuxt-link>
          <nuxt-link tag="li" to="/certifications" key="certifications">
            <a>
              Certifications
              <transition name="tag-counter">
                <span class="tbadge tbadge--small tbadge--slate" v-if="notReviewedCertifications > 0">
                  {{ notReviewedCertifications }}
                </span>
              </transition>
            </a>
          </nuxt-link>
          <nuxt-link tag="li" to="/institutions" key="institutions">
            <a>
              Institutions
              <transition name="tag-counter">
                <span class="tbadge tbadge--small tbadge--slate" v-if="notReviewedInstitutions > 0">
                  {{ notReviewedInstitutions }}
                </span>
              </transition>
            </a>
          </nuxt-link>
        </template>

        <template v-if="accountUser.roles.includes(UserRole.CoronaHelpdeskManager) && isCoronaHelpdeskEnabled">
          <li style="margin-top: 20px"></li>
          <nuxt-link tag="li" to="/corona-helpdesk" key="corona-helpdesk">
            <a>Corona Helpdesk</a>
          </nuxt-link>
          <nuxt-link tag="li" to="/corona-helpdesk/newsticker" key="corona-helpdesk-newsticker">
            <a>Newsticker</a>
          </nuxt-link>
        </template>

        <li style="margin-top: 20px; margin-bottom: auto"></li>

        <nuxt-link
          tag="li"
          :to="'/stats/' + accountUser.id"
          v-if="accountUser.roles.includes(UserRole.Employee)"
          key="my-stats"
        >
          <a>My stats</a>
        </nuxt-link>

        <template v-if="isAdmin">
          <nuxt-link tag="li" to="/stats" key="stats">
            <a>Stats</a>
          </nuxt-link>
        </template>
        <nuxt-link tag="li" to="/users" key="users" v-if="accountUser.roles.includes(UserRole.UserManager)">
          <a>Users</a>
        </nuxt-link>

        <template v-if="accountUser.roles.includes(UserRole.EmployeeManager) && isEmployeesEnabled">
          <nuxt-link tag="li" to="/employees" key="employees">
            <a>Employees</a>
          </nuxt-link>
        </template>

        <nuxt-link tag="li" to="/settings" key="settings" v-if="isAdmin">
          <a>Settings</a>
        </nuxt-link>

        <template v-if="isCandidate || isClient">
          <nuxt-link tag="li" to="/impressum" key="impressum">
            <a>Impressum</a>
          </nuxt-link>
          <nuxt-link tag="li" to="/terms-privacy" key="terms-privacy">
            <a>Datenschutz</a>
          </nuxt-link>
          <nuxt-link tag="li" to="/terms-of-use" key="terms-of-use">
            <a>Nutzungsbedingungen</a>
          </nuxt-link>
        </template>
        <li style="cursor: pointer" @click="dispatchLogout" key="logout">
          <a>Logout</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { State } from 'vuex-class'
import { StellaPlugin, UserRole } from '~/graphql/GQLTypes'
import { namespace } from 'nuxt-property-decorator'

@Component
export default class MainNav extends Vue {
  UserRole = UserRole

  @State('gqlLoadingCounter')
  gqlLoadingCounter

  @State((state) => state.account.user)
  accountUser

  @(namespace('account').Getter('isCandidate'))
  isCandidate!: boolean

  @(namespace('account').Getter('isClient'))
  isClient!: boolean

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  @(namespace('account').Getter('isAdmin'))
  isAdmin!: boolean

  @State((state) => state.skill.notReviewedCount)
  notReviewedSkills!: number

  @State((state) => state.industry.notReviewedCount)
  notReviewedIndustries!: number

  @State((state) => state.itSkill.notReviewedCount)
  notReviewedItSkills!: number

  @State((state) => state.certification.notReviewedCount)
  notReviewedCertifications!: number

  @State((state) => state.institution.notReviewedCount)
  notReviewedInstitutions!: number

  mounted() {
    if (this.$store.getters['account/isEmployee']) {
      // fetch all essential models to vuex to also be able to show not reviewed counts,
      // but only after two seconds, so this queries don't concurrent with the rest of the app
      setTimeout(() => {
        this.$store.dispatch('industry/fetchIndustries')
        this.$store.dispatch('skill/fetchSkills')
        this.$store.dispatch('itSkill/fetchItSkills')
        this.$store.dispatch('certification/fetchCertifications')
        this.$store.dispatch('institution/fetchInstitutions')
      }, 2000)
    }
  }

  dispatchLogout() {
    this.$store.dispatch('account/logout')
  }

  get isCoronaHelpdeskEnabled() {
    return this.$store.getters['stella/isPluginEnabled'](StellaPlugin.CoronaHelpdesk)
  }

  get isEmployeesEnabled() {
    return this.$store.getters['stella/isPluginEnabled'](StellaPlugin.Employees)
  }
}
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  @apply transition-all duration-200 translate-y-0;
}

.fade-enter,
.fade-leave-to {
  @apply opacity-0 -translate-y-full;
}

nav {
  ul {
    @apply m-0 flex flex-col py-2.5 px-0 w-full h-full;

    li {
      @apply flex;
      a {
        @apply text-slate-900 flex items-center w-full min-h-[40px] justify-between no-underline py-2.5 pr-2.5 pl-5;

        &:hover,
        &:focus {
          @apply bg-slate-300 no-underline;
          //background: mix($color-primary, #f0f0f0, 10);
        }
      }
    }
    li.nuxt-link-active a {
      @apply text-white bg-slate-600;
    }
  }
}

.tag-counter-enter-active,
.tag-counter-leave-active {
  @apply transition-opacity transition-transform duration-200;
}

.tag-counter-enter, .tag-counter-leave-to /* .fade-leave-active below version 2.1.8 */ {
  @apply opacity-0 translate-x-5;
}
</style>
