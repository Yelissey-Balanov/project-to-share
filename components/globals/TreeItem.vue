<template>
  <li :class="{ 'is-child': !isRootLevel }" class="cursor-pointer">
    <div class="item" @click="toggle">
      <span v-if="hasChildren">[{{ isOpen ? '-' : '+' }}]</span>
      {{ item.title }}
    </div>
    <ul v-show="isOpen" v-if="hasChildren">
      <TreeItem v-for="(child, index) in item.children" :key="index" :item="child" :isRootLevel="false" />
    </ul>
  </li>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { Prop } from '~/node_modules/vue-property-decorator'

export interface TreeElement {
  title: string
  children?: TreeElement[]
}

@Component
export default class TreeItem extends Vue {
  @Prop()
  item!: TreeElement

  @Prop({ default: true })
  isRootLevel!: boolean

  isOpen = false

  get hasChildren() {
    return this.item.children && this.item.children.length
  }

  toggle() {
    this.isOpen = !this.isOpen
  }
}

/**
 * USAGE:
 *
 <ul>
   <TreeItem
     v-for="(item, index) in items"
     :key="index"
     :item="item"
   />
 </ul>


 items: TreeElement[] = [
 { title: 'hello' },
 { title: 'wat' },
 {
      title: 'child folder',
      children: [
        {
          title: 'child folder',
          children: [{ title: 'hello' }, { title: 'wat' }]
        },
        { title: 'hello' },
        { title: 'wat' },
        {
          title: 'child folder',
          children: [{ title: 'hello' }, { title: 'wat' }]
        }
      ]
    }
 ];

 */
</script>

<style scoped lang="scss">
@import '../../assets/scss/variables';

.item {
  list-style: none;
  position: relative;
  border-bottom: 1px solid $color-gray;
}

.item {
  cursor: pointer;
}

.bold {
  font-weight: bold;
}

ul {
  padding-left: 2em;
}
</style>
