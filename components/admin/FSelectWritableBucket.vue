<template>
  <ValidationProvider
    :rules="rules"
    :name="errorLabelComputed"
    v-slot="{ errors, classes, valid, touched }"
    tag="div"
    ref="validationProvider"
    slim
  >
    <div class="f-specified-multiselect is-single" :class="{ ...classes }">
      <label v-if="!!label" :class="{ 'is-floating': value || isOpened }">{{ label }}</label>
      <multiselect
        :value="value"
        @input="handleInput"
        tag-placeholder="Add new bucket"
        placeholder=""
        :options="writableBuckets"
        :multiple="false"
        :taggable="!isLoading"
        tagPosition="bottom"
        openDirection="bottom"
        track-by="id"
        :custom-label="customLabelForMultiselect"
        :loading="isLoading"
        :closeOnSelect="true"
        @tag="addBucket"
        @open="isOpened = true"
        @close="isOpened = false"
        :id="id"
      >
      </multiselect>
      <div class="input-error" v-if="!valid && touched">{{ errors[0] }}</div>
    </div>
  </ValidationProvider>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { State } from 'vuex-class'
import generateFormFieldId from '~/helpers/generateFormFieldId'
import { WritableBucket } from '~/store'
import { ValidationProvider } from 'vee-validate'
import { Maybe } from '~/graphql/GQLTypes'

@Component({
  components: { ValidationProvider },
})
export default class FSelectWritableBucket extends Vue {
  @Prop()
  rules?: any
  @Prop()
  errorLabel?: string
  @Prop()
  value?: any
  @Prop()
  label?: string

  @State((state) => state.bucket.writableBuckets)
  writableBuckets!: WritableBucket[]

  isLoading = false
  isOpened = false
  id = ''

  get errorLabelComputed() {
    return this.errorLabel || this.label
  }

  customLabelForMultiselect(bucket: WritableBucket) {
    return bucket.title + (bucket.ownerName ? ' ' + `(${bucket.ownerName})` : '')
  }

  mounted() {
    this.id = generateFormFieldId(this.label)
    // fetch documentTags from graphql when component is mounted
    if (this.writableBuckets.length === 0) {
      this.isLoading = true
      this.$store.dispatch('bucket/fetchBuckets').then(() => {
        this.isLoading = false
      })
    }
  }

  handleInput(e) {
    this.$emit('input', e)
    this.$store.commit('bucket/setLastSelectedBucket', e)
  }

  addBucket(value) {
    this.isLoading = true
    this.$store
      .dispatch('bucket/createMyBucket', {
        title: value,
      })
      .then((documentTag) => {
        this.isLoading = false
        if (documentTag) {
          this.value.push(documentTag)
        }
      })
      .catch((err) => {
        this.isLoading = false
        console.error(err)
      })
  }
}
</script>
