<template>
  <ValidationProvider
    :rules="rules"
    :name="errorLabelComputed"
    :vid="id"
    v-slot="{ errors, classes, valid, touched }"
    tag="div"
    ref="validationProvider"
    slim
    class="relative"
  >
    <div class="f-input" :class="{ 'is-disabled': disabled, ...classes }">
      <input
        ref="input"
        :class="{ filled: !!value || value === 0 || autofilled }"
        :id="id"
        @input="handleInput"
        @blur="handleBlur"
        :value="visibleValue"
        :type="type"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :disabled="disabled"
      />
      <label :for="id" v-if="!!label">{{ label }}</label>
      <div class="input-error" v-if="!valid && touched">{{ errors[0] }}</div>
    </div>
  </ValidationProvider>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'
import { Maybe } from '@/graphql/GQLTypes'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component({
  components: { ValidationProvider },
})
export default class FInput extends Vue {
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
  label?: string
  @Prop({ default: false })
  disabled?: boolean
  @Prop({ default: false })
  readonly?: boolean
  @Prop({ default: 'off' })
  autocomplete?: string
  @Prop({ default: 'text' })
  type?: string
  @Prop({ default: false })
  checkAutofilled?: boolean
  @Prop({ default: false })
  asInteger!: boolean
  @Prop({ default: false })
  asFloat!: boolean

  // TODO: determine if currency based on given rules ('currency' validator)
  @Prop({ default: false })
  asCurrency?: boolean
  @Prop({ default: '€' })
  currencySymbol!: string

  visibleValue: string = ''

  autofilled = false
  id = ''

  private sentValueToOutside!: Maybe<any>
  private checkAutofilledTimeout!: NodeJS.Timeout

  @Watch('value', { immediate: true })
  onValueChanges(val) {
    // parse initialized value into selected option. DB contains just the language codes!
    if (val !== this.sentValueToOutside) {
      if (val || val === 0) {
        // we got some value via v-model. parse it and fill visible value
        if (this.asCurrency) {
          this.visibleValue = this.formatValueToChunkedCurrency(val)
        } else {
          this.visibleValue = val
        }
      } else {
        this.visibleValue = ''
      }
      this.sentValueToOutside = val
    }
  }

  get errorLabelComputed() {
    return this.errorLabel || this.label
  }

  mounted() {
    this.id = generateFormFieldId(this.label)

    // handle situation, when fields are autofilled
    if (this.checkAutofilled) {
      this.checkAutofilledTimeout = setTimeout(() => {
        if (!this.$refs.input.value) {
          // For security reasons, we can't get an autofilled value from Chrome;
          // however, we can check the `:-webkit-autofill` selector and infer
          // `active` accordingly.
          //
          // Firefox will let you read an autofilled value, so we don't need to sweat
          // `:-moz-autofill`.

          // Must wrap these tests in a `try` because the browser will throw if it
          // doesn't recognize a selector
          try {
            this.autofilled = this.$refs.input.matches(':autofill')
          } catch (error) {
            try {
              this.autofilled = this.$refs.input.matches(':-webkit-autofill')
            } catch (error) {
              // simply ignore
            }
          }
          // if (this.autofilled) {
          // }
        }
      }, 800)
    }
  }

  handleInput(e) {
    this.autofilled = false
    this.visibleValue = e.target.value
    let cleanValue: Maybe<string | number> = this.visibleValue
    if (this.asCurrency) {
      const oldVisibleValueLength = Math.max(this.visibleValue.length, 6)
      cleanValue = parseFloat(this.visibleValue.replace(/[^\d,]/g, '').replace(/,+/g, '.'))
      cleanValue = !isNaN(cleanValue) ? cleanValue : null
      let caretPosition = this.$refs.input!.selectionStart ? Math.max(this.$refs.input!.selectionStart, 3) : 0
      this.visibleValue = this.formatValueToChunkedCurrency(cleanValue)
      this.$nextTick(() => {
        caretPosition += this.visibleValue.length - oldVisibleValueLength
        const commaPosition = this.visibleValue.indexOf(',')
        if (caretPosition > commaPosition) {
          caretPosition += 1
        }
        this.$refs.input!.setSelectionRange(caretPosition, caretPosition)
      })
    } else {
      if (!cleanValue.trim()) {
        cleanValue = null
        this.visibleValue = ''
      }
    }
    if (this.asInteger) {
      cleanValue = parseInt(cleanValue as string)
      if (isNaN(cleanValue)) {
        cleanValue = null
      }
    } else if (this.asFloat) {
      cleanValue = parseFloat((cleanValue as string).replace(',', '.'))
    }
    this.sentValueToOutside = cleanValue
    this.$emit('input', cleanValue)
  }

  focus() {
    if (this.$refs.input) {
      this.$refs.input.focus()
    }
  }

  handleBlur() {
    if (this.$refs.validationProvider) {
      this.$refs.validationProvider.setFlags({
        touched: true,
        untouched: false,
      })
    }
  }

  beforeDestroy() {
    clearTimeout(this.checkAutofilledTimeout)
  }

  private formatValueToChunkedCurrency(value: Maybe<number>) {
    if (value === null) {
      return ''
    }
    const splittedValue = value.toString().split('.')
    let decimal = '0'
    if (splittedValue[0]) {
      while (splittedValue[0].substr(0, 1) === '0') {
        splittedValue[0] = splittedValue[0].substr(1)
      }
      if (splittedValue[0].length === 0) {
        splittedValue[0] = '0'
      }
      decimal = splittedValue[0]
        .split('')
        .reverse()
        .join('')
        .match(/.{1,3}/g)!
        .map((s) => s.split('').reverse().join(''))
        .reverse()
        .join('.')
    }

    let commata = splittedValue[1] ? splittedValue[1].substr(0, 2) : '00'
    for (let i = commata.length; i < 2; i++) {
      commata += '0'
    }
    return `${this.currencySymbol} ${decimal},${commata}`
  }
}
</script>

<style scoped lang="scss">
.f-input {
  @apply relative;
}

input {
  @apply py-2 px-3 h-[36px] leading-[18px] w-full block bg-white rounded-md shadow-sm border border-slate-200 outline-none duration-200 transition ease-linear;
}

label {
  @apply absolute block translate-y-0 top-[9px] left-3 pointer-events-none font-normal text-gray-500 duration-200 transition ease-linear origin-top-left max-w-full truncate;
}

input:focus {
  @apply border-slate-600;
}

input:focus,
input.filled {
  ~ label {
    @apply text-gray-800;
    transform: translateY(-24px) scale(0.8);
  }
}

.f-input.invalid.touched {
  label {
    @apply text-red-700;
  }

  input {
    @apply border-red-500;

    &:focus {
      @apply border-red-700;
    }
  }
}

.f-input.is-disabled {
  @apply opacity-40;
}
</style>
