<template>
  <div
    aria-live="assertive"
    class="fixed inset-0 flex items-end px-4 pt-6 pb-2 pointer-events-none sm:p-6 sm:items-start top-0 z-[11000]"
  >
    <toast-notifications v-slot="{ items }">
      <transition-group
        tag="div"
        class="w-full flex flex-col items-center sm:items-end sm:flex-col-reverse"
        enter-active-class="transform ease-out duration-300 transition"
        enter-class="translate-y-4 opacity-0 sm:translate-y-0 sm:translate-x-4"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transform ease-out duration-200 absolute"
        leave-class="opacity-100"
        leave-to-class="opacity-0 sm:translate-x-4"
        move-class="transform ease-out duration-300 transition"
      >
        <div
          class="mb-4 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 overflow-hidden relative"
          :class="{
            'ring-blue-500': item.type === 'info',
            'ring-yellow-500': item.type === 'warning',
            'ring-green-500': item.type === 'success',
            'ring-red-500': item.type === 'error',
          }"
          v-for="item of items"
          :key="`notification_${item.id}`"
          :id="`notification_${item.id}`"
          @mouseenter="item.pause()"
          @mouseleave="item.resume()"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <!-- Heroicon name: outline/inbox  h-6 w-6 text-gray-400 -->
                <IHCheckCircle class="h-6 w-6 text-green-600" v-if="item.type === 'success'" />
                <IHInfoCircle class="h-6 w-6 text-blue-600" v-else-if="item.type === 'info'" />
                <IHExclamationCircle class="h-6 w-6 text-yellow-600" v-else-if="item.type === 'warning'" />
                <IHExclamationCircle class="h-6 w-6 text-red-600" v-else />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium">
                  {{ item.text }}
                </p>

                <p class="mt-1 text-sm text-gray-500" v-if="item.subtext">{{ item.subtext }}</p>

                <div class="mt-4 flex space-x-3" v-if="item.buttons && item.buttons.length > 0">
                  <button
                    v-for="button in item.buttons"
                    :key="button.id"
                    type="button"
                    class="tbtn tbtn--small"
                    :class="{
                      'tbtn--blue': button.isPrimary && item.type === 'info',
                      'tbtn--yellow': button.isPrimary && item.type === 'warning',
                      'tbtn--green': button.isPrimary && item.type === 'success',
                      'tbtn--red': button.isPrimary && item.type === 'error',
                      'tbtn--white': !button.isPrimary,
                    }"
                    @click="button.onClick() !== false && item.close()"
                  >
                    {{ button.text }}
                  </button>
                </div>
              </div>

              <div class="ml-4 flex-shrink-0 flex">
                <button
                  type="button"
                  @click="item.close()"
                  class="bg-white rounded-full inline-flex text-gray-400 hover:text-gold focus:text-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-70"
                >
                  <span class="sr-only">Close</span>
                  <IHX class="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              class="absolute bottom-0 left-0 right-0 rounded-lg origin-left h-1"
              :class="{
                'bg-blue-500': item.type === 'info',
                'bg-yellow-500': item.type === 'warning',
                'bg-green-500': item.type === 'success',
                'bg-red-500': item.type === 'error',
              }"
              style="animation: scale-x-frames linear 1 forwards"
              :style="{
                animationPlayState: item.isPaused ? 'paused' : 'running',
                animationDuration: item.duration + 'ms',
              }"
              v-if="item.duration > 0"
            ></div>
          </div>
        </div>
      </transition-group>
    </toast-notifications>
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import IHX from '~/components/globals/icons/heroicons/IHX.vue'
import IHCheckCircle from '~/components/globals/icons/heroicons/IHCheckCircle.vue'
import IHExclamationCircle from '~/components/globals/icons/heroicons/IHExclamationCircle.vue'
import IHInfoCircle from '~/components/globals/icons/heroicons/IHInfoCircle.vue'

@Component({
  components: { IHInfoCircle, IHExclamationCircle, IHCheckCircle, IHX },
})
export default class NotificationsWrapper extends Vue {}
</script>

<style>
@keyframes scale-x-frames {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0);
  }
}
</style>
