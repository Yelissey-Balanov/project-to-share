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
    <div class="f-textarea" :class="classes">
      <textarea
        :class="{ filled: !!value }"
        :id="id"
        @input="handleInput"
        @blur="handleBlur"
        :value.prop="value"
        :rows="rows"
        ref="textarea"
      ></textarea>
      <label :for="id" v-if="!!label">{{ label }}</label>
      <div class="input-error" v-if="!valid && touched">{{ errors[0] }}</div>
    </div>
  </ValidationProvider>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component({
  components: { ValidationProvider },
})
export default class FTextarea extends Vue {
  $refs!: {
    textarea: HTMLTextAreaElement
    validationProvider: InstanceType<typeof ValidationProvider>
  }

  @Prop()
  rules?: any
  @Prop()
  errorLabel?: string
  @Prop()
  value?: any
  @Prop()
  label?: any
  @Prop({ default: 8 })
  rows!: number

  id = ''

  get errorLabelComputed() {
    return this.errorLabel || this.label
  }

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  handleInput(e) {
    let newVal = e.target.value
    if (!newVal.trim()) {
      newVal = null
    }
    this.$emit('input', newVal)
  }

  focus() {
    if (this.$refs.textarea) {
      this.$refs.textarea.focus()
    }
  }

  handleBlur() {
    this.$refs.validationProvider.setFlags({
      touched: true,
      untouched: false,
    })
  }
}
</script>

<style scoped lang="scss">
.f-textarea {
  @apply relative;
}

textarea {
  @apply py-2 px-3 w-full block bg-white rounded-md shadow-sm border border-slate-200 outline-none duration-200 transition ease-linear;
}

label {
  @apply absolute block translate-y-0 top-[9px] left-3 pointer-events-none font-normal text-gray-500 duration-200 transition ease-linear origin-top-left max-w-full truncate;
}

textarea:focus {
  @apply border-slate-600;
}

textarea:focus,
textarea.filled {
  ~ label {
    @apply text-gray-800;
    transform: translateY(-24px) scale(0.8);
  }
}

.f-textarea.invalid.touched {
  label {
    @apply text-red-700;
  }

  textarea {
    @apply border-red-500;

    &:focus {
      @apply border-red-700;
    }
  }
}

.f-textarea.is-disabled {
  @apply opacity-40;
}
</style>
