<template>
  <ValidationProvider
    :rules="rules"
    :name="errorLabelComputed"
    :vid="id"
    v-slot="{ errors, classes, valid, touched, validated }"
    tag="div"
    ref="validationProvider"
    slim
  >
    <div class="f-checkbox" :class="{ 'is-disabled': disabled, 'with-label': label, ...classes }">
      <div class="f-checkbox--inner-wrapper">
        <input
          ref="input"
          type="checkbox"
          :id="id"
          @input="handleInput"
          @blur="handleBlur"
          :checked="value"
          :disabled="disabled"
        />
        <label :for="id">{{ label }}</label>
        <div>
          <slot></slot>
        </div>
      </div>
      <div class="input-error" v-if="validated && !valid && touched">{{ errors[0] }}</div>
    </div>
  </ValidationProvider>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component({
  components: { ValidationProvider },
})
export default class FCheckbox extends Vue {
  $refs!: {
    validationProvider: InstanceType<typeof ValidationProvider>
    input: HTMLInputElement
  }

  @Prop()
  rules?: any
  @Prop()
  errorLabel?: string
  @Prop()
  value?: any
  @Prop()
  additionalValue?: any
  @Prop()
  label?: string
  @Prop({ default: false })
  disabled?: boolean

  id = ''

  get errorLabelComputed() {
    return this.errorLabel || this.label
  }

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  handleInput(e) {
    const value = e.target.checked
    this.$refs.validationProvider.validate(value)
    this.$emit('input', value, this.additionalValue)
  }

  handleBlur() {
    if (this.$refs.validationProvider) {
      this.$refs.validationProvider.setFlags({
        touched: true,
        untouched: false,
      })
    }
  }
}
</script>

<style lang="scss">
.f-checkbox {
  @apply relative;

  .f-checkbox--inner-wrapper {
    @apply flex items-center;
  }

  label {
    @apply relative text-gray-800 cursor-pointer touch-manipulation flex items-start leading-6;
    content: '';

    &:before {
      @apply relative rounded-md shadow-sm inline-block self-start flex-none left-0 top-0 h-6 w-6 mr-1.5 bg-white border border-slate-200 transition ease-linear duration-150;
      content: '';
    }

    &:after {
      @apply absolute scale-0 opacity-0 transition ease-linear duration-150 left-1 top-1 w-4 h-4;
      content: '';
      background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHBhdGggc3R5bGU9ImZpbGw6ICNmZmY7IiBkPSJNNTguNjQsOS45MzdsLTMuNS0zLjQwOUwyMi4wMTQsMzkuNzQ1bC0xMS44LTExLjVMMCwzNS41NTcsMTMuMjgyLDQ4LjVsNS41LDUuMzY0Ljg2LjgzOGE0LjEwOSw0LjEwOSwwLDAsMCwyLjIxNy44MnEuMTIuMDA2LjI0LjAwNmE0LjEyLDQuMTIsMCwwLDAsMi40Ny0uODM5bDYuMy02LjMxM0w2NCwxNS4xNTlaIj48L3BhdGg+PC9zdmc+)
        no-repeat center;
    }
  }
  input {
    @apply opacity-0 absolute;

    &:focus + label::before {
      @apply border-slate-600;
    }
    &:hover + label::before {
      @apply border-slate-600;
    }

    &:checked + label::before {
      @apply border-transparent bg-blue-600;
    }

    &:checked + label::after {
      @apply scale-100 text-blue-600 opacity-100;
    }
  }
}

.f-checkbox.invalid.touched {
  label {
    @apply text-red-700;

    &::before {
      @apply border-transparent bg-red-100;
    }
  }
}

.f-checkbox.is-disabled {
  @apply opacity-40 pointer-events-none;
}
</style>
