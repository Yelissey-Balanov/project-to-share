import Vue from 'vue'
import { Plugin } from '@nuxt/types'

export interface ToastNotificationButton {
  text: string
  onClick: () => void
  isPrimary?: boolean
}

export interface ToastNotificationOptions {
  type: 'error' | 'info' | 'warning' | 'success'
  text: string
  subtext?: string
  duration?: number
  buttons?: ToastNotificationButton[]
  onClose?: () => void
}

const pluginData = Vue.observable({ notifications: [] as ToastNotification[] })

class ToastNotification implements ToastNotificationOptions {
  type: 'error' | 'info' | 'warning' | 'success'
  text: string
  duration = 8000
  subtext?: string
  buttons?: Array<ToastNotificationButton & { id: string }>
  onClose?: () => void

  id = Math.random().toString(36).substr(2)
  isPaused = false

  private remaining = 0
  private timerId?: number
  private start = Date.now()

  constructor(options: ToastNotificationOptions) {
    this.type = options.type
    this.text = options.text
    this.subtext = options.subtext
    this.onClose = options.onClose

    if (options.hasOwnProperty('duration')) {
      this.duration = options.duration!
    }

    if (options.buttons) {
      this.buttons = options.buttons.map((button) => ({
        ...button,
        id: Math.random().toString(36).substr(2),
      }))
    }

    if (this.duration > 0) {
      this.remaining = this.duration
      this.resume()
    }
  }

  close() {
    const indexOfItem = pluginData.notifications.indexOf(this)
    if (indexOfItem === -1) {
      return
    }

    if (this.onClose) {
      this.onClose()
    }

    // set current top position, giving closing animation nice look
    if (document) {
      const el = document.getElementById(`notification_${this.id}`)
      if (el) {
        el.style.top = el.offsetTop + 'px'
        el.classList.remove('relative')
      }
    }
    pluginData.notifications.splice(indexOfItem, 1)
  }

  pause() {
    this.isPaused = true
    window.clearTimeout(this.timerId)
    this.remaining -= Date.now() - this.start
  }

  resume() {
    this.isPaused = false
    this.start = Date.now()
    window.clearTimeout(this.timerId)
    if (this.remaining > 0) {
      this.timerId = window.setTimeout(() => this.close(), this.remaining)
    }
  }
}

const plugin: Plugin = ({ req, res, store, $config, app }, inject) => {
  Vue.component('toast-notifications', <any>{
    render() {
      return this.$scopedSlots.default({
        items: pluginData.notifications,
      })
    },
  })

  inject('toast', (params: ToastNotificationOptions, reverse = false) => {
    const item = new ToastNotification(params)
    pluginData.notifications.push(item)
    return item
  })
}

export default plugin

// specify types
declare module 'vue/types/vue' {
  interface Vue {
    $toast: (params: ToastNotificationOptions, reverse?: boolean) => ToastNotification
  }
}
declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $toast: (params: ToastNotificationOptions, reverse?: boolean) => ToastNotification
  }
}
