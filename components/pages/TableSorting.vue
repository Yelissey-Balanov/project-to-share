<template>
  <button
    :disabled="!data.sorting"
    class="flex items-center space-x-1 text-xs font-semibold tracking-widest text-slate-500 uppercase"
    :class="[!hasFilters && 'pt-2']"
    @click="changeSorting"
  >
    <div :class="options.includes(value) && 'text-black'">{{ data.title }}</div>
    <div v-if="data.sorting" class="flex items-center">
      <IHSwitch :class="value == options[0] && 'text-black'" class="w-2 h-4"></IHSwitch>
      <IHSwitch :class="value == options[1] && 'text-black'" class="w-2 h-4 rotate-180"></IHSwitch>
    </div>
  </button>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import IHSwitch from '~/components/globals/icons/heroicons/IHSwitch.vue'
import {Maybe, SortOrder} from '~/graphql/GQLTypes'
import {NoticePeriodValue} from "~/helpers/types";

@Component({
  components: {
    IHSwitch,
    LabeledValue,
  },
})
export default class TableSorting extends Vue {
  @Prop({ default: () => {} })
  data!: any
  @Prop()
  hasFilters!: boolean
  @Prop()
  sortingForm!: any

  options = [SortOrder.Asc, SortOrder.Desc]

  value: any = null
  count = 0

  @Watch('sortingForm', { deep: true })
  onSortingFormChanges(value) {
    this.value = value[this.data.title]
  }

  changeSorting() {
    if (true) {
      this.value = this.options[this.count]
      if (this.count == this.options.length - 1) {
        this.count = 0
      } else {
        this.count++
      }
      this.$emit('change-sorting', this.value)
    }
  }
}
</script>
