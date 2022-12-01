<template>
  <div>
    <client-only>
      <SweetModal ref="modalRevenueForm" :title="revenue ? 'Edit revenue' : 'Create new revenue'">
        <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <FSelectSimple
              v-model="form.month"
              label="Month"
              :options="monthOptions"
              :nullable="false"
              :rules="'required'"
              errorLabel="month"
            />
            <FSelectSimple
              v-model="form.year"
              label="Year"
              :options="yearOptions"
              :nullable="false"
              :rules="'required'"
              errorLabel="year"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FSelectSimple
              v-model="form.type"
              label="Revenue type"
              :options="typeOptions"
              :nullable="false"
              :rules="'required'"
              errorLabel="type"
            />
            <FInput v-model="form.amount" label="Amount" :rules="'required'" errorLabel="amount" :as-currency="true" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <FSelectSimple
              v-model="form.stage"
              label="Revenue stage"
              :options="stageOptions"
              :nullable="false"
              :rules="'required'"
              errorLabel="stage"
            />
          </div>

          <div class="text-center text-xl mt-4 mb-2">Revenue splitting</div>
          <template v-if="project">
            <div class="grid grid-cols-2 gap-4" v-for="user in users" :key="user.id">
              <LabeledValue :value="user" formatted="{firstname} {lastname}" :label="user.role" />
              <FInput
                v-model="form.users[user.id]"
                label="Percent"
                :rules="'required'"
                errorLabel="percent"
                :as-integer="true"
              />
            </div>
            <p class="text-center text-red-600" v-if="!is100PercentSum"> Sum of all percents should be equal 100 </p>
          </template>
          <p class="text-center" v-else> Loading... </p>

          <div class="mt-4 mb-0 form-action-buttons">
            <button type="submit" class="tbtn tbtn--blue">
              <template v-if="!isSubmitting">
                <template v-if="!revenue"> Create revenue</template>
                <template v-else> Update revenue</template>
              </template>
              <template v-else>
                <template v-if="!revenue"> Creating revenue...</template>
                <template v-else> Updating revenue...</template>
              </template>
            </button>
          </div>
        </ValidationObserver>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import {
  CreateRevenueInput,
  CreateRevenueMutation,
  CreateRevenueMutationVariables,
  GetRevenueQuery,
  GetRevenueQueryVariables,
  Maybe,
  Project,
  Revenue,
  RevenueStage,
  RevenueType,
  UpdateRevenueMutation,
  UpdateRevenueMutationVariables,
} from '~/graphql/GQLTypes'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import { ValidationObserver } from 'vee-validate'
import { State } from '~/node_modules/nuxt-property-decorator'
import GetRevenue from '~/graphql/ressources/revenues/GetRevenue.gql'
import CreateRevenue from '~/graphql/ressources/revenues/CreateRevenue.gql'
import UpdateRevenue from '~/graphql/ressources/revenues/UpdateRevenue.gql'
import { validateObserver } from '~/helpers/validationHelpers'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'

@Component({
  components: { LabeledValue, ValidationObserver },
})
export default class AddRevenueModal extends Vue {
  $refs!: {
    modalRevenueForm: any
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  project: Maybe<Project> = null

  revenue: Maybe<Revenue> = null

  form: {
    month: Maybe<string>
    year: Maybe<string>
    type: Maybe<RevenueType>
    stage: RevenueStage
    amount: Maybe<number>
    users: { [p: number]: number }
  } = {
    month: null,
    year: null,
    type: null,
    stage: RevenueStage.Forecast,
    amount: null,
    users: {},
  }

  users: Array<{
    id: number
    firstname: string
    lastname: string
    role: string
  }> = []

  monthOptions = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  }

  // TODO: these options should be probably restricted, depended on users role
  stageOptions = {
    [RevenueStage.PendingOrCancelled]: 'Pending or cancelled',
    [RevenueStage.Forecast]: 'Forecast',
    [RevenueStage.ReadyToInvoice]: 'Ready to invoce',
    [RevenueStage.InvoiceSent]: 'Invoice sent',
    [RevenueStage.Paid]: 'Paid',
  }

  yearOptions = {}

  isSubmitting = false

  @State((state) => state.account.user)
  accountUser

  get is100PercentSum() {
    let sum = 0
    Object.values(this.form.users).forEach((percent) => (sum += percent))
    return sum === 100
  }

  get typeOptions() {
    let options = {}
    if (this.project && this.project.is_interim) {
      options[RevenueType.AdminFee] = 'Admin Fee'
      options[RevenueType.MonthlyFee] = 'Monthly Fee'
    }
    if (this.project && this.project.is_permanent) {
      options[RevenueType.Retainer] = 'Retainer'
      options[RevenueType.ShortlistFee] = 'Shortlist Fee'
      options[RevenueType.CompletionFee] = 'Completion Fee'
      options[RevenueType.SuccessFee] = 'Success Fee'
      options[RevenueType.CancellationFee] = 'Cancellation Fee'
    }
    return options
  }

  mounted() {
    const currentYear = new Date().getFullYear()
    for (let i = -1; i < 2; i++) {
      this.yearOptions[currentYear + i] = currentYear + i
    }

    this.$bus.$on('openRevenueFormModal', (project: Project) => {
      this.revenue = null
      this.project = project

      // reset form values
      this.form.month = (new Date().getMonth() + 1).toString()
      this.form.year = new Date().getFullYear().toString()
      this.form.type = null
      this.form.amount = null
      this.form.stage = RevenueStage.Forecast

      this.form.users = {}
      this.users = []
      if (this.project) {
        this.project.users.forEach((user) => {
          this.users.push({
            id: user.id!,
            firstname: user.firstname!,
            lastname: user.lastname!,
            role: user.pivot!.role,
          })
          Vue.set(this.form.users, user.id!, user.pivot!.percent)
        })
      }

      this.$refs.modalRevenueForm!.open()
    })

    this.$bus.$on('openRevenueFormModalEdit', (revenue: Revenue) => {
      this.revenue = revenue
      this.project = null

      this.$apollo
        .query<GetRevenueQuery>({
          query: GetRevenue,
          variables: {
            id: this.revenue.id,
          } as GetRevenueQueryVariables,
        })
        .then(({ data }) => {
          this.project = data.revenue!.project as Project

          this.project.users.forEach((user) => {
            this.users.push({
              id: user.id!,
              firstname: user.firstname!,
              lastname: user.lastname!,
              role: user.pivot!.role,
            })
            const percentItem = this.revenue!.revenue_users.find((revenueUser) => revenueUser.user.id === user.id)
            if (percentItem) {
              Vue.set(this.form.users, user.id!, percentItem.percent)
            }
          })

          this.project.users.forEach((user) => {
            const userItem = this.users.find((item) => item.id === user.id)
            if (userItem) {
              userItem.role = user.pivot!.role
            }
          })
        })

      // reset form values
      this.form.month = revenue.month.toString()
      this.form.year = revenue.year.toString()
      this.form.type = revenue.type
      this.form.amount = revenue.amount / 100
      this.form.stage = revenue.stage

      this.form.users = {}
      this.users = []

      this.$refs.modalRevenueForm!.open()
    })
  }

  async onSubmit() {
    if (this.isSubmitting) {
      return
    }

    if (!(await validateObserver(this.$refs.formValidationObserver)) || !this.is100PercentSum) {
      return
    }

    this.isSubmitting = true
    const updateOrCreate = this.revenue! ? this.updateRevenue : this.createNewRevenue

    try {
      await updateOrCreate()
      await this.$apollo.provider.defaultClient.clearStore()

      this.isSubmitting = false
      if (this.$refs.modalRevenueForm) {
        this.$refs.modalRevenueForm.close()
      }
      this.$bus.showSuccessModal('Revenue was successfully stored', 2000)
    } catch (err) {
      this.isSubmitting = false
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  private async createNewRevenue() {
    const variables: CreateRevenueMutationVariables = {
      input: {
        ...this.generateUpdateInput(),

        project_id: this.project!.id,
      },
    }

    const { data } = await this.$apollo.mutate<CreateRevenueMutation>({
      mutation: CreateRevenue,
      variables,
    })

    this.$emit('createdNewRevenue', data!.createRevenue)
  }

  private async updateRevenue() {
    const variables: UpdateRevenueMutationVariables = {
      id: this.revenue!.id,
      input: {
        ...this.generateUpdateInput(),
      },
    }

    const { data } = await this.$apollo.mutate<UpdateRevenueMutation>({
      mutation: UpdateRevenue,
      variables,
    })

    this.$emit('updatedRevenue', data!.updateRevenue)
  }

  private generateUpdateInput(): Omit<CreateRevenueInput, 'project_id'> {
    const usersSync: NonNullable<CreateRevenueInput['users']>['sync'] = []
    Object.keys(this.form.users).forEach((userId) => {
      usersSync.push({
        id: parseInt(userId),
        percent: this.form.users[userId],
      })
    })
    return {
      year: parseInt(this.form.year!),
      month: parseInt(this.form.month!),
      amount: Math.floor(this.form.amount! * 100),
      type: this.form.type!,
      stage: this.form.stage,

      users: {
        sync: usersSync,
      },
    }
  }

  destroyed() {
    this.$bus.$off('openRevenueFormModal')
    this.$bus.$off('openRevenueFormModalEdit')
  }
}
</script>
