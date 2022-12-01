<template>
  <td class="px-6 py-3.5">{{ data.user_id ? 'Yes' : 'No' }}</td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class HasStellaAccount extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
