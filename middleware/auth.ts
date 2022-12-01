import { User } from '~/store'
import { Maybe, UserRole } from '~/graphql/GQLTypes'
import { Middleware } from '@nuxt/types'

const authMiddleware: Middleware = ({ store, route, redirect, error }) => {
  // Check if user is connected first
  if (!store.state.account!.user) {
    return redirect('/login', {
      redirect: encodeURIComponent(route.fullPath),
    })
  }

  // check, if user has guest role, if so, navigate to info page
  if (store.state.account!.user.roles.includes(UserRole.Guest)) {
    if (route.fullPath === '/account-is-locked') {
      return
    }
    return redirect('/account-is-locked')
  }

  // so user is not a guest! Check if he is at account-is-locked page, and redirect him
  if (route.fullPath === '/account-is-locked') {
    return redirect('/')
  }

  // parse routes meta
  let authorizationRole: Maybe<UserRole> = null
  let allowAlsoFor: Maybe<{ userPath: string; routePath: string }> = null
  route.meta.forEach((meta) => {
    if ('requiredRole' in meta) {
      authorizationRole = meta.requiredRole
    }
    if ('allowAlsoFor' in meta) {
      allowAlsoFor = meta.allowAlsoFor
    }
  })

  // check, if a role is required
  const userRoles = (store.state.account!.user as User).roles
  const allowedViaRole = authorizationRole ? userRoles.includes(authorizationRole) : false

  // check additional rule matching
  let allowedViaRouteParams = false
  if (allowAlsoFor) {
    const userProp = allowAlsoFor!.userPath.split('.').reduce(objectPropertyReducer, store.state.account!.user)
    const routeProp = allowAlsoFor!.routePath.split('.').reduce(objectPropertyReducer, route)
    // tslint:disable-next-line:triple-equals
    allowedViaRouteParams = userProp == routeProp
  }

  if (allowedViaRole || allowedViaRouteParams) {
    return
  }
  return error({
    statusCode: 401,
    message: 'You are not allowed to visit this page',
  })
}

function objectPropertyReducer(obj, prop) {
  return obj && prop in obj ? obj[prop] : undefined
}

export default authMiddleware
