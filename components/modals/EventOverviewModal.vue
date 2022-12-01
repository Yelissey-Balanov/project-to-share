<template>
  <client-only>
    <SweetModal ref="modal" title="Event details">
      {{event}}
    </SweetModal>
  </client-only>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { GetEventForOverviewModalQuery, GetEventForOverviewModalQueryVariables, Maybe } from '~/graphql/GQLTypes'
import GetEventForOverviewModal from '~/graphql/ressources/events/GetEventForOverviewModal.gql'

@Component
export default class EventOverviewModal extends Vue {
  $refs!: {
    modal: any
  }

  event: Maybe<{}> = null
  isLoading = false

  open() {
    this.$refs.modal.open()
  }

  close() {
    this.$refs.modal.close()
  }

  fetchAndOpen(eventId: number) {
    if (this.isLoading) {
      return
    }
    this.event = null
    this.isLoading = true

    this.$apollo
      .query<GetEventForOverviewModalQuery>({
        query: GetEventForOverviewModal,
        variables: {
          id: eventId,
        } as GetEventForOverviewModalQueryVariables,
      })
      .then((res) => {
        this.event = res.data.event!
        this.$refs.modal.open()
      })
      .finally(() => {
        this.isLoading = false
      })
  }
}
</script>

<style lang="scss" scoped></style>
