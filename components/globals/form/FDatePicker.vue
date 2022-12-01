<template>
  <ValidationProvider
    :rules="rules"
    :name="errorLabelComputed"
    :vid="id"
    v-slot="{ errors, classes, valid, touched }"
    tag="div"
    ref="validationProvider"
    slim
  >
    <div class="flex items-center space-x-2 w-full">
      <button v-if="hasArrows" class="tbtn-icon tbtn-icon--small tbtn--white" @click="moveToDate(-1)">
        <IHChevronLeft class="w-5 h-5" />
      </button>
      <div class="f-date-picker w-full" :class="{ 'is-disabled': disabled, ...classes }">
        <client-only>
          <v-date-picker
            v-model="innerValue"
            :popover="{ visibility: 'focus' }"
            :class="{ filled: !!innerValue }"
            :inputDebounce="400"
            :mode="mode"
            :is-range="isRange"
            :is24hr="true"
            @input="handleInput"
            @popoverWillShow="isInputFocused = true"
            @popoverWillHide="isInputFocused = false"
          >
            <template v-slot="{ inputValue, inputEvents }">
              <template v-if="!isRange">
                <input
                  ref="input"
                  :class="{ filled: !!innerValue }"
                  :id="id"
                  :value="inputValue"
                  v-on="inputEvents"
                  type="text"
                  :disabled="disabled"
                  @blur="handleBlur"
                  @keydown="handleKeydown"
                  class="w-full"
                />
              </template>
              <template v-else>
                <div class="flex items-center space-x-2">
                  <input
                    :value="inputValue.start"
                    v-on="inputEvents.start"
                    @blur="handleBlur"
                    @keydown="handleKeydown"
                    :disabled="disabled"
                    class="w-24"
                  />
                  <span>-</span>
                  <input
                    :value="inputValue.end"
                    v-on="inputEvents.end"
                    @blur="handleBlur"
                    @keydown="handleKeydown"
                    :disabled="disabled"
                    class="w-24"
                  />
                </div>
              </template>
            </template>
          </v-date-picker>
        </client-only>
        <label :for="id" v-if="!!label" :class="{ 'is-floating': isInputFocused || !!innerValue }">{{ label }}</label>
        <div class="input-error" v-if="!valid && touched">{{ errors[0] }}</div>
      </div>
      <button v-if="hasArrows" class="tbtn-icon tbtn-icon--small tbtn--white" @click="moveToDate(1)">
        <IHChevronLeft class="w-5 h-5 rotate-180" />
      </button>
    </div>
  </ValidationProvider>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'
import { Maybe } from '@/graphql/GQLTypes'
import generateFormFieldId from '~/helpers/generateFormFieldId'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'

@Component({
  components: { IHChevronLeft, ValidationProvider },
})
export default class FDatePicker extends Vue {
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
  @Prop({ default: 'date' })
  mode!: string
  @Prop({ default: false })
  isRange!: boolean
  @Prop({ default: false })
  disabled?: boolean
  @Prop({ default: false })
  hasArrows?: boolean

  innerValue: Maybe<Date | [Date] | Object> = null
  id = ''
  isInputFocused = false

  private sentValueToOutside!: Maybe<Date | [Date] | Object>

  @Watch('value', { immediate: true })
  onValueChanges(val) {
    // parse initialized value into selected option. DB contains just the language codes!
    if (val !== this.sentValueToOutside) {
      if (val) {
        this.innerValue = val
      } else {
        this.innerValue = null
      }
      this.sentValueToOutside = this.innerValue
    }
  }

  get errorLabelComputed() {
    return this.errorLabel || this.label
  }

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  moveToDate(days) {
    let result = new Date(this.value)
    result.setDate(result.getDate() + days)
    this.$emit('input', result)
  }

  handleInput(e: Maybe<{ start: Maybe<Date>; end: Maybe<Date> }>) {
    if (e === null) {
      e = { start: null, end: null }
    }
    this.sentValueToOutside = e
    this.$emit('input', this.sentValueToOutside)
  }

  handleBlur() {
    if (this.$refs.validationProvider) {
      this.$refs.validationProvider.setFlags({
        touched: true,
        untouched: false,
      })
    }
  }

  handleKeydown(e: KeyboardEvent) {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }
}
</script>

<style scoped lang="scss">
.f-date-picker {
  @apply relative;
}

input {
  @apply py-2 px-3 w-full block h-[36px] leading-[18px] bg-white rounded-md shadow-sm border border-slate-200 outline-none duration-200 transition ease-linear;
}

label {
  @apply absolute block translate-y-0 top-[9px] left-3 pointer-events-none font-normal text-gray-500 duration-200 transition ease-linear origin-top-left max-w-full truncate;
}

span:focus-within {
  input {
    @apply border-slate-600;
  }
}

span:focus-within,
span.filled {
  ~ label {
    @apply text-gray-800;
    transform: translateY(-24px) scale(0.8);
  }
}

.f-date-picker.invalid.touched {
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

.f-date-picker.is-disabled {
  @apply opacity-40;
}
</style>
