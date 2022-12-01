import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { RootState, User, UserState } from './index'
import me from '@/graphql/Me.gql'
import loginMutation from '@/graphql/Login.gql'
import logoutMutation from '@/graphql/Logout.gql'
import registerMutation from '@/graphql/Register.gql'
import {
  LoginAsUserMutation,
  LoginAsUserMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeQuery,
  RegisterMutation,
  RegisterMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import * as Sentry from '@sentry/browser'
import axios from 'axios'
import LoginAsUser from '~/graphql/LoginAsUser.gql'

export const state = (): UserState => ({
  user: undefined,
})

export const getters: GetterTree<UserState, RootState> = {
  isAdmin(localState) {
    return localState.user && localState.user.roles.includes(UserRole.Admin)
  },
  isEmployee(localState) {
    return localState.user && localState.user.roles.includes(UserRole.Employee)
  },
  isCandidate(localState) {
    return localState.user && localState.user.roles.includes(UserRole.Candidate)
  },
  isClient(localState) {
    return localState.user && localState.user.roles.includes(UserRole.Client)
  },
  isRevenueManager(localState) {
    return localState.user && localState.user.roles.includes(UserRole.RevenueManager)
  },
}

export const mutations: MutationTree<UserState> = {
  setUser(localState, user: MeQuery['me']) {
    localState.user = user
  },
}

export const actions: ActionTree<UserState, RootState> = {
  async registerUser({ dispatch }, payload: { email: string; password: string; firstname: string; lastname: string }) {
    this.app.apolloProvider!.defaultClient.clearStore()
    const variables: RegisterMutationVariables = {
      email: payload.email,
      password: payload.password,
      firstname: payload.firstname,
      lastname: payload.lastname,
    }
    return this.app
      .apolloProvider!.defaultClient.mutate<RegisterMutation>({
        fetchPolicy: 'no-cache',
        mutation: registerMutation,
        variables,
      })
      .then(({ data }) => {
        return dispatch('fetchUser')
      })
  },
  async loginUser({ dispatch }, payload: { email: string; password: string }) {
    this.app.apolloProvider!.defaultClient.cache.reset()

    return axios.get(this.app.$config.baseServerUrl + '/sanctum/csrf-cookie').then(() => {
      return this.app
        .apolloProvider!.defaultClient.mutate<LoginMutation>({
          fetchPolicy: 'no-cache',
          mutation: loginMutation,
          variables: {
            email: payload.email,
            password: payload.password,
          },
        })
        .then(({ data }) => {
          return dispatch('fetchUser')
        })
    })
  },
  async loginAsUser({ dispatch, getters }, payload: { userId: number }) {
    if (!getters.isAdmin) {
      return
    }
    this.app.apolloProvider!.defaultClient.cache.reset()

    return this.app
      .apolloProvider!.defaultClient.mutate<LoginAsUserMutation>({
        mutation: LoginAsUser,
        variables: {
          userId: payload.userId,
        } as LoginAsUserMutationVariables,
      })
      .then(({ data }) => {
        return dispatch('fetchUser')
      })
  },

  async fetchUser({ commit, dispatch }) {
    return this.app
      .apolloProvider!.defaultClient.query({ query: me })
      .then(({ data }: { data: MeQuery }) => {
        if (!data.me) {
          dispatch('logout')
          throw Error('Couldnt fetch user, session is probably expired')
        }
        commit('setUser', data.me)
        if (data.me!.id) {
          Sentry.configureScope((scope) => {
            scope.setUser({
              id: data.me!.id!.toString(),
              email: data.me!.email!,
            })
          })
          if (process.client) {
            this.app.$bus.connectWebSocket()
          }
        }
        return data.me
      })
      .catch(() => {
        // ignore errors on fetching user
      })
  },

  async logout({ commit }) {
    await this.app.apolloProvider!.defaultClient.cache.reset()
    return this.app
      .apolloProvider!.defaultClient.mutate<LogoutMutation>({
        fetchPolicy: 'no-cache',
        mutation: logoutMutation,
      })
      .then(() => {
        commit('setUser', null)
        this.app.$cookies.remove('XSRF-TOKEN')

        Sentry.configureScope((scope) => {
          scope.setUser({
            id: undefined,
            email: undefined,
          })
        })
        if (this.app.$bus) {
          this.app.$bus.disconnectWebSocket()
        }

        this.$router.push('/login')
      })
  },
}
