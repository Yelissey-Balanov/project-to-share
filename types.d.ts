// As long apollo don't ship new version to npm, this is a workaround
// https://github.com/apollographql/apollo-link/issues/1131
import Vue from '~/node_modules/vue'
import { Store } from '~/node_modules/vuex'
import { RootState } from '~/store'
import { EventBus } from '~/plugins/event-bus.client'

declare type GlobalFetch = WindowOrWorkerGlobalScope

declare module '@nuxt/types/app/index' {
  interface Context {
    // @ts-ignore
    store: Store<RootState>
    $bus: EventBus
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    // @ts-ignore
    $store: Store<RootState>
    $bus: EventBus
  }
}

// declare module '@nuxt/types' {
//   interface NuxtAppOptions {
//     $bus: EventBus
//   }
// }
