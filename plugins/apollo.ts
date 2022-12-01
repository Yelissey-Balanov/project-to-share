import Vue from 'vue'
import axios from 'axios'
import { ApolloClient } from 'apollo-client'
import * as ApolloUploadClient from 'apollo-upload-client'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import VueApollo, { ApolloProvider } from 'vue-apollo'
import { from } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpOptions } from 'apollo-link-http-common'
import { Plugin } from '@nuxt/types'
import introspectionQueryResultData from '~/graphql/fragmentTypes.json'
import * as Sentry from '@sentry/browser'
import { Response, Headers } from 'cross-fetch'
import { identity, mapKeys } from 'lodash'
import FormData from 'form-data'
import { setContext } from 'apollo-link-context'
import { DateTime } from 'luxon'

// Install the vue plugin
Vue.use(VueApollo)

interface QueueStatus {
  isRefreshing: boolean
  queue: any[]
}

const refreshQueue: QueueStatus = {
  isRefreshing: false,
  queue: [],
}

const localTimezone = DateTime.local().zoneName

/**
 * A Fetch WebAPI implementation based on the Axios client
 */
async function axiosFetch(axiosObj, transfomer, input, init: any = {}) {
  // Convert the `fetch` style arguments into a Axios style config
  transfomer = transfomer || identity

  const lowerCasedHeaders = mapKeys(init.headers, (value, key) => {
    return key.toLowerCase()
  })

  if (!('content-type' in lowerCasedHeaders)) {
    lowerCasedHeaders['content-type'] = 'text/plain;charset=UTF-8'
  }
  lowerCasedHeaders['x-user-tz'] = localTimezone

  const config = transfomer(
    {
      url: input,
      method: init.method || 'GET',
      data: init.body instanceof FormData ? init.body : String(init.body),
      headers: lowerCasedHeaders,
      validateStatus: () => true,
    },
    input,
    init
  )

  const result = await axiosObj.request(config)

  // Convert the Axios style response into a `fetch` style response
  const responseBody = typeof result.data === `object` ? JSON.stringify(result.data) : result.data

  const headers = new Headers()
  Object.entries(result.headers).forEach(([key, value]: any) => {
    headers.append(key, value)
  })

  return new Response(responseBody, {
    status: result.status,
    statusText: result.statusText,
    headers,
  })
}

function buildAxiosFetch(axiosObj, transformer) {
  return axiosFetch.bind(undefined, axiosObj, transformer)
}

const plugin: Plugin = ({ app, store, redirect, beforeNuxtRender, isDev, error, $config, req }) => {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  })

  const apolloClientCache = new InMemoryCache({ fragmentMatcher })

  if (!process.server) {
    apolloClientCache.restore((window as any).__NUXT__ ? (window as any).__NUXT__.apollo.defaultClient : null)
  }
  const apolloClientOptions: HttpOptions = {
    uri: $config.graphqlEndpoint + (isDev ? '?XDEBUG_SESSION_START=phpstorm' : ''),
    fetch: buildAxiosFetch(axios, (config, input, init) => {
      if (app.$sentry && typeof config.data === 'string') {
        app.$sentry.addBreadcrumb({
          category: 'gql request',
          message: JSON.stringify(JSON.parse(config.data), null, 2).replace(
            /\\n/g,
            `
`
          ),
          level: Sentry.Severity.Info,
        })
      }
      return {
        ...config,
        onUploadProgress: init.onUploadProgress,
      }
    }),
  }
  const uploadLink = ApolloUploadClient.createUploadLink(apolloClientOptions)

  const setTokenMiddleware = setContext(async () => {
    // if you have a cached value, return it immediately
    let xsrfToken = app.$cookies.get('XSRF-TOKEN')
    let receivedCookies = ''
    const headers: any = {}

    if (!xsrfToken) {
      const res = await axios.get($config.baseServerUrl + '/sanctum/csrf-cookie')
      if (res.headers['set-cookie']) {
        res.headers['set-cookie'].forEach((setCookie) => {
          const cookie = decodeURIComponent(setCookie.substr(0, setCookie.indexOf(';')))
          if (receivedCookies.length > 0) {
            receivedCookies += '; '
          }
          receivedCookies += cookie
          if (cookie.startsWith('XSRF-TOKEN=')) {
            xsrfToken = cookie.substr('XSRF-TOKEN='.length)
          }
        })
      }
    }

    if (process.server) {
      const requestScheme = req.headers['x-request-scheme'] ? req.headers['x-request-scheme'] : 'https'
      const origin = `${requestScheme}://${req.headers.host}`
      const cookie = (headers.cookie = receivedCookies
        ? receivedCookies
        : Object.entries(app.$cookies.getServerCookies()!)
            .map((entry) => entry.join('='))
            .join('; '))

      headers.origin = origin

      if (xsrfToken) {
        headers['x-xsrf-token'] = xsrfToken
      }
      return { headers }
    }
  })

  const errorHandler = onError(({ graphQLErrors, networkError, operation, forward, response }) => {
    if (
      networkError &&
      // @ts-ignore
      networkError.statusCode === 419
    ) {
      // session is expired, user needs to login again
      console.warn('Server respond with 419 error code. Your session is probably expired! Clean up cookies')
      app.$cookies.remove('XSRF-TOKEN')
      // redirect('/login')
      return
    } else if (
      networkError &&
      // @ts-ignore
      networkError.statusCode === 503
    ) {
      store.commit('setMaintenance', true)
      redirect(302, '/maintenance')
    }
  })

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: from([setTokenMiddleware, errorHandler, uploadLink]),
    cache: apolloClientCache,
    connectToDevTools: process.client,
    ...(process.server
      ? {
          ssrMode: true,
        }
      : {
          ssrForceFetchDelay: 100,
        }),
  })

  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
  })
  ;(app as any).apolloProvider = apolloProvider

  if (process.server) {
    const apolloSSR = require('vue-apollo/ssr')
    beforeNuxtRender(({ nuxtState }) => {
      nuxtState.apollo = apolloSSR.getStates(apolloProvider)
      // or next line?
      // nuxtState.apolloState = apolloSSR.getStates(apolloProvider);
    })
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    apolloProvider: ApolloProvider
  }
}

export default plugin
