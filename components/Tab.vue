<template>
  <div v-show="isActive"><slot /></div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'

@Component
export default class Tab extends Vue {
  @Prop({ required: true })
  title!: string

  isActive = false

  created() {}
}
</script>
