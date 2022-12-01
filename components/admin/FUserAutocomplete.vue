import { UsersWhereColumn } from '~/graphql/GQLTypes';
<template>
  <div class="f-specified-multiselect is-single">
    <label v-if="!!label" :class="{ 'is-floating': value || isOpened }">{{ label }}</label>
    <multiselect
      :value="selectedOption"
      @input="handleInput"
      @search-change="handleSearchChange"
      placeholder=""
      :options="userOptions"
      openDirection="bottom"
      track-by="id"
      :custom-label="customLabelForMultiselect"
      :loading="isLoading"
      @open="isOpened = true"
      @close="isOpened = false"
      :internalSearch="false"
      :taggable="false"
      tagPosition="bottom"
      :id="id"
      :show-labels="false"
    >
      <template slot="noResult" slot-scope="props"> No users found that satisfy search query </template>
    </multiselect>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { debounce } from 'lodash'
import {
  GetUsersForAutocompleteQuery,
  GetUsersForAutocompleteQueryVariables,
  Maybe,
  SortOrder,
  SqlOperator,
  UserRole,
  QueryUsersWhereColumn,
} from '@/graphql/GQLTypes'
import GetUsersForAutocomplete from '@/graphql/components/GetUsersForAutocomplete.gql'
import generateFormFieldId from '~/helpers/generateFormFieldId'

@Component
export default class FUserAutocomplete extends Vue {
  @Prop()
  value?: NonNullable<GetUsersForAutocompleteQuery['users']>['data'][0]
  @Prop()
  label?: string
  @Prop({ default: false })
  allowCreating?: boolean

  userOptions: NonNullable<GetUsersForAutocompleteQuery['users']>['data'] = []

  selectedOption: Maybe<NonNullable<GetUsersForAutocompleteQuery['users']>['data'][0]> = null
  isLoading = false
  isOpened = false
  id = ''

  customLabelForMultiselect(user: NonNullable<GetUsersForAutocompleteQuery['users']>['data'][0]) {
    return `${user.firstname} ${user.lastname}`
  }

  handleSearchChange = debounce((searchQuery) => {
    this.getUsersFromDB(searchQuery)
  }, 200)

  private sentValueToOutside!: Maybe<NonNullable<GetUsersForAutocompleteQuery['users']>['data'][0]>

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  @Watch('value', { immediate: true })
  onValueChanges(val: NonNullable<GetUsersForAutocompleteQuery['users']>['data'][0]) {
    if (val !== this.sentValueToOutside) {
      if (val) {
        this.userOptions = [val]
        this.selectedOption = this.userOptions[0]
      } else {
        this.userOptions = []
        this.selectedOption = null
      }
      this.sentValueToOutside = val
    }
  }

  handleInput(e) {
    this.selectedOption = e
    this.sentValueToOutside = this.selectedOption ? this.selectedOption : null
    this.$emit('input', this.sentValueToOutside)
  }

  private getUsersFromDB(query: string) {
    if (!query) {
      return
    }
    this.isLoading = true
    const variables: GetUsersForAutocompleteQueryVariables = {
      where: {
        OR: [
          {
            column: QueryUsersWhereColumn.Firstname,
            operator: SqlOperator.Ilike,
            value: `%${query}%`,
          },
          {
            column: QueryUsersWhereColumn.Lastname,
            operator: SqlOperator.Ilike,
            value: `%${query}%`,
          },
        ],
      },
      orderBy: [
        {
          order: SortOrder.Asc,
          column: 'lastname',
        },
        {
          order: SortOrder.Asc,
          column: 'firstname',
        },
      ],
      roles: [UserRole.Employee],
    }
    this.isLoading = true
    this.$apollo
      .query<GetUsersForAutocompleteQuery>({
        query: GetUsersForAutocomplete,
        variables,
      })
      .then(({ data }) => {
        this.isLoading = false
        this.userOptions = data.users!.data
      })
      .catch((err) => {
        console.error(err)
        this.isLoading = false
      })
  }
}
</script>
