<template>
  <div class="alert alert-info" v-if="mayAccess">
    This {{ modelTypeAsText }} has no stella account yet.

    <template v-if="isSubmitting"> Creating invite link...</template>
    <template v-else>
      <template v-if="internalModel.create_account_token">
        Send <a :href="inviteLink" target="_blank">this link</a> to the {{ modelTypeAsText }}.
        <button class="hover:underline" type="button" @click="copyInviteLink">[copy link]</button>
      </template>
      <template v-else>
        You may
        <button class="hover:underline" type="button" @click="createInviteLink"> create an invite link </button>
        though.
      </template>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import {
  Candidate,
  Client,
  GenerateCandidateAccountCreationTokenMutation,
  GenerateCandidateAccountCreationTokenMutationVariables,
  GenerateClientAccountCreationTokenMutation,
  GenerateClientAccountCreationTokenMutationVariables,
  Maybe,
} from '~/graphql/GQLTypes'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import { ValidationObserver } from 'vee-validate'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { namespace } from 'nuxt-property-decorator'
import GenerateCandidateAccountCreationToken from '~/graphql/ressources/candidates/GenerateCandidateAccountCreationToken.gql'
import GenerateClientAccountCreationToken from '~/graphql/ressources/clients/GenerateClientAccountCreationToken.gql'
import copyToClipboard from '~/helpers/copyToClipboard'

type InviteToCreateAccountData =
  | Pick<Candidate, '__typename' | 'id' | 'user_id' | 'create_account_token'>
  | Pick<Client, '__typename' | 'id' | 'user_id' | 'create_account_token'>

@Component({
  components: { LabeledValue, ValidationObserver },
})
export default class InviteCandidateOrClientToCreateAccount extends Vue {
  @Prop()
  model!: Maybe<InviteToCreateAccountData>

  internalModel: Maybe<InviteToCreateAccountData> = null
  isSubmitting = false

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  created() {
    this.internalModel = this.model
  }

  get modelTypeAsText() {
    if (!this.model) {
      return ''
    }
    return this.model.__typename!.toLowerCase()
  }

  get mayAccess() {
    return this.isEmployee && this.internalModel && !this.internalModel.user_id
  }

  get inviteLink() {
    if (!this.internalModel) {
      return ''
    }
    return (
      this.$config.baseClientUrl + `/create-account/${this.internalModel.id}/${this.internalModel.create_account_token}`
    )
  }

  copyInviteLink() {
    copyToClipboard(this.inviteLink)
  }

  async createInviteLink() {
    if (this.isSubmitting || !this.internalModel || this.internalModel.create_account_token) {
      return
    }

    this.isSubmitting = true
    try {
      if (this.internalModel.__typename === 'Candidate') {
        const response = await this.$apollo.mutate<GenerateCandidateAccountCreationTokenMutation>({
          mutation: GenerateCandidateAccountCreationToken,
          variables: {
            candidate_id: this.internalModel!.id,
          } as GenerateCandidateAccountCreationTokenMutationVariables,
        })

        this.internalModel = response.data!.generateCandidateAccountCreationToken!
      } else {
        const response = await this.$apollo.mutate<GenerateClientAccountCreationTokenMutation>({
          mutation: GenerateClientAccountCreationToken,
          variables: {
            client_id: this.internalModel!.id,
          } as GenerateClientAccountCreationTokenMutationVariables,
        })

        this.internalModel = response.data!.generateClientAccountCreationToken!
      }
      this.isSubmitting = false
    } catch (err) {
      this.isSubmitting = false
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }
}
</script>
