<template>
  <div class="relative flex justify-center">
    <svg class="relative" :height="radius * 2" :width="radius * 2">
      <circle
        class="filling-circle stroke-green-600 fill-transparent -rotate-90 origin-center"
        :stroke-dasharray="circumference + ' ' + circumference"
        :style="{ strokeDashoffset }"
        :stroke-width="stroke"
        :r="normalizedRadius"
        :cx="radius"
        :cy="radius"
      />
      <circle
        class="stroke-green-600 stroke-1 opacity-40 fill-transparent"
        :r="normalizedRadius"
        :cx="radius"
        :cy="radius"
      />
    </svg>
    <span class="absolute top-1/2 -translate-y-1/2 text-green-700">{{ progress }}%</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

@Component
export default class ProgressRing extends Vue {
  @Prop({ default: 40 })
  radius?: number
  @Prop({ default: 0 })
  progress?: number
  @Prop({ default: 3 })
  stroke?: number

  normalizedRadius = 0
  circumference = 0

  get strokeDashoffset() {
    return this.circumference - (this.progress! / 100) * this.circumference
  }

  mounted() {
    this.normalizedRadius = this.radius! - this.stroke! * 2
    this.circumference = this.normalizedRadius * 2 * Math.PI
  }
}
</script>

<style scoped lang="scss">
.filling-circle {
  transition: stroke-dashoffset 1s ease-out;
}
</style>
