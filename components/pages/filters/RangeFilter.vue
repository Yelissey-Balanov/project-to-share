<template>
  <div class="grid grid-cols-2 gap-2 items-center w-full">
    <FInput class="w-full" v-model="form.min" @input="changeFilter" />
    <FInput class="w-full" v-model="form.max" @input="changeFilter" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class RangeFilter extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop()
  filterForm!: any

  form = {
    min: null,
    max: null,
  }

  @Watch('filterForm', { deep: true })
  onFilterFormChanges(value) {
    this.form = Object.assign({}, value[this.data.title])
  }

  changeFilter() {
    this.$emit('change-filter', this.form)
  }
}
</script>
