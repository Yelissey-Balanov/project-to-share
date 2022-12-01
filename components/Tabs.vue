<template>
  <div>
    <div class="flex items-baseline border-b border-gray-300">
      <div class="mr-8 text-2xl font-normal py-3">
        <slot name="header"></slot>
      </div>
      <button
        type="button"
        class="text-base text-gray-500 py-4 px-6 hover:text-blue-700 focus:outline-none relative transition duration-300 ease-in-out"
        :class="{ 'text-blue-700': selectedIndex === i }"
        v-for="(tab, i) in tabs"
        @click="selectTab(i)"
      >
        {{ tab.title }}
        <span
          class="absolute bg-blue-600 h-0.5 left-0 right-0 opacity-0 transform scale-x-0 transition duration-300 ease-in-out"
          style="bottom: -1px"
          :class="{ 'scale-x-100 opacity-100': selectedIndex === i }"
        ></span>
      </button>
    </div>
    <div class="pt-4">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import Tab from '~/components/Tab.vue'

@Component
export default class Tabs extends Vue {
  selectedIndex: number = -1
  tabs: Tab[] = []
  updateAfterTabSelection = false
  refreshedTabsAfterUpdate = false

  mounted() {
    this.parseTabsFromSlot()
  }

  updated() {
    if (this.updateAfterTabSelection || this.refreshedTabsAfterUpdate) {
      this.updateAfterTabSelection = false
      this.refreshedTabsAfterUpdate = false
      return
    }
    this.parseTabsFromSlot()
    this.refreshedTabsAfterUpdate = true
  }

  parseTabsFromSlot() {
    const tabs: Tab[] = []
    if (this.$slots.default) {
      this.$slots.default.forEach((slot) => {
        if (!slot.componentOptions || slot.componentOptions.tag !== 'Tab' || !slot.componentInstance) {
          return
        }
        tabs.push(slot.componentInstance as Tab)
      })
    }
    this.tabs = tabs

    this.selectedIndex = -1
    this.tabs.forEach((tab, i) => {
      if (tab.isActive) {
        this.selectedIndex = i
      }
    })
    if (this.selectedIndex === -1 && this.tabs.length > 0) {
      this.selectTab(0)
    }
  }

  selectTab(i) {
    if (this.tabs[this.selectedIndex]) {
      this.tabs[this.selectedIndex].isActive = false
      this.tabs[i].$emit('deactivated')
    }
    this.updateAfterTabSelection = true
    this.tabs[i].isActive = true
    this.tabs[i].$emit('activated')
    this.selectedIndex = i
  }
}
</script>
