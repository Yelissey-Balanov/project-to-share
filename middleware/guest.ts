import { Middleware } from '@nuxt/types'

const guestMiddleware: Middleware = ({ store, redirect }) => {
  // Check if user is connected first
  if (store.state.account!.user) {
    return redirect('/')
  }
}

export default guestMiddleware
