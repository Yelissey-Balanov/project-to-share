<template>
  <div class="data-table-pagination" v-if="pagination">
    <button
      class="btn gray"
      @click="$emit('pageChanged', pagination.currentPage - 1)"
      :disabled="pagination.currentPage === 1"
      :style="{ opacity: pagination.currentPage === 1 ? 0 : 1 }"
    >
      &lt;
    </button>

    <span>Page {{ pagination.currentPage }} of {{ pagination.lastPage }} | Total found: {{ pagination.total }}</span>

    <button
      class="btn gray"
      @click="$emit('pageChanged', pagination.currentPage + 1)"
      :disabled="pagination.currentPage === pagination.lastPage"
      :style="{ opacity: pagination.currentPage === pagination.lastPage ? 0 : 1 }"
    >
      >
    </button>
  </div>
  <div class="data-table-pagination" v-else>
    <span style="margin: 0 auto">Loading...</span>
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
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/variables';

.data-table-pagination {
  margin: 1em 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 30px;
}

button {
  width: 30px;
  font-size: 19px;
  height: 30px;
  padding: 0;
  min-width: auto;
  line-height: 1;
  transition: opacity 0.25s ease;

  &:disabled {
    cursor: default;
  }
}
</style>
