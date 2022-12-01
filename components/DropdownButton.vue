<template>
  <div class="relative">
    <div ref="buttonWrapper">
      <slot name="button" :toggle="toggle">
        <button class="tbtn-icon tbtn--white" type="button" @click="toggle()">
          <IHDotsVertical class="w-6 h-6" />
        </button>
      </slot>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-90"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-100"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-90"
    >
      <div
        class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 flex flex-col py-1 focus:outline-none"
        :class="itemsClass"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
        ref="items"
        v-if="isVisible"
      >
        <slot name="items" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import IHDotsVertical from '~/components/globals/icons/heroicons/IHDotsVertical.vue'

@Component({
  components: { IHDotsVertical },
})
export default class DropdownButton extends Vue {
  $refs!: {
    buttonWrapper: HTMLButtonElement
    items: HTMLDivElement
  }
  @Prop()
  itemsClass!: string

  isVisible = false

  _windowsMousedownListener(event) {
    let target = event.target as HTMLElement
    // let active = document.activeElement

    if (!this.isVisible) return
    if (this.$refs.buttonWrapper && this.$refs.buttonWrapper.contains(target)) return

    // if (!this.$refs.items.contains(target)) this.close()
    // if (active !== document.body && active?.contains(target)) return // Keep focus on newly clicked/focused element
    // if (!event.defaultPrevented) dom(buttonRef)?.focus({ preventScroll: true })

    this.close()
  }

  toggle() {
    if (this.isVisible) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    if (this.isVisible) {
      return
    }
    window.addEventListener('click', this._windowsMousedownListener)

    this.isVisible = true
  }

  close() {
    if (!this.isVisible) {
      return
    }
    window.removeEventListener('click', this._windowsMousedownListener)

    this.isVisible = false
  }

  mounted() {
    // window.addEventListener('click', this._windowsMousedownListener)
  }

  beforeDestroy() {
    window.removeEventListener('click', this._windowsMousedownListener)
  }
}
</script>
