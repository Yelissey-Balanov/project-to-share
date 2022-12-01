import { User } from '~/store'
import { UserRole } from '~/graphql/GQLTypes'

export default function (user: User | undefined) {
  // check if logged in user may access terms of service
  if (user && user.roles.includes(UserRole.Employee)) {
    return true
  }

  // check if localStorage has an specified key
  if (process.client && localStorage.getItem('accessedSharedProject') === 'true') {
    return true
  }

  return false
}
