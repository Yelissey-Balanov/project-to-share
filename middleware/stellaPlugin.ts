import { Maybe, StellaPlugin } from '~/graphql/GQLTypes'
import { Middleware } from '@nuxt/types'
import formatSnakeCaseString from '~/helpers/formatSnakeCaseString'

const pluginMiddleware: Middleware = ({ store, route, redirect, error }) => {
  // parse routes meta
  let routePlugin: Maybe<StellaPlugin> = null
  route.meta.forEach((meta) => {
    if ('plugin' in meta) {
      routePlugin = meta.plugin
    }
  })

  if (store.getters['stella/isPluginEnabled'](routePlugin)) {
    return
  }

  return error({
    statusCode: 401,
    message: `This page ist a part of "${formatSnakeCaseString(
      routePlugin
    )}" plugin. If you wish to use it, please contact us.`,
  })
}

export default pluginMiddleware
