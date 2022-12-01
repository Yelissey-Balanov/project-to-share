<template>
  <div class="f-specified-multiselect" :class="{ 'is-disabled': disabled }">
    <label v-if="!!label" :class="{ 'is-floating': value || isOpened }">{{ label }}</label>
    <multiselect
      :value="value"
      @input="handleInput"
      placeholder=""
      :options="optionsComputed"
      :multiple="false"
      :taggable="!isLoading"
      tagPosition="bottom"
      openDirection="bottom"
      track-by="id"
      label="title"
      :loading="isLoading"
      :closeOnSelect="true"
      @open="isOpened = true"
      @close="isOpened = false"
      :showLabels="false"
      :disabled="disabled"
      :id="id"
    >
      <template v-slot:singleLabel="{ option }">
        <span v-html="option && option.id ? option.title : optionsComputed.find((el) => el.id == option)?.title" />
      </template>
    </multiselect>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component
export default class FSelectItSimple extends Vue {
  @Prop()
  value?: any
  @Prop()
  label?: string
  @Prop({ default: false })
  isSingle!: boolean
  @Prop({ default: false })
  disabled!: boolean
  @Prop()
  options?: { [key: string]: string }

  isLoading = false
  isOpened = false
  id = ''

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  get optionsComputed() {
    if (this.options) {
      const array = Object.entries(this.options).map((el) => {
        return { id: el[0], title: el[1] }
      })
      return array || []
    } else return []
  }

  handleInput(e) {
    if (e && e.id) {
      this.$emit('input', e.id)
    } else {
      this.$emit('input', e)
    }
  }
}
</script>

<style lang="scss"></style>

<!--<template>-->
<!--  <ValidationProvider-->
<!--    :rules="rules"-->
<!--    :name="errorLabelComputed"-->
<!--    :vid="id"-->
<!--    v-slot="{ errors, classes, valid, touched }"-->
<!--    tag="div"-->
<!--    ref="validationProvider"-->
<!--    slim-->
<!--    class="relative"-->
<!--  >-->
<!--    <div class="f-select-simple" :class="{ 'is-disabled': disabled, ...classes }">-->
<!--      <select-->
<!--        @change="handleInput"-->
<!--        @blur="handleBlur"-->
<!--        :disabled="disabled"-->
<!--        :class="{ filled: !!value || value === 0 }"-->
<!--        :id="id"-->
<!--        :value="value"-->
<!--      >-->
<!--&lt;!&ndash;        <option :value="null" :selected="!value" v-if="nullable">&ndash;&gt;-->
<!--&lt;!&ndash;          {{ nullableLabel }}&ndash;&gt;-->
<!--&lt;!&ndash;        </option>&ndash;&gt;-->
<!--        <option v-for="(optTitle, optValue) in options" :value="optValue">-->
<!--          {{ optTitle }}-->
<!--        </option>-->
<!--      </select>-->
<!--      <label :for="id" v-if="!!label">{{ label }}</label>-->
<!--      <div class="input-error" v-if="!valid && touched">{{ errors[0] }}</div>-->
<!--    </div>-->
<!--  </ValidationProvider>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import { Component, Prop, Watch } from 'vue-property-decorator'-->
<!--import Vue from 'vue'-->
<!--import { ValidationProvider } from 'vee-validate'-->
<!--import generateFormFieldId from '~/helpers/generateFormFieldId'-->

<!--@Component({-->
<!--  components: { ValidationProvider },-->
<!--})-->
<!--export default class FSelectSimple extends Vue {-->
<!--  $refs!: {-->
<!--    validationProvider: InstanceType<typeof ValidationProvider>-->
<!--  }-->
<!--  @Prop()-->
<!--  rules?: any-->
<!--  @Prop()-->
<!--  errorLabel?: string-->
<!--  @Prop()-->
<!--  value?: any-->
<!--  @Prop()-->
<!--  label?: any-->
<!--  @Prop({ default: true })-->
<!--  nullable?: boolean-->
<!--  @Prop({ default: '-&#45;&#45; Not set -&#45;&#45;' })-->
<!--  nullableLabel?: string-->
<!--  @Prop()-->
<!--  options?: { [key: string]: string }-->
<!--  @Prop({ default: false })-->
<!--  disabled?: boolean-->

<!--  id = ''-->

<!--  get errorLabelComputed() {-->
<!--    return this.errorLabel || this.label-->
<!--  }-->

<!--  mounted() {-->
<!--    this.id = generateFormFieldId(this.label)-->
<!--  }-->

<!--  handleInput(e) {-->
<!--    const newValue = e.target.value ? e.target.value : null-->
<!--    this.$emit('input', newValue)-->
<!--  }-->

<!--  handleBlur() {-->
<!--    if (this.$refs.validationProvider) {-->
<!--      this.$refs.validationProvider.setFlags({-->
<!--        touched: true,-->
<!--        untouched: false,-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--.f-select-simple {-->
<!--  @apply relative;-->
<!--}-->

<!--select {-->
<!--  @apply p-2 pt-1.5 h-[36px] leading-[18px] w-full block bg-white rounded-md shadow-sm border border-slate-200 outline-none duration-200 transition ease-linear;-->
<!--}-->

<!--label {-->
<!--  @apply absolute block translate-y-0 top-[9px] left-2 pointer-events-none font-normal text-gray-500 duration-200 transition ease-linear origin-top-left max-w-full truncate;-->
<!--}-->

<!--select:focus {-->
<!--  @apply border-gray-900;-->
<!--  ~ label {-->
<!--    @apply text-gray-900;-->
<!--  }-->
<!--}-->

<!--select:focus,-->
<!--select.filled {-->
<!--  @apply border-slate-600;-->
<!--  ~ label {-->
<!--    @apply text-gray-800;-->
<!--    transform: translateY(-24px) scale(0.8);-->
<!--  }-->
<!--}-->

<!--.f-select-simple.invalid.touched {-->
<!--  label {-->
<!--    @apply text-red-700;-->
<!--  }-->

<!--  select {-->
<!--    @apply border-red-500;-->

<!--    &:focus {-->
<!--      @apply border-red-700;-->
<!--    }-->
<!--  }-->
<!--}-->

<!--.f-select-simple.is-disabled {-->
<!--  @apply opacity-40;-->
<!--}-->
<!--</style>-->
