<template>
  <div class="f-notice-period-input relative" :class="{ 'is-disabled': disabled, 'is-empty': !amountValue }">
    <label
      v-if="!!label"
      class="absolute block -top-[15px] scale-[80%] left-1 pointer-events-none font-normal text-gray-800 max-w-full truncate"
      :class="disabled && 'opacity-40'"
    >
      {{ label }}</label
    >
    <div class="flex space-x-4 w-full">
      <FInput v-model="amountValue" :disabled="disabled" class="w-full max-w-[60px]" />
      <FSelectSimple
        v-model="unitValue"
        :options="unitOptions"
        :disabled="disabled || !amountValue"
        :nullable="false"
        class="w-full max-w-[140px]"
      />
      <FSelectSimple
        v-model="toValue"
        :options="toOptions"
        :disabled="disabled || !amountValue"
        :nullable="false"
        class="w-full"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { Maybe } from '@/graphql/GQLTypes'
import { NoticePeriodValue } from '~/helpers/types'

@Component
export default class FNoticePeriodInput extends Vue {
  @Prop()
  value?: Maybe<NoticePeriodValue>
  @Prop()
  label?: string
  @Prop({ default: false })
  disabled?: boolean

  amountValue: Maybe<string | number> = null
  unitValue: string = 'd'
  toValue: string = 'eom'

  unitOptions = {
    d: 'days',
    w: 'weeks',
    m: 'months',
  }

  toOptions = {
    eom: 'to the end of month',
    mom: 'to the middle of month',
    eoq: 'to the end of quarter',
    moy: 'to the middle of year',
    eoy: 'to the end of year',
  }

  private sentValueToOutside!: Maybe<NoticePeriodValue>

  @Watch('value', { immediate: true })
  onValueChanges(val: Maybe<NoticePeriodValue>) {
    // parse initialized value into selected option. DB contains just the language codes!
    if (val !== this.sentValueToOutside) {
      if (val) {
        // we got some value via v-model. parse it and fill values
        this.amountValue = val.amount ? val.amount : null
        this.unitValue = val.unit ? val.unit : 'd'
        this.toValue = val.to ? val.to : 'eom'
      } else {
        this.amountValue = null
        this.unitValue = 'd'
        this.toValue = 'eom'
      }
      this.sentValueToOutside = val
    }
  }

  @Watch('amountValue')
  onAmountChanges() {
    this.handleInput()
  }

  @Watch('unitValue')
  onUnitChanges() {
    this.handleInput()
  }

  @Watch('toValue')
  onToChanges() {
    this.handleInput()
  }

  handleInput() {
    let newValue: Maybe<NoticePeriodValue>
    if (!this.amountValue) {
      newValue = null
    } else {
      newValue = {
        amount: parseInt(this.amountValue as string),
        unit: this.unitValue,
        to: this.toValue,
      }
    }
    this.sentValueToOutside = newValue
    this.$emit('input', newValue)
  }
}
</script>
