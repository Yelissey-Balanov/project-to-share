<template>
  <td class="px-6 py-3.5">
    <a :href="'mailto:' + data.email" v-if="data.email">{{ data.email }}</a>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class Email extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
