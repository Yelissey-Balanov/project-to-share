<template>
  <div class="w-full overflow-x-auto flex flex-col rounded-lg shadow-md" ref="tableWrapper">
    <table class="w-full">
      <thead>
        <tr
          class="text-xs font-semibold tracking-widest text-left text-slate-500 uppercase border-b bg-gray-50 whitespace-nowrap"
        >
          <td v-if="rowSelectionIsActive" class="px-6 py-3.5 sticky left-0 z-[9] min-w-[57px] w-[57px] bg-gray-50">
            {{ selectedRows.length > 0 ? selectedRows.length : '' }}</td
          >
          <slot name="table-headers" />
          <td
            v-for="column in filteredColumns"
            :key="column.title"
            class="px-6 py-3.5 h-4"
            :class="[
              column.required
                ? rowSelectionIsActive
                  ? 'sticky left-[57px] bg-gray-50 z-[9] '
                  : 'sticky left-0 bg-gray-50 z-[9] '
                : '',
              column.class,
            ]"
          >
            <div class="space-y-1 h-full">
              <TableSorting
                :data="column"
                :has-filters="hasFilters"
                :sorting-form="sortingForm"
                @change-sorting="sortingChange($event, column)"
              />
              <component
                :is="column.filter"
                :data="column"
                :filter-form="filterForm"
                @change-filter="filterChange($event, column)"
              />
            </div>
          </td>
          <td
            v-if="filteredColumnsLength > 0 || filteredActionButtons.length > 0 || hasFilters || hasSorting"
            class="pr-6 pl-1 py-3.5 bg-gray-50 sticky right-0 z-50"
          >
            <div class="shrink-0 flex justify-end items-center space-x-2">
              <button
                class="tbtn-icon tbtn-icon--small tbtn--blue"
                type="submit"
                v-if="filteredColumnsLength > 0"
                v-tooltip="{ content: 'Select columns to display' }"
                @click="selectColumns"
                ><IHCog class="w-5 h-5"
              /></button>
              <button
                v-if="hasFilters || hasSorting"
                class="tbtn-icon tbtn-icon--small tbtn--white"
                type="button"
                v-tooltip="{ content: 'Clear filters and sorting', classes: ['tooltip--white'] }"
                @click="clearFiltersAndSorting"
                ><IFilterOff class="w-5 h-5"
              /></button>
              <DropdownButton v-if="filteredActionButtons.length > 0" :items-class="'w-48'">
                <template v-slot:button="{ toggle }">
                  <button class="tbtn-icon tbtn--white tbtn-icon--small" type="button" @click="toggle">
                    <IHDotsVertical class="w-5 h-5" />
                  </button>
                </template>
                <template #items>
                  <button
                    v-for="action in filteredActionButtons"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none"
                    :class="action.button.class"
                    type="button"
                    @click="action.callback()"
                  >
                    <component :is="action.button.icon" class="w-5 h-5 mr-3" :class="action.button.iconClass" />
                    {{ action.button.text }}
                  </button>
                  <button
                    class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-red-700 hover:bg-red-100"
                    type="button"
                    @click="$emit('cancel-selection')"
                  >
                    <IHX class="w-5 h-5 mr-3" />
                    Cancel selection
                  </button>
                </template>
              </DropdownButton>
            </div>
          </td>
        </tr>
      </thead>
      <tbody class="bg-white divide-y">
        <slot name="table-row" v-for="(item, index) in itemsComputed" :item="item">
          <tr>
            <td
              v-if="rowSelectionIsActive"
              class="pl-6 py-3.5 sticky left-0 z-[9] min-w-[57px] w-[57px] h-full"
              :class="bgItems[index]"
            >
              <FCheckbox @input="onChecked" :additionalValue="item.id" :value="selectedRows.includes(item.id)" />
            </td>
            <slot name="table-data" :item="item" />
            <component
              v-for="(column, key) in filteredColumns"
              :are-images-displayed="areImagesDisplayed"
              :is="column.component"
              :key="key"
              :data="item"
              :parent-data="parentData"
              @callback="column.callback($event)"
              :class="[
                column.required ? (rowSelectionIsActive ? 'sticky left-[57px] z-[9] ' : 'sticky left-0 z-[9] ') : '',
                bgItems[index],
              ]"
            />
            <td
              class="px-6 py-3.5 sticky right-0 z-[9]"
              :class="bgItems[index]"
              v-if="
                rowActions.length > 0 ||
                filteredColumnsLength > 0 ||
                filteredActionButtons.length > 0 ||
                hasFilters ||
                hasSorting
              "
            >
              <div class="flex space-x-2 items-center justify-end">
                <component
                  v-for="rowAction in rowActions"
                  :are-images-displayed="areImagesDisplayed"
                  :is="rowAction.component"
                  :data="item"
                  :parent-data="parentData"
                  @callback="rowAction.callback ? rowAction.callback(item) : () => {}"
                />
              </div>
            </td>
          </tr>
        </slot>
      </tbody>
    </table>
    <FooterTablePagination
      v-if="isPaginationOnFrontend"
      :pagination="paginatorInfoOnFrontend"
      @pageChanged="changePage"
      class="sticky left-0 bottom-0"
    />
    <FooterTablePagination
      v-else-if="paginatorInfo"
      :pagination="paginatorInfo"
      @pageChanged="changePage"
      class="sticky left-0 bottom-0"
    />
    <SelectDisplayedColumnsModal
      ref="selectDisplayedColumnsModal"
      :item-title="itemTitle"
      :available-columns="availableColumns"
      :are-images-displayed="areImagesDisplayed"
      :per-page="perPage"
      :display-per-page="isPaginationOnFrontend"
      :selected-columns="selectedColumns"
      @select-columns="setSelectedColumns($event)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Maybe, SortOrder } from '~/graphql/GQLTypes'
import FooterTablePagination from '~/components/FooterTablePagination.vue'
import jump from 'jump.js'
import IHCog from '~/components/globals/icons/heroicons/IHCog.vue'
import SelectDisplayedColumnsModal from '~/components/pages/SelectDisplayedColumnsModal.vue'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import CandidatesCompany from '~/components/pages/columns/CandidatesCompany.vue'
import HasStellaAccount from '~/components/pages/columns/HasStellaAccount.vue'
import Industries from '~/components/pages/columns/Industries.vue'
import LastContact from '~/components/pages/columns/LastContact.vue'
import ListOfCV from '~/components/pages/columns/ListOfCV.vue'
import CandidateNameWithPhoto from '~/components/pages/columns/CandidateNameWithPhoto.vue'
import PhoneNumber from '~/components/pages/columns/PhoneNumber.vue'
import Salary from '~/components/pages/columns/Salary.vue'
import Skills from '~/components/pages/columns/Skills.vue'
import CompanyNameWithPhoto from '~/components/pages/columns/CompanyNameWithPhoto.vue'
import Locations from '~/components/pages/columns/Locations.vue'
import CompanyLinks from '~/components/pages/columns/CompanyLinks.vue'
import ClientNameWithPhoto from '~/components/pages/columns/ClientNameWithPhoto.vue'
import ClientsCompany from '~/components/pages/columns/ClientsCompany.vue'
import Email from '~/components/pages/columns/Email.vue'
import DailyRate from '~/components/pages/columns/DailyRate.vue'
import Birthdate from '~/components/pages/columns/Birthdate.vue'
import Location from '~/components/pages/columns/Location.vue'
import DropdownButton from '~/components/DropdownButton.vue'
import IHUserAdd from '~/components/globals/icons/heroicons/IHUserAdd.vue'
import IHCollection from '~/components/globals/icons/heroicons/IHCollection.vue'
import IHDotsVertical from '~/components/globals/icons/heroicons/IHDotsVertical.vue'
import IHX from '~/components/globals/icons/heroicons/IHX.vue'
import ProjectTitle from '~/components/pages/columns/ProjectTitle.vue'
import Status from '~/components/pages/columns/Status.vue'
import Candidates from '~/components/pages/columns/Candidates.vue'
import ProjectUsers from '~/components/pages/columns/ProjectUsers.vue'
import ProjectsCompany from '~/components/pages/columns/ProjectsCompany.vue'
import Clients from '~/components/pages/columns/Clients.vue'
import ProjectCandidate from '~/components/pages/columns/ProjectCandidate.vue'
import ProjectCandidateStatus from '~/components/pages/columns/ProjectCandidateStatus.vue'
import ProjectCandidateMatchingScore from '~/components/pages/columns/ProjectCandidateMatchingScore.vue'
import ProjectCandidateSalary from '~/components/pages/columns/ProjectCandidateSalary.vue'
import ProjectCandidateDailyRate from '~/components/pages/columns/ProjectCandidateDailyRate.vue'
import ItSkills from '~/components/pages/columns/ItSkills.vue'
import Certifications from '~/components/pages/columns/Certifications.vue'
import ProjectCandidateClientFeedback from '~/components/pages/columns/ProjectCandidateClientFeedback.vue'
import Nationalities from '~/components/pages/columns/Nationalities.vue'
import DesiredPosition from '~/components/pages/columns/DesiredPosition.vue'
import NoticePeriod from '~/components/pages/columns/NoticePeriod.vue'
import ProjectCandidateConsented from '~/components/pages/columns/ProjectCandidateConsented.vue'
import ProjectCandidateEvents from '~/components/pages/columns/ProjectCandidateEvents.vue'
import Age from '~/components/pages/columns/Age.vue'
import RangeFilter from '~/components/pages/filters/RangeFilter.vue'
import InputFilter from '~/components/pages/filters/InputFilter.vue'
import IHSwitch from '~/components/globals/icons/heroicons/IHSwitch.vue'
import Tab from '~/components/Tab.vue'
import TableSorting from '~/components/pages/TableSorting.vue'
import IFilterOff from '~/components/globals/icons/IFilterOff.vue'
import Gender from '~/components/pages/columns/Gender.vue'
import CandidateIndustriesAdditional from '~/components/pages/columns/CandidateIndustriesAdditional.vue'
import CandidateIndustriesMatchedMissing from '~/components/pages/columns/CandidateIndustriesMatchedMissing.vue'
import CandidateItSkillsMatchedMissing from '~/components/pages/columns/CandidateItSkillsMatchedMissing.vue'
import CandidateCertificationsMatchedMissing from '~/components/pages/columns/CandidateCertificationsMatchedMissing.vue'
import CandidateSkillsMatchedMissing from '~/components/pages/columns/CandidateSkillsMatchedMissing.vue'
import CandidateItSkillsAdditional from '~/components/pages/columns/CandidateItSkillsAdditional.vue'
import CandidateSkillsAdditional from '~/components/pages/columns/CandidateSkillsAdditional.vue'
import CandidateCertificationsAdditional from '~/components/pages/columns/CandidateCertificationsAdditional.vue'
import CandidateSuitableDailyRate from '~/components/pages/columns/CandidateSuitableDailyRate.vue'
import CandidateSuitableExpensesIncluded from '~/components/pages/columns/CandidateSuitableExpensesIncluded.vue'
import CandidateSuitableAvailableFrom from '~/components/pages/columns/CandidateSuitableAvailableFrom.vue'
import CandidateSuitableBasicSalary from '~/components/pages/columns/CandidateSuitableBasicSalary.vue'
import CandidateSuitableBonus from '~/components/pages/columns/CandidateSuitableBonus.vue'
import CandidateSuitableIsBusinessCarIncluded from '~/components/pages/columns/CandidateSuitableIsBusinessCarIncluded.vue'
import CandidateSuitableNoticePeriod from '~/components/pages/columns/CandidateSuitableNoticePeriod.vue'
import CandidateSuitableNextPossibleNotice from '~/components/pages/columns/CandidateSuitableNextPossibleNotice.vue'
import CandidateSuitableOtherBonus from '~/components/pages/columns/CandidateSuitableOtherBonus.vue'

export interface ColumnsDefinition {
  [key: string]: {
    title: string
    class?: string
    component: string
    filter?: string
    filterValues?: any
    sorting?: boolean
    itemValueForFilterAndSorting?: (value: any) => void
    required?: boolean
    callback?: (value: any) => void
  }
}

export interface RowActionDefinition {
  component: any
  callback?: (value: any) => void
}

@Component({
  components: {
    CandidateItSkillsMatchedMissing,
    CandidateCertificationsMatchedMissing,
    CandidateIndustriesMatchedMissing,
    CandidateSkillsMatchedMissing,
    CandidateItSkillsAdditional,
    CandidateSkillsAdditional,
    CandidateIndustriesAdditional,
    CandidateCertificationsAdditional,
    Gender,
    IFilterOff,
    TableSorting,
    Tab,
    IHSwitch,
    InputFilter,
    RangeFilter,
    Age,
    ProjectCandidateEvents,
    ProjectCandidateConsented,
    NoticePeriod,
    DesiredPosition,
    Nationalities,
    ProjectCandidateClientFeedback,
    Certifications,
    ItSkills,
    ProjectCandidateDailyRate,
    ProjectCandidateSalary,
    ProjectCandidateMatchingScore,
    ProjectCandidateStatus,
    ProjectCandidate,
    Clients,
    ProjectsCompany,
    ProjectUsers,
    Candidates,
    Status,
    ProjectTitle,
    Location,
    Birthdate,
    DailyRate,
    IHX,
    IHDotsVertical,
    IHCollection,
    IHUserAdd,
    DropdownButton,
    Email,
    HasStellaAccount,
    ClientsCompany,
    ClientNameWithPhoto,
    CompanyLinks,
    Locations,
    CompanyNameWithPhoto,
    SelectDisplayedColumnsModal,
    IHCog,
    FooterTablePagination,
    Skills,
    Salary,
    PhoneNumber,
    CandidateNameWithPhoto,
    ListOfCV,
    LastContact,
    Industries,
    LabeledValue,
    IHUserFilled,
    CandidatesCompany,
    CandidateSuitableDailyRate,
    CandidateSuitableExpensesIncluded,
    CandidateSuitableAvailableFrom,
    CandidateSuitableBasicSalary,
    CandidateSuitableBonus,
    CandidateSuitableIsBusinessCarIncluded,
    CandidateSuitableNoticePeriod,
    CandidateSuitableNextPossibleNotice,
    CandidateSuitableOtherBonus,
  },
})
export default class TableWithSelectableColumns extends Vue {
  SortOrder
  $refs!: {
    selectDisplayedColumnsModal: SelectDisplayedColumnsModal
    tableWrapper: HTMLDivElement
  }
  @Prop()
  items!: NonNullable<any>['data']
  @Prop()
  parentData!: any
  @Prop()
  paginatorInfo!: Maybe<NonNullable<any>['paginatorInfo']>
  @Prop()
  isPaginationOnFrontend!: boolean
  @Prop({ default: 20 })
  defaultPerPage!: number
  @Prop()
  itemTitle!: string
  @Prop()
  rowSelectionIsActive!: boolean
  @Prop({ default: () => [] })
  selectedRows!: []
  @Prop({ default: () => ({}) })
  availableColumns!: ColumnsDefinition
  @Prop({ default: () => [] })
  rowActions!: RowActionDefinition[]
  @Prop({ default: () => [] })
  defaultSelectedColumns!: string[]
  @Prop({ default: undefined })
  customRowBg: undefined | ((row: any) => string)
  @Prop({
    default: () => {
      return {}
    },
  })
  actionButtons!: any

  currentPage = 1
  itemsCount = 0

  sortingForm = {}
  filterForm = {}

  selectedColumns = this.defaultSelectedColumns
  areImagesDisplayed = true
  perPage = this.defaultPerPage

  get paginatorInfoOnFrontend() {
    return {
      currentPage: this.currentPage,
      lastPage: Math.ceil(this.itemsCount / this.perPage),
      perPage: this.perPage,
      total: this.itemsCount,
    }
  }

  get requiredColumns() {
    const columnIds: string[] = []
    Object.keys(this.availableColumns).forEach((columnId) => {
      if (this.availableColumns[columnId].required) {
        columnIds.push(columnId)
      }
    })
    return columnIds
  }

  get filteredActionButtons() {
    return Object.values(this.actionButtons).filter((el: any) => el.isAvailable)
  }

  get filteredColumns(): ColumnsDefinition {
    const columns = {}
    this.requiredColumns.forEach((columnId) => {
      columns[columnId] = this.availableColumns[columnId]
    })
    this.selectedColumns
      .filter((columnId) => columnId in this.availableColumns)
      .forEach((columnId) => {
        columns[columnId] = this.availableColumns[columnId]
      })
    return columns
  }

  get filteredColumnsLength(): number {
    return Object.keys(this.filteredColumns).length
  }

  get hasFilters() {
    return Object.values(Object.values(this.filteredColumns).filter((el) => el.filter)).length > 0
  }
  get hasSorting() {
    return Object.values(Object.values(this.filteredColumns).filter((el) => el.sorting)).length > 0
  }

  get itemsComputed() {
    let itemsArray = [...this.items]
    if (this.hasFilters) {
      for (const [key, value] of Object.entries(this.filterForm)) {
        itemsArray = this.filterFunction(
          itemsArray,
          this.filterForm[key],
          Object.entries(this.availableColumns).find((el) => el[1].title == key)?.[1]
        )
      }
    }
    if (this.hasSorting) {
      for (const [key, value] of Object.entries(this.sortingForm)) {
        itemsArray = this.sorting(
          itemsArray,
          this.sortingForm[key],
          Object.entries(this.availableColumns).find((el) => el[1].title == key)?.[1]
        )
      }
    }
    if (this.isPaginationOnFrontend) {
      this.itemsCount = itemsArray.length
      return itemsArray.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    }
    return itemsArray
  }

  get bgItems() {
    return this.itemsComputed.map((row) => (this.customRowBg ? this.customRowBg(row) : 'bg-white'))
  }

  mounted() {
    let sortingFormObject = {}
    let filterFormObject = {}
    Object.keys(this.availableColumns).forEach((columnId) => {
      if (this.availableColumns[columnId].sorting) {
        sortingFormObject[this.availableColumns[columnId].title] = null
      }
      if (this.availableColumns[columnId].filter) {
        filterFormObject[this.availableColumns[columnId].title] = {}
        if (this.availableColumns[columnId].filterValues) {
          let object = {}
          this.availableColumns[columnId].filterValues.forEach((value) => (object[value] = null))
          filterFormObject[this.availableColumns[columnId].title] = Object.assign({}, object)
        } else {
          filterFormObject[this.availableColumns[columnId].title].value = null
        }
      }
    })
    this.sortingForm = Object.assign({}, sortingFormObject)
    this.filterForm = Object.assign({}, filterFormObject)
    this.setSelectedColumns()
  }

  setSelectedColumns(selectedColumnIds?: string[]) {
    if (!selectedColumnIds) {
      selectedColumnIds = JSON.parse(localStorage.getItem('columns.' + this.itemTitle) ?? '[]')
    }
    if (selectedColumnIds!.length > 0) {
      this.selectedColumns = selectedColumnIds!
    }
    this.areImagesDisplayed = JSON.parse(localStorage.getItem('images.' + this.itemTitle) ?? 'true')
    if (localStorage.getItem('perPage.' + this.itemTitle)) {
      this.perPage = JSON.parse(localStorage.getItem('perPage.' + this.itemTitle) ?? '20')
      this.currentPage = 1
    }
  }

  selectColumns() {
    this.$refs.selectDisplayedColumnsModal.open()
  }

  changePage(newPage: number) {
    this.$emit('fetch', newPage)
    this.currentPage = newPage
    jump(this.$refs.tableWrapper, {
      duration: 300,
      offset: -24,
    })
  }

  filterChange(form, column) {
    let filterFormObject = {}
    filterFormObject[column.title] = form
    this.filterForm = Object.assign({}, this.filterForm, filterFormObject)
  }

  sortingChange(value, column) {
    let sortingFormObject = {}
    for (const [key] of Object.entries(this.sortingForm)) {
      sortingFormObject[key] = null
    }
    sortingFormObject[column.title] = value
    this.sortingForm = Object.assign({}, sortingFormObject)
  }

  clearFiltersAndSorting() {
    let sortingFormObject = {}
    for (const [key] of Object.entries(this.sortingForm)) {
      sortingFormObject[key] = null
    }
    this.sortingForm = Object.assign({}, sortingFormObject)
    let filterFormObject = {}
    for (const [key] of Object.entries(this.filterForm)) {
      filterFormObject[key] = {}
      for (const [key2] of Object.entries(this.filterForm[key])) {
        filterFormObject[key][key2] = null
      }
    }
    this.filterForm = Object.assign({}, filterFormObject)
  }

  sorting(arr, sort, column, type?) {
    return arr.sort((a, b) => {
      if (column.itemValueForFilterAndSorting) {
        let valueA = column.itemValueForFilterAndSorting(a)
        let valueB = column.itemValueForFilterAndSorting(b)
        if (sort) {
          if (valueA === null) {
            return 1
          }
          if (valueB === null) {
            return -1
          }
          if (sort == SortOrder.Asc) {
            return valueA > valueB ? 1 : valueB > valueA ? -1 : 0
          } else if (sort == SortOrder.Desc) {
            return valueB > valueA ? 1 : valueA > valueB ? -1 : 0
          }
        }
      }
    })
  }

  filterFunction(arr, filter, column, type?) {
    return arr.filter((y) => {
      if (column.itemValueForFilterAndSorting) {
        let value = column.itemValueForFilterAndSorting(y)
        if (column.filter == 'RangeFilter') {
          return (filter.min === null || value >= filter.min) && (filter.max === null || value <= filter.max)
        } else if (column.filter == 'InputFilter') {
          return filter.value === null || (value && value.toLowerCase().includes(filter.value.toLowerCase()))
        }
        return true
      }
      return true
    })
  }

  onChecked(isChecked, id) {
    this.$emit('rows-change', { isChecked: isChecked, id: id })
  }
}
</script>
