<template>
  <form class="" @submit.prevent="onSearchSubmit">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <h1 class="my-2 capitalize">{{ itemTitle }}</h1>
      <slot name="search-form" class="flex space-x-4 w-1/2 items-center"></slot>
      <div class="whitespace-nowrap flex space-x-2">
        <button
          type="button"
          class="tbtn-icon tbtn--white"
          v-tooltip="{ content: 'Filters' }"
          @click="$emit('toggle-filters')"
          v-if="availableButtons.includes('filters')"
        >
          <IHAdjustments class="w-6 h-6" />
        </button>
        <nuxt-link
          :to="`/${itemLinkPath || itemTitle}/new/form`"
          v-tooltip="{ content: `New ${itemType}` }"
          class="tbtn-icon tbtn--blue"
          v-if="availableButtons.includes('create')"
        >
          <IHPlus class="w-6 h-6" />
        </nuxt-link>
      </div>
    </div>

    <SlideUpDown class="ease-in-out" :active="areFiltersExpanded" :duration="350">
      <slot name="slide-filters"></slot>

      <div class="flex justify-end space-x-2 pb-6 pt-4">
        <button class="tbtn tbtn--white" type="button" @click="clearFilters">Clear filters</button>
        <button class="tbtn tbtn--green" type="submit">Apply filters</button>
      </div>
    </SlideUpDown>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import SlideUpDown from 'vue-slide-up-down'
import IHPlus from '~/components/globals/icons/heroicons/IHPlus.vue'
import IHAdjustments from '~/components/globals/icons/heroicons/IHAdjustments.vue'
import IHCollection from '~/components/globals/icons/heroicons/IHCollection.vue'
import IHX from '~/components/globals/icons/heroicons/IHX.vue'
import IHCheck from '~/components/globals/icons/heroicons/IHCheck.vue'
import { AddToBucketItemType } from '~/helpers/types'
import IHUserAdd from '~/components/globals/icons/heroicons/IHUserAdd.vue'

@Component({
  components: {
    IHUserAdd,
    IHCheck,
    IHX,
    IHCollection,
    IHAdjustments,
    IHPlus,
    SlideUpDown,
  },
})
export default class PageHeader extends Vue {
  @Prop()
  itemTitle!: string
  @Prop()
  itemLinkPath!: string
  @Prop()
  itemType!: AddToBucketItemType
  @Prop()
  areFiltersExpanded!: boolean
  @Prop({ default: () => ['create', 'filters'] })
  availableButtons!: Array<string>

  onSearchSubmit() {
    this.$emit('fetch')
  }

  clearFilters() {
    this.$emit('clear')
  }
}
</script>
