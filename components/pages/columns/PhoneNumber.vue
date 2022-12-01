<template>
  <td class="px-6 py-3.5 space-y-1">
    <a
      class="whitespace-nowrap block"
      v-for="phonenumber in data.phonenumbers"
      :href="`tel:${phonenumber.dial_code || ''}${phonenumber.number}`"
    >
      {{ phonenumber.dial_code }} {{ phonenumber.number }}
    </a>
  </td>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {},
})
export default class PhoneNumber extends Vue {
  @Prop({ default: () => {} })
  data!: any
}
</script>
