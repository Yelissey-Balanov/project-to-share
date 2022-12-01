import JSCookie from 'js-cookie'
import { parse as parseCookieFromRequest, serialize as serializeCookie } from 'cookie'
import { Plugin } from '@nuxt/types'

const plugin: Plugin = ({ req, res }, inject) => {
  let serverCookies = {}
  if (process.server) {
    serverCookies = parseCookieFromRequest((req && req.headers.cookie) || '')
  }

  inject('cookies', {
    getServerCookies: () => {
      return serverCookies
    },
    get: (key: string) => {
      // read cookie on server
      if (process.server) {
        // rework working with cookies on server - dont check them from request headers, as after changing it is not stored
        return key in serverCookies ? serverCookies[key] : undefined
      }
      // read cookie on client
      return JSCookie.get(key)
    },
    remove: (key: string) => {
      // remove cookie on server
      if (process.server) {
        // if given cookie exists, redefine cookie value
        if (key in serverCookies && res) {
          // update cookies on request object
          delete serverCookies[key]

          // set cookies on response cookie
          let setCookieHeader = res.getHeader('Set-Cookie') as string[]
          if (setCookieHeader === undefined) {
            setCookieHeader = []
            res.setHeader('Set-Cookie', setCookieHeader)
          }
          setCookieHeader.push(
            serializeCookie(key, '', {
              expires: new Date(1970),
              path: '/',
            })
          )
        }
        return
      }
      // remove cookie on client
      JSCookie.remove(key)
    },
    set: (key: string, value: string, expiresAfterDays: number) => {
      // first remove given key to be able to clean up clearly
      // app.$cookies.remove(key);
      // set cookie on server
      if (process.server && res) {
        serverCookies[key] = value

        res.setHeader(
          'Set-Cookie',
          serializeCookie(key, value, {
            maxAge: expiresAfterDays * 24 * 60 * 60,
            path: '/',
          })
        )
        return
      }
      // set cookie on client
      JSCookie.set(key, value, { expires: expiresAfterDays, path: '/' })
    },
  })
}

interface $Cookies {
  getServerCookies(): object | undefined

  get(key: string): string | undefined

  remove(key: string): void

  set(key: string, value: string, expiresAfterDays: number): void
}

declare module 'vue/types/vue' {
  interface Vue {
    $cookies: $Cookies
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $cookies: $Cookies
  }
}

export default plugin
