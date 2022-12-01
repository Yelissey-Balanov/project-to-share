<template>
  <table class="w-full">
    <tbody class="divide-y">
      <tr v-for="unit in units">
        <td class="px-4 py-2 text-center">
          {{ unit.date | date }}
          <div class="text-gray-500" v-if="unit.hours">{{ unit.hours }} hours</div>
        </td>
        <td class="pr-4 py-2 w-full">{{ unit.note }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { WorkingHoursFragment } from '~/graphql/GQLTypes'

@Component({
  components: {},
})
export default class WorkingHoursUnitsNotesTable extends Vue {
  @Prop({ required: true })
  units!: WorkingHoursFragment['units']
}
</script>
