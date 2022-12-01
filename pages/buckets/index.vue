<template>
  <div class="container pt-5">
    <PageHeader item-title="My Buckets" item-link-path="buckets" item-type="bucket" :available-buttons="['create']">
    </PageHeader>

    <div v-if="buckets.length === 0">
      You didn't create any buckets yet. Would you like to <nuxt-link to="/buckets/new/form">create one</nuxt-link>?
    </div>
    <TableWithSelectableColumns v-else :items="buckets" :is-pagination-on-frontend="true">
      <template v-slot:table-headers>
        <td class="px-6 py-3.5">Bucket title</td>
        <td class="px-6 py-3.5">Notes</td>
        <td class="px-6 py-3.5">Shared with</td>
      </template>
      <template v-slot:table-data="{ item }">
        <td class="px-6 py-3.5">
          <nuxt-link :to="'/buckets/' + item.id">
            {{ item.title }}
          </nuxt-link>
        </td>
        <td class="px-6 py-3.5">
          {{ item.notes }}
        </td>
        <td class="px-6 py-3.5">
          <ul class="space-y-2">
            <li v-for="user in item.shared_with" :key="user.id">
              <nuxt-link :to="`/users/${user.id}`">
                {{ user.firstname }} {{ user.lastname }} -
                {{ user.bucket_user_permission.is_write_allowed ? 'Write allowed' : ' Read only' }}
              </nuxt-link>
            </li>
          </ul>
        </td>
      </template>
    </TableWithSelectableColumns>
    <h2 class="mt-10 mb-4">Buckets shared with me</h2>
    <div v-if="sharedBuckets.length === 0">
      No one shared any bucket with you yet. Go and ask your co-workers, why they don't want to share their buckets with
      you.
    </div>
    <TableWithSelectableColumns v-else :items="sharedBuckets" :is-pagination-on-frontend="true">
      <template v-slot:table-headers>
        <td class="px-6 py-3.5">Bucket title</td>
        <td class="px-6 py-3.5">Notes</td>
        <th class="px-6 py-3.5 w-[143px]">Permission</th>
        <td class="px-6 py-3.5">Owner</td>
      </template>
      <template v-slot:table-data="{ item }">
        <td class="px-6 py-3.5">
          <nuxt-link :to="'/buckets/' + item.id">
            {{ item.title }}
          </nuxt-link>
        </td>
        <td class="px-6 py-3.5">
          {{ item.notes }}
        </td>
        <td class="px-6 py-3.5">
          {{ item.bucket_user_permission.is_write_allowed ? 'Write allowed' : 'Read only' }}
        </td>
        <td class="px-6 py-3.5">
          <nuxt-link :to="`/users/${item.owner.id}`"> {{ item.owner.firstname }} {{ item.owner.lastname }} </nuxt-link>
        </td>
      </template>
    </TableWithSelectableColumns>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GetBuckets from '@/graphql/ressources/buckets/GetBuckets.gql'
import DataTablePagination from '@/components/admin/DataTablePagination.vue'
import { GetBucketsQuery, UserRole } from '~/graphql/GQLTypes'
import PageHeader from '~/components/pages/PageHeader.vue'

import TableWithSelectableColumns from '~/components/pages/TableWithSelectableColumns.vue'

@Component({
  components: { TableWithSelectableColumns, PageHeader, DataTablePagination },
  async asyncData({ app }) {
    const data: {
      buckets: NonNullable<GetBucketsQuery['me']>['buckets']
      sharedBuckets: NonNullable<GetBucketsQuery['me']>['shared_buckets']
    } = {
      buckets: [],
      sharedBuckets: [],
    }

    try {
      const res = await app.apolloProvider!.defaultClient.query<GetBucketsQuery>({
        query: GetBuckets,
      })
      data.buckets = res.data.me!.buckets
      data.sharedBuckets = res.data.me!.shared_buckets
    } catch (e) {
      console.error(e)
    }

    return data
  },
  head() {
    return {
      title: 'Buckets overview',
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class Buckets extends Vue {
  buckets: NonNullable<GetBucketsQuery['me']>['buckets'] = []
  sharedBuckets: NonNullable<GetBucketsQuery['me']>['shared_buckets'] = []
}
</script>
