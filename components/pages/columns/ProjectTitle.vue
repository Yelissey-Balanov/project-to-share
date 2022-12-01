<template>
  <td class="px-6 py-3.5">
    <nuxt-link :to="`/projects/${data.id}`" class="flex items-center">
      <span class="round-badge round-badge--blue mr-2" v-if="data.is_permanent">P</span>
      <span class="round-badge round-badge--pink mr-2" v-if="data.is_interim">I</span>
      <span>
        {{ data.title }}
      </span>
      <span v-if="data.archived_at" class="tbadge ml-2"> ARCHIVED </span>
      <span class="tbadge tbadge--red ml-2" v-if="data.deleted_at">DELETED</span>
    </nuxt-link>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'

@Component({
  components: { IHUserFilled },
})
export default class ProjectTitle extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
