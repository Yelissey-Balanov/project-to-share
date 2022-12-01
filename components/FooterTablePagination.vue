<template>
  <div
    class="flex items-center justify-between px-4 py-3 text-xs"
    :class="{ 'border-t bg-gray-50 text-gray-500': !transparent, 'text-gray-600': transparent }"
  >
    <template v-if="pagination && pagination.total > 0">
      <span class="tracking-widest"
        >Showing {{ firstItemNumber }} to {{ lastItemNumber }} of {{ pagination.total }} results</span
      >
      <nav class="flex col-span-4">
        <ul class="inline-flex items-center space-x-1 font-semibold">
          <li v-for="page in paginateOptions">
            <span class="px-3 py-1.5" v-if="page === null"> ... </span>
            <span class="px-3 py-1.5 rounded-md text-white bg-blue-600" v-else-if="page === pagination.currentPage">
              {{ page }}
            </span>
            <button
              class="px-3 py-1.5 rounded-md hover:bg-blue-100 hover:ring-1 ring-blue-600"
              @click="$emit('pageChanged', page)"
              v-else
            >
              {{ page }}
            </button>
          </li>
        </ul>
      </nav>
    </template>
    <div class="flex-auto text-center tracking-widest text-gray-800" v-else-if="pagination && pagination.total === 0">
      No results found
    </div>
    <div class="flex-auto text-center tracking-widest" v-else>Loading...</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { PaginatorFragment } from '@/graphql/GQLTypes'

@Component
export default class DataTablePagination extends Vue {
  @Prop()
  pagination?: PaginatorFragment
  @Prop({ default: false })
  transparent!: Boolean

  get firstItemNumber() {
    if (!this.pagination) {
      return
    }
    return this.pagination.perPage * (this.pagination.currentPage - 1) + 1
  }

  get lastItemNumber() {
    if (!this.pagination) {
      return
    }
    return Math.min(this.pagination.total, this.firstItemNumber! + this.pagination.perPage - 1)
  }

  get paginateOptions() {
    const options: Array<number | null> = []
    if (!this.pagination) {
      return options
    }
    if (this.pagination.lastPage <= 7) {
      for (let i = 1; i <= this.pagination.lastPage; i++) {
        options.push(i)
      }
    } else {
      options.push(1)
      if (this.pagination.currentPage > 4) {
        options.push(null)
      }
      for (let i = this.pagination.currentPage - 2; i <= this.pagination.currentPage + 2; i++) {
        if (i <= 1 || i >= this.pagination.lastPage) {
          continue
        }
        options.push(i)
      }
      if (this.pagination.currentPage < this.pagination.lastPage - 3) {
        options.push(null)
      }
      options.push(this.pagination.lastPage)
    }
    return options
  }
}
</script>
