<template>
  <div v-if="project" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/projects" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>

      <h1>{{ project.title }}</h1>

      <div class="flex items-center space-x-2" v-if="!project.deleted_at">
        <button
          class="tbtn-icon tbtn--white"
          type="button"
          @click="openShareProjectModal()"
          v-tooltip="{ content: 'Share', classes: ['tooltip--white'] }"
          v-if="
            project.status !== ProjectStatus.CancelledByBlackbull && project.status !== ProjectStatus.CancelledByClient
          "
        >
          <IHShare class="w-6 h-6" />
        </button>

        <nuxt-link
          :to="`/projects/${project.id}/add-candidates`"
          class="tbtn-icon tbtn--green"
          v-tooltip="{ content: 'Add candidates', classes: ['tooltip--green'] }"
          v-if="project.status === ProjectStatus.Active"
        >
          <IHUserAdd class="w-6 h-6" />
        </nuxt-link>

        <button
          class="tbtn-icon tbtn--green"
          type="button"
          v-tooltip="{ content: 'Complete', classes: ['tooltip--green'] }"
          @click="completeProject()"
          v-if="project.status === ProjectStatus.Runner"
        >
          <IHBadgeCheck class="w-6 h-6" />
        </button>

        <nuxt-link
          :to="`/projects/${project.id}/form`"
          class="tbtn-icon tbtn--blue"
          v-tooltip="'Edit'"
          v-if="isEditable"
        >
          <IHPencil class="w-6 h-6" />
        </nuxt-link>

        <DropdownButton>
          <template #items>
            <button
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-yellow-700 hover:bg-yellow-100"
              type="button"
              @click="pauseProject()"
              v-if="project.status === ProjectStatus.Active"
            >
              <IHPause class="w-5 h-5 mr-3" />
              Pause
            </button>
            <button
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-green-700 hover:bg-green-100"
              type="button"
              @click="resumeProject()"
              v-if="project.status === ProjectStatus.Paused"
            >
              <IHPlay class="w-5 h-5 mr-3" />
              Resume
            </button>

            <button
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-red-700 hover:bg-red-100"
              type="button"
              @click="cancelProject()"
              v-if="isEditable"
            >
              <IHX class="w-5 h-5 mr-3" />
              Cancel
            </button>
            <button
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-green-700 hover:bg-green-100"
              type="button"
              @click="reactivateProject()"
              v-if="
                project.status === ProjectStatus.CancelledByBlackbull ||
                project.status === ProjectStatus.CancelledByClient
              "
            >
              <IHRefresh class="w-5 h-5 mr-3" />
              Reactivate
            </button>

            <nuxt-link
              :to="{ path: '/projects/new/form', query: { cloneFrom: project.id } }"
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-blue-700 hover:bg-blue-100"
            >
              <IHDuplicate class="w-5 h-5 mr-3" />
              Duplicate project
            </nuxt-link>

            <button
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-blue-700 hover:bg-blue-100"
              type="button"
              @click="addToBucket()"
            >
              <IHCollection class="w-5 h-5 mr-3" />
              Add to bucket
            </button>

            <button
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-yellow-700 hover:bg-yellow-100"
              type="button"
              @click="archiveProject()"
              v-if="!project.archived_at"
            >
              <IHArchive class="w-5 h-5 mr-3" />
              Archive project
            </button>
            <button
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-green-700 hover:bg-green-100"
              type="button"
              @click="unarchiveProject()"
              v-else
            >
              <IHArchive class="w-5 h-5 mr-3" />
              Restore from archive
            </button>

            <!--            <button-->
            <!--              class="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-green-700"-->
            <!--              type="button"-->
            <!--              @click="completeProject()"-->
            <!--              v-if="project.status === ProjectStatus.Runner"-->
            <!--            >-->
            <!--              <IHBadgeCheck class="w-5 h-5 mr-3" />-->
            <!--              Complete-->
            <!--            </button>-->
          </template>
        </DropdownButton>
      </div>
    </div>

    <div>
      <div lass="alert alert-danger" v-if="project.deleted_at">
        This project was deleted at {{ project.deleted_at | datetime }}, therefore it is not editable! You can either
        <button class="underline" type="button" @click="restore">restore</button>
        <template v-if="isAdmin">
          or
          <button class="underline" type="button" @click="forceDelete">force delete</button>
        </template>
        this project.
      </div>

      <div class="alert alert-neutral" v-if="project.archived_at">
        This project was <b>archived</b> at {{ project.archived_at | datetime }}.
      </div>

      <div class="alert alert-info" v-if="myParticipationInProject">
        I receive <b>{{ myParticipationInProject.percent }}%</b> for <b>{{ myParticipationInProject.role }}</b> in this
        project.
      </div>
    </div>

    <div class="grid gap-6 mb-6 grid-cols-1 xl:grid-cols-11">
      <div class="xl:col-span-7 2xl:col-span-7 flex flex-col space-y-6">
        <div class="card">
          <div class="card-header">
            <div>
              <h3>Project information</h3>
              <p class="mt-1 text-sm text-gray-500">Details and requirements of the project.</p>
            </div>
            <div class="flex flex-col space-y-1 items-end self-start">
              <div class="flex space-x-1">
                <span class="px-2.5 py-0.5 bg-blue-600 text-xs text-white rounded shadow-xl" v-if="project.is_permanent"
                  >Permanent</span
                >
                <span class="px-2.5 py-0.5 bg-pink-600 text-xs text-white rounded shadow-xl" v-if="project.is_interim"
                  >Interim</span
                >
              </div>
              <span :class="'border px-2.5 py-0.5 rounded-full ' + statusTextClass">
                {{ project.status | formatSnakeCaseString }}
              </span>
            </div>
          </div>
          <div class="card-body">
            <div>
              <span class="card-item-title first-col-1-4">Title</span>
              <span>{{ project.title }}</span>
            </div>

            <div>
              <span class="card-item-title first-col-1-4">Project duration</span>
              <span>
                {{ [project.project_start, project.project_end] | dateRange }}
              </span>
            </div>

            <div v-if="project.retain">
              <span class="card-item-title first-col-1-4">Retainer</span>
              <span>{{ project.retain | currency }}</span>
            </div>

            <div v-if="project.industries.length > 0">
              <span class="card-item-title first-col-1-4">Industries</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/industries/${industry.id}`"
                  v-for="industry in project.industries"
                  :key="`ind_${industry.id}`"
                >
                  {{ industry.title }}
                </nuxt-link>
              </span>
            </div>

            <div v-if="project.skills.length > 0">
              <span class="card-item-title first-col-1-4">Skills</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/skills/${skill.id}`"
                  v-for="skill in project.skills"
                  :key="`skill_${skill.id}`"
                >
                  {{ skill.title }}
                </nuxt-link>
              </span>
            </div>

            <div v-if="project.certifications.length > 0">
              <span class="card-item-title first-col-1-4">Certifications</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/certifications/${certification.id}`"
                  v-for="certification in project.certifications"
                  :key="`cert_${certification.id}`"
                >
                  {{ certification.title }}
                </nuxt-link>
              </span>
            </div>

            <div v-if="project.it_skills.length > 0">
              <span class="card-item-title first-col-1-4">IT Skills</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/it-skills/${itSkill.id}`"
                  v-for="itSkill in project.it_skills"
                  :key="`itskill_${itSkill.id}`"
                >
                  {{ itSkill.title }}
                </nuxt-link>
              </span>
            </div>

            <div v-if="project.languages.length > 0">
              <span class="card-item-title first-col-1-4">Languages</span>
              <span>
                <ul class="space-y-2">
                  <li v-for="language in project.languages">
                    <span>{{ language.name }}</span>
                    <span class="text-gray-500" v-if="language.language_pivot.level">
                      &middot; {{ language.language_pivot.level | formatSnakeCaseString }}
                    </span>
                  </li>
                </ul>
              </span>
            </div>

            <div v-if="project.status_note">
              <span class="card-item-title first-col-1-4">Status note</span>
              <span>{{ project.status_note }}</span>
            </div>

            <div v-if="project.notes">
              <span class="card-item-title first-col-1-4">Notes</span>
              <div class="whitespace-pre-wrap">{{ project.notes }}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHCalendar class="w-6 h-6 text-gray-700" />
              <h3>
                Client events within project
                <span class="text-gray-500">&middot; {{ clientEvents.length }}</span>
              </h3>
            </div>
            <button
              v-if="hiddenEvents.length > 0"
              type="button"
              class="tbtn-icon tbtn--white tbtn-icon--small"
              @click="toggleEventsVisibility"
            >
              <span
                class="transform transition duration-300 ease-in-out"
                :class="{ 'rotate-180': areAllEventsVisible }"
              >
                <IHChevronDown class="w-5 h-5" />
              </span>
            </button>
          </div>
          <table class="bg-white w-full overflow-hidden rounded-b-lg">
            <tbody class="divide-y">
              <EventTableRow
                class=""
                v-for="event in alwaysVisibleEvents"
                :event="event"
                :displayEventable="true"
                :key="`pce_${event.id}`"
              ></EventTableRow>
            </tbody>
          </table>
          <SlideUpDown class="border-t ease-in-out" :active="areAllEventsVisible" :duration="350">
            <table class="bg-white w-full overflow-hidden rounded-b-lg">
              <tbody class="divide-y">
                <EventTableRow
                  class=""
                  v-for="event in hiddenEvents"
                  :event="event"
                  :displayEventable="true"
                  :key="`pce_${event.id}`"
                ></EventTableRow>
              </tbody>
            </table>
          </SlideUpDown>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHCash class="w-6 h-6 text-gray-700" />
              <h3>Revenue</h3>
            </div>

            <div class="flex items-center space-x-4">
              <button
                v-if="hiddenRevenue.length > 0"
                type="button"
                class="tbtn-icon tbtn--white tbtn-icon--small"
                @click="toggleRevenueVisibility"
              >
                <span
                  class="transform transition duration-300 ease-in-out"
                  :class="{ 'rotate-180': isAllRevenueVisible }"
                >
                  <IHChevronDown class="w-5 h-5" />
                </span>
              </button>
              <button class="tbtn-icon tbtn--green tbtn-icon--small" @click="addRevenue">
                <IHPlus class="w-5 h-5" />
              </button>
            </div>
          </div>
          <table class="bg-white w-full overflow-hidden rounded-b-lg">
            <tbody class="divide-y">
              <RevenueTableRow
                class=""
                v-for="(revenue, i) in alwaysVisibleRevenue"
                :revenue="revenue"
                :key="`rev_${i}_${revenue.id}`"
                @onRevenueDeleted="onRevenueDeleted"
                @openInvoiceRecipientModal="openInvoiceRecipientModal"
              ></RevenueTableRow>
            </tbody>
          </table>
          <SlideUpDown class="border-t ease-in-out" :active="isAllRevenueVisible" :duration="350">
            <table class="bg-white w-full overflow-hidden rounded-b-lg">
              <tbody class="divide-y">
                <RevenueTableRow
                  class=""
                  v-for="(revenue, i) in hiddenRevenue"
                  :revenue="revenue"
                  :key="`rev_${i}_${revenue.id}`"
                  @onRevenueDeleted="onRevenueDeleted"
                  @openInvoiceRecipientModal="openInvoiceRecipientModal"
                ></RevenueTableRow>
              </tbody>
            </table>
          </SlideUpDown>
        </div>
      </div>

      <div class="xl:col-span-4 2xl:col-span-4 flex flex-col space-y-6">
        <div class="card" v-for="client in project.clients" :key="client.id">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHUserCircle class="w-6 h-6 text-gray-700" />
              <h3>Client information</h3>
            </div>

            <div class="flex -space-x-3 -my-2">
              <nuxt-link :to="`/companies/${project.company.id}`" class="small-foto">
                <LImg
                  class="w-14 h-14 overflow-hidden ring-white ring-2"
                  :image="project.company.logo ? project.company.logo.sizes.PROFILE_IMAGE : null"
                  v-tooltip="project.company.aliasOrName"
                >
                  <IHOfficeBuilding class="w-8 h-8 text-gray-400" />
                </LImg>
              </nuxt-link>
              <nuxt-link :to="`/clients/${client.id}`" class="small-foto">
                <LImg
                  class="w-14 h-14 overflow-hidden rounded-full bg-gray-200 ring-white ring-2"
                  :image="client.person.foto ? client.person.foto.sizes.PROFILE_IMAGE : null"
                  v-tooltip="client.person.full_name"
                >
                  <IHUserFilled class="w-14 h-14 text-gray-400 mt-3" />
                </LImg>
              </nuxt-link>
            </div>
          </div>
          <div class="card-body">
            <div>
              <span class="card-item-title first-col-1-3">Name</span>
              <nuxt-link :to="`/clients/${client.id}`">{{ client.person.full_name }}</nuxt-link>
            </div>
            <div v-if="client.position">
              <span class="card-item-title first-col-1-3">Position</span>
              <span>{{ client.position }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Company</span>
              <nuxt-link :to="`/companies/${project.company.id}`">{{ project.company.aliasOrName }}</nuxt-link>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Has stella-account</span>
              <span class="flex flex-auto justify-between">
                <template v-if="client.user_id"> Yes </template>
                <template v-else>
                  <span>No</span>
                  <nuxt-link class="ml-4 text-gray-500 hover:text-blue-700 outline-none" :to="`/clients/${client.id}`">
                    Go to profile to create invite
                  </nuxt-link>
                </template>
              </span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Access to long list</span>
              <span class="flex flex-auto justify-between">
                <template v-if="isSubmitting"> Loading... </template>
                <template v-else-if="client.client_project_pivot.has_long_list_access">
                  <span>Yes</span>
                  <button
                    type="button"
                    class="text-gray-500 hover:text-blue-700 outline-none"
                    @click="changeClientLongListAccess(client.id, false)"
                  >
                    Deactivate
                  </button>
                </template>
                <template v-else>
                  <span>No</span>
                  <button
                    type="button"
                    class="text-gray-500 hover:text-blue-700 outline-none"
                    @click="changeClientLongListAccess(client.id, true)"
                  >
                    Activate
                  </button>
                </template>
              </span>
            </div>
            <div class="justify-center">
              <button
                type="button"
                class="text-green-600 hover:text-green-700 hover:underline"
                @click="addEvent(client)"
              >
                Add new event
              </button>
            </div>
          </div>
        </div>

        <div class="card" v-if="project.is_interim">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHBriefcase class="w-6 h-6 text-gray-700" />
              <h3>Interim conditions</h3>
            </div>
          </div>
          <div class="card-body">
            <div>
              <span class="card-item-title first-col-1-3">Max daily rate</span>
              <span>{{ project.max_daily_rate | currency }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Expenses</span>
              <span>{{ project.expenses_included ? 'Included' : 'Not included' }}</span>
            </div>
          </div>
        </div>

        <div class="card" v-if="project.is_permanent">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHBriefcase class="w-6 h-6 text-gray-700" />
              <h3>Permanent conditions</h3>
            </div>
          </div>
          <div class="card-body">
            <div>
              <span class="card-item-title first-col-1-3">Max basic salary</span>
              <span>{{ project.max_basic_salary | currency }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Max bonus</span>
              <span>{{ project.max_bonus_eur | currency }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Business car</span>
              <span>{{ project.is_business_car_included ? 'Included' : 'Not included' }}</span>
            </div>
            <div v-if="project.fee_structure">
              <span class="card-item-title first-col-1-3">Fee structure</span>
              <span>{{ project.fee_structure }}%</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHFolder class="w-6 h-6 text-gray-700" />
              <h3>Documents</h3>
            </div>

            <!--            <button class="tbtn-icon tbtn&#45;&#45;transparent tbtn&#45;&#45;green tbtn-icon&#45;&#45;small">-->
            <!--              <IHPlus class="w-5 h-5" />-->
            <!--            </button>-->
          </div>
          <DocumentsWrapper
            class="divide-y"
            :documents="project.documents"
            :is-parsing-info-enabled="true"
            :is-sharing-enabled="true"
          >
            <template v-slot:document="slotProps">
              <DocumentRow class="px-6 py-3" v-bind="slotProps" />
            </template>
          </DocumentsWrapper>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHUserGroup class="w-6 h-6 text-gray-700" />
              <h3>Consultants</h3>
            </div>
          </div>

          <div class="card-body">
            <div v-for="consultant in project.users">
              <nuxt-link :to="`/users/${consultant.id}`" class="flex items-center">
                <div class="small-foto mr-4">
                  <LImg
                    class="flex-none flex items-center justify-center bg-blue-100 ring-white ring-1 text-blue-600 w-14 h-14 overflow-hidden"
                    :image="consultant.foto ? consultant.foto.sizes.PROFILE_IMAGE : null"
                  >
                    {{ consultant.firstname.substr(0, 1) }}{{ consultant.lastname.substr(0, 1) }}
                  </LImg>
                </div>

                <div>
                  <div>{{ consultant.firstname }} {{ consultant.lastname }}</div>
                  <div class="text-gray-500">{{ consultant.pivot.role }}</div>
                </div>
              </nuxt-link>
              <div class="!flex-none">{{ consultant.pivot.percent }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Tabs class="mt-8 mb-8" ref="candidateTabs">
      <template v-slot:header>
        <h2>Candidates</h2>
      </template>
      <Tab :title="`Placed`" v-if="projectHasPlacement && project.placed_candidate">
        <div class="mt-4 flex flex-col">
          <PlacedCandidateInProjectEmployee :candidate="project.placed_candidate" :project="project" />
        </div>
      </Tab>

      <Tab :title="`Short list · ${projectCandidates.shortlist.length}`">
        <div class="mt-4 flex flex-col">
          <TableWithSelectableColumns
            v-if="projectCandidates.shortlist.length > 0"
            :items="projectCandidates.shortlist"
            :is-pagination-on-frontend="true"
            :default-per-page="perPage"
            :available-columns="availableColumnsCandidates"
            :row-actions="rowActions"
            :default-selected-columns="defaultSelectedColumns"
            :selection-is-active="false"
            item-title="shortlist candidates for project"
            item-type="candidate"
          />
        </div>
      </Tab>

      <Tab :title="`Long list · ${projectCandidates.longlist.length}`">
        <div class="mt-4 flex flex-col">
          <TableWithSelectableColumns
            v-if="projectCandidates.longlist.length > 0"
            :items="projectCandidates.longlist"
            :is-pagination-on-frontend="true"
            :default-per-page="perPage"
            :available-columns="availableColumnsCandidates"
            :row-actions="rowActions"
            :default-selected-columns="defaultSelectedColumns"
            :selection-is-active="false"
            item-title="longlist candidates for project"
            item-type="candidate"
          />
        </div>
      </Tab>
    </Tabs>

    <div
      class="-mt-8 mb-8"
      v-if="
        projectCandidates.shortlist.length === 0 && projectCandidates.longlist.length === 0 && !project.placed_candidate
      "
    >
      There is no data to display yet.
    </div>

    <div class="mb-8" v-if="isAdmin">
      <button class="h2" @click="isHistoryExpanded = !isHistoryExpanded">Modification history (click to toggle)</button>
      <HistoryList :histories="project.histories" v-if="isHistoryExpanded" />
    </div>

    <!-- MODALS -->
    <client-only>
      <SweetModal class="modal-candidate-in-project" ref="modalCandidateInProject" title="Candidate">
        <CandidateInProjectListEmployee :project="project" :candidate="currentCandidate" class="pb-12" />
      </SweetModal>
    </client-only>

    <AddEventModal />
    <AddRevenueModal @createdNewRevenue="createdNewRevenue" @updatedRevenue="updatedRevenue" />
    <AddToBucketModal />
    <ProjectInvoiceRecipientModal ref="invoiceRecipientModal" @updatedRevenue="updatedRevenue" />
    <client-only>
      <SweetModal ref="modalCancelProject" title="Cancel project">
        <ValidationObserver
          tag="form"
          @submit.prevent="onCancelProjectSubmit()"
          ref="cancelProjectSubmitValidationObserver"
          class="space-y-6"
        >
          <div class="grid grid-cols-1 gap-4">
            <FSelectSimple
              v-model="modalCancelForm.cancelledBy"
              :nullable="false"
              label="Cancelled by"
              :options="cancelledByOptions"
            />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FTextarea label="Cancellation note (optional)" v-model="modalCancelForm.note" />
          </div>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="submit" class="tbtn tbtn--red">Cancel project</button>
          </div>
        </ValidationObserver>
      </SweetModal>

      <SweetModal ref="modalChangeStatus" :title="changeStatusModalAttrs.title">
        <ValidationObserver
          tag="form"
          @submit.prevent="onChangeStatusSubmit()"
          ref="changeStatusSubmitValidationObserver"
          class="space-y-6"
        >
          <div class="grid grid-cols-1 gap-4">
            <FTextarea label="Status note (optional)" v-model="changeStatusModalAttrs.form.note" />
          </div>

          <div class="form-action-buttons mt-0 mb-0">
            <button type="submit" class="tbtn tbtn--blue">Submit</button>
          </div>
        </ValidationObserver>
      </SweetModal>

      <SweetModal ref="modalShareProject" title="Project sharing" class="sweet-modal__ultra-wide">
        <ValidationObserver
          tag="form"
          @submit.prevent="onShareProjectSubmit()"
          ref="shareProjectDataValidationObserver"
          class="space-y-6"
        >
          <p>
            Currently implementation shares some project details and short list candidates. The generated URL is
            accessible only in combination with generated password.
          </p>
          <template v-if="project.shared_links.length === 0">
            <p class="">This project has currently no shared links.</p>
          </template>
          <template v-else>
            <TableWithSelectableColumns
              :items="project.shared_links"
              :is-pagination-on-frontend="true"
              item-title="links"
              item-type="link"
            >
              <template v-slot:table-headers>
                <td class="px-4 py-3">Link</td>
                <td class="px-4 py-3">Password</td>
                <td class="px-4 py-3">Longlist shared</td>
                <td class="px-4 py-3">Expires at</td>
                <td class="px-4 py-3">Guest views</td>
              </template>
              <template v-slot:table-data="{ item }">
                <td class="px-4 py-3">
                  <a :href="'/shared/project-short-list/' + item.token" target="_blank">
                    {{ item.token }}
                  </a>
                  <button type="button" @click="clipboardSharedLink(item)" class="text-blue-700 hover:underline">
                    (copy)
                  </button>
                </td>
                <td class="px-4 py-3 min-w-[150px]">
                  <button
                    type="button"
                    @click="clipboardSharedLinkPassword(item)"
                    class="text-blue-700 hover:underline"
                  >
                    Copy to clipboard
                  </button>
                </td>
                <td class="px-4 py-3">
                  {{ item.is_longlist_shared ? 'Yes' : 'No' }}
                </td>
                <td class="px-4 py-3 min-w-[157px]">
                  {{ item.expires_at | datetime }}
                </td>
                <td class="px-4 py-3">
                  {{ item.guest_accesses }}
                </td>
              </template>
            </TableWithSelectableColumns>
          </template>
          <h4>New Link</h4>
          <div class="flex space-x-4 items-center">
            <FInput
              v-model="shareModalForm.expiresAfterDays"
              label="How many days should the link be accessible?"
              :rules="'numeric|required'"
              errorLabel="expiration time"
              class="flex-auto"
            />
            <FCheckbox v-model="shareModalForm.isLonglistShared" label="Share longlist" class="flex-none" />
            <button type="submit" class="tbtn tbtn--blue self-center ml-4 flex-none">
              <template v-if="!shareModalForm.isSubmitting"> Create shared link</template>
              <template v-else> Creating shared link...</template>
            </button>
          </div>
        </ValidationObserver>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, namespace, State, Vue } from 'nuxt-property-decorator'

import GetProjectForView from '~/graphql/ressources/projects/GetProjectForView.gql'
import CancelProject from '~/graphql/ressources/projects/CancelProject.gql'
import PauseProject from '~/graphql/ressources/projects/PauseProject.gql'
import ResumeProject from '~/graphql/ressources/projects/ResumeProject.gql'
import ReactivateProject from '~/graphql/ressources/projects/ReactivateProject.gql'
import CompleteProject from '~/graphql/ressources/projects/CompleteProject.gql'
import ForceDeleteProject from '~/graphql/ressources/projects/ForceDeleteProject.gql'
import RestoreProject from '~/graphql/ressources/projects/RestoreProject.gql'
import ArchiveProject from '~/graphql/ressources/projects/ArchiveProject.gql'
import UnarchiveProject from '~/graphql/ressources/projects/UnarchiveProject.gql'
import GenerateProjectShareLink from '~/graphql/ressources/projects/GenerateProjectShareLink.gql'
import GetCandidatesOfProject from '~/graphql/ressources/projects/GetCandidatesOfProject.gql'
import ChangeClientLongListAccess from '~/graphql/ressources/projects/ChangeClientLongListAccess.gql'
import FCountryDialCodeAutocomplete from '@/components/admin/FCountryDialCodeAutocomplete.vue'
import {
  ArchiveProjectMutation,
  ArchiveProjectMutationVariables,
  CancelProjectMutation,
  CancelProjectMutationVariables,
  ChangeClientLongListAccessMutation,
  ChangeClientLongListAccessMutationVariables,
  CompleteProjectMutation,
  CompleteProjectMutationVariables,
  ForceDeleteProjectMutation,
  ForceDeleteProjectMutationVariables,
  GenerateProjectShareLinkMutation,
  GenerateProjectShareLinkMutationVariables,
  GetCandidatesOfProjectQuery,
  GetProjectForViewQuery,
  Maybe,
  PauseProjectMutation,
  PauseProjectMutationVariables,
  ProjectCanceller,
  ProjectSharedLink,
  ProjectStatus,
  ProjectUserPivot,
  ReactivateProjectMutation,
  ReactivateProjectMutationVariables,
  RestoreProjectMutation,
  RestoreProjectMutationVariables,
  ResumeProjectMutation,
  ResumeProjectMutationVariables,
  UnarchiveProjectMutation,
  UnarchiveProjectMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import HistoryList from '~/components/admin/HistoryList.vue'
import formatSnakeCaseString from '~/helpers/formatSnakeCaseString'
import AddEventModal from '~/components/admin/AddEventModal.vue'
import { CandidatesFilterForm, ProjectState } from '~/store'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import AddToBucketModal from '~/components/admin/AddToBucketModal.vue'
import { ValidationObserver } from '~/node_modules/vee-validate'
import copyToClipboard from '~/helpers/copyToClipboard'
import { statusTextColor } from '~/helpers/projectHelpers'
import IHOfficeBuilding from '~/components/globals/icons/heroicons/IHOfficeBuilding.vue'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import IHPlus from '~/components/globals/icons/heroicons/IHPlus.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import DocumentsWrapper from '~/components/documents/DocumentsWrapper.vue'
import DocumentRow from '~/components/documents/DocumentRow.vue'
import EventTableRow from '~/components/events/EventTableRow.vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import IHShare from '~/components/globals/icons/heroicons/IHShare.vue'
import IHUserAdd from '~/components/globals/icons/heroicons/IHUserAdd.vue'
import IHPlay from '~/components/globals/icons/heroicons/IHPlay.vue'
import IHBadgeCheck from '~/components/globals/icons/heroicons/IHBadgeCheck.vue'
import IHCollection from '~/components/globals/icons/heroicons/IHCollection.vue'
import IHX from '~/components/globals/icons/heroicons/IHX.vue'
import IHPause from '~/components/globals/icons/heroicons/IHPause.vue'
import IHRefresh from '~/components/globals/icons/heroicons/IHRefresh.vue'
import Tabs from '~/components/Tabs.vue'
import Tab from '~/components/Tab.vue'
import CandidateInProjectListEmployee from '~/components/candidates/CandidateInProjectListEmployee.vue'
import IHBriefcase from '~/components/globals/icons/heroicons/IHBriefcase.vue'
import IHUserCircle from '~/components/globals/icons/heroicons/IHUserCircle.vue'
import IHFolder from '~/components/globals/icons/heroicons/IHFolder.vue'
import IHUserGroup from '~/components/globals/icons/heroicons/IHUserGroup.vue'
import IHCalendar from '~/components/globals/icons/heroicons/IHCalendar.vue'
import PlacedCandidateInProjectEmployee from '~/components/candidates/PlacedCandidateInProjectEmployee.vue'
import IHArchive from '~/components/globals/icons/heroicons/IHArchive.vue'
import IHDuplicate from '~/components/globals/icons/heroicons/IHDuplicate.vue'
import IHDotsVertical from '~/components/globals/icons/heroicons/IHDotsVertical.vue'
import DropdownButton from '~/components/DropdownButton.vue'
import IHCash from '~/components/globals/icons/heroicons/IHCash.vue'
import RevenueTableRow from '~/components/revenue/RevenueTableRow.vue'
import AddRevenueModal from '~/components/admin/AddRevenueModal.vue'
import SlideUpDown from 'vue-slide-up-down'
import IHChevronDown from '~/components/globals/icons/heroicons/IHChevronDown.vue'
import ProjectInvoiceRecipientModal from '~/components/modals/ProjectInvoiceRecipientModal.vue'
import TableWithSelectableColumns, {
  ColumnsDefinition,
  RowActionDefinition,
} from '~/components/pages/TableWithSelectableColumns.vue'
import { DateTime } from 'luxon'
import AddEventButton from '~/components/pages/rowActions/AddEventButton.vue'
import ShowCandidateFullInfo from '~/components/pages/rowActions/ShowCandidateFullInfo.vue'

enum ModalChangeStatusTo {
  PAUSE,
  RESUME,
  COMPLETE,
  REACTIVATE,
}

@Component({
  components: {
    TableWithSelectableColumns,
    ProjectInvoiceRecipientModal,
    IHChevronDown,
    AddRevenueModal,
    RevenueTableRow,
    IHCash,
    DropdownButton,
    IHDotsVertical,
    IHDuplicate,
    IHArchive,
    PlacedCandidateInProjectEmployee,
    IHCalendar,
    IHUserGroup,
    IHFolder,
    IHUserCircle,
    IHBriefcase,
    CandidateInProjectListEmployee,
    Tab,
    Tabs,
    IHRefresh,
    IHPause,
    IHX,
    IHCollection,
    IHBadgeCheck,
    IHPlay,
    IHUserAdd,
    IHShare,
    IHPencil,
    EventTableRow,
    DocumentRow,
    DocumentsWrapper,
    IHChevronLeft,
    IHPlus,
    IHUserFilled,
    IHOfficeBuilding,
    AddToBucketModal,
    AddEventModal,
    HistoryList,
    FCountryDialCodeAutocomplete,
    ValidationObserver,
    SlideUpDown,
  },
  async asyncData({ app, route, store }) {
    const data: any = {
      projectId: Number.parseInt(route.params.id),
    }
    if (data.projectId) {
      try {
        const res = await app.apolloProvider!.defaultClient.query<GetProjectForViewQuery>({
          query: GetProjectForView,
          variables: {
            projectId: data.projectId,
          },
        })
        data.project = res.data.project
      } catch (e) {
        data.project = null
        console.error(e)
      }
    }
    store.commit('project/setProjectAdditionalData', data.project)
    store.commit('project/setClientEvents', data.project)
    return data
  },
  async fetch(this: ProjectsView) {
    if (this.projectId) {
      try {
        const res = await this.$apollo.query<GetCandidatesOfProjectQuery>({
          query: GetCandidatesOfProject,
          variables: {
            id: this.projectId,
          },
        })
        this.$store.commit('project/setProjectCandidates', res.data.project ? res.data.project.candidates : null)

        if (
          this.$refs.candidateTabs &&
          this.projectCandidates.shortlist.length === 0 &&
          this.projectCandidates.longlist.length > 0
        ) {
          this.$refs.candidateTabs.selectTab(1)
        }
      } catch (e) {
        console.error(e)
      }
    }
  },
  head() {
    let projectName = ''
    if ((this as ProjectsView).project) {
      const project = (this as ProjectsView).project!
      projectName = project.title
    }
    return {
      title: projectName,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
  },
})
export default class ProjectsView extends Vue {
  ProjectStatus = ProjectStatus
  UserRole = UserRole
  SortOrder
  projectId!: number
  project: GetProjectForViewQuery['project'] = null
  formatSnakeCaseString = formatSnakeCaseString

  $refs!: {
    modalCancelProject: any
    modalChangeStatus: any
    modalShareProject: any
    invoiceRecipientModal: ProjectInvoiceRecipientModal
    candidateTabs: any
    shareProjectDataValidationObserver: InstanceType<typeof ValidationObserver>
    modalCandidateInProject: any
  }

  @State((state) => state.project.projectCandidates)
  projectCandidates!: ProjectState['projectCandidates']

  areAllEventsVisible = false
  isAllRevenueVisible = false
  currentCandidate = null

  get availableColumnsCandidates(): ColumnsDefinition {
    return {
      title: {
        title: 'Name',
        component: 'ProjectCandidate',
        required: true,
        sorting: true,
        filter: 'InputFilter',
        itemValueForFilterAndSorting: (item) => {
          return `${item.person.lastname} ${item.person.firstname}`
        },
      },
      status: {
        title: 'Status',
        component: 'ProjectCandidateStatus',
        sorting: true,
        filter: 'InputFilter',
        itemValueForFilterAndSorting: (item) => {
          return formatSnakeCaseString(item.candidate_project_pivot.status)
        },
      },
      matching_score: {
        title: 'Matching Score',
        component: 'ProjectCandidateMatchingScore',
      },
      company: {
        title: 'Worked at companies',
        class: 'min-w-[360px]',
        component: 'CandidatesCompany',
      },
      age: {
        title: 'Age',
        component: 'Age',
        class: 'min-w-[151px]',
        sorting: true,
        filter: 'RangeFilter',
        filterValues: ['max', 'min'],
        itemValueForFilterAndSorting: (item) => {
          return Math.floor(Math.abs(DateTime.fromISO(item.person.birthdate).diffNow('years').as('years')))
        },
      },
      email: {
        title: 'Email',
        component: 'Email',
      },
      desired_position: {
        title: 'Desired position',
        component: 'DesiredPosition',
      },
      location: {
        title: 'Location',
        component: 'Location',
      },
      nationalities: {
        title: 'Nationalities',
        component: 'Nationalities',
      },
      phone: {
        title: 'Phone number',
        component: 'PhoneNumber',
      },
      salary: {
        title: 'Salary',
        component: 'ProjectCandidateSalary',
        class: 'min-w-[195px]',
        sorting: true,
        filter: 'RangeFilter',
        filterValues: ['max', 'min'],
        itemValueForFilterAndSorting: (item) => {
          return item.candidate_project_pivot.basic_salary
        },
      },
      daily_rate: {
        title: 'Daily rate',
        component: 'ProjectCandidateDailyRate',
        class: 'min-w-[165px]',
        sorting: true,
        filter: 'RangeFilter',
        filterValues: ['max', 'min'],
        itemValueForFilterAndSorting: (item) => {
          return item.candidate_project_pivot.purchasing_daily_rate
        },
      },
      notice_period: {
        title: 'Notice period / Next possible notice',
        component: 'NoticePeriod',
      },
      consented: {
        title: 'Consented on',
        component: 'ProjectCandidateConsented',
        sorting: true,
        itemValueForFilterAndSorting: (item) => {
          return item.candidate_project_pivot.consented_at
        },
      },
      industries: {
        title: 'Industries',
        class: 'min-w-[280px]',
        component: 'CandidateIndustriesMatchedMissing',
      },
      industries_additional: {
        title: 'Additional Industries',
        class: 'min-w-[280px]',
        component: 'CandidateIndustriesAdditional',
      },
      skills: {
        title: 'Skills',
        class: 'min-w-[280px]',
        component: 'CandidateSkillsMatchedMissing',
      },
      skills_additional: {
        title: 'Additional Skills',
        class: 'min-w-[280px]',
        component: 'CandidateSkillsAdditional',
      },
      certifications: {
        title: 'Certifications',
        class: 'min-w-[280px]',
        component: 'CandidateCertificationsMatchedMissing',
      },
      certifications_additional: {
        title: 'Additional Certifications',
        class: 'min-w-[280px]',
        component: 'CandidateCertificationsAdditional',
      },
      it_skills: {
        title: 'IT Skills',
        class: 'min-w-[280px]',
        component: 'CandidateItSkillsMatchedMissing',
      },
      it_skills_additional: {
        title: 'Additional IT Skills',
        class: 'min-w-[280px]',
        component: 'CandidateItSkillsAdditional',
      },
      events: {
        title: 'Events',
        class: 'min-w-[700px]',
        component: 'ProjectCandidateEvents',
      },
      client_feedback: {
        title: 'Client feedback',
        class: 'min-w-[320px]',
        component: 'ProjectCandidateClientFeedback',
      },
      list_of_cv: {
        title: 'List of CV documents',
        component: 'ListOfCV',
      },
      // last_contact: {
      //   title: 'Last contact',
      //   component: 'LastContact',
      // },
    }
  }
  defaultSelectedColumns = ['status', 'matching_score', 'company']

  get rowActions(): RowActionDefinition[] {
    return [
      {
        component: AddEventButton,
        callback: (candidate) => {
          this.$bus.openEventFormModal(candidate, this.project)
        },
      },
      {
        component: ShowCandidateFullInfo,
        callback: (candidate) => {
          this.openCandidate(candidate)
        },
      },
    ]
  }

  @State((state) => state.project.clientEvents)
  clientEvents

  @State((state) => state.account.user)
  accountUser

  myParticipationInProject: Maybe<ProjectUserPivot> = null

  modalCancelForm: {
    cancelledBy: ProjectCanceller
    note: string
  } = {
    cancelledBy: ProjectCanceller.Client,
    note: '',
  }

  shareModalForm: {
    expiresAfterDays: string
    isLonglistShared: boolean
    isSubmitting: boolean
  } = {
    expiresAfterDays: '14',
    isLonglistShared: false,
    isSubmitting: false,
  }

  changeStatusModalAttrs: {
    changeTo: ModalChangeStatusTo
    title: string
    form: {
      note: string
    }
  } = {
    changeTo: ModalChangeStatusTo.PAUSE,
    title: '',
    form: {
      note: '',
    },
  }
  isHistoryExpanded = false
  isSubmitting = false
  perPage = 20

  openCandidate(candidate) {
    this.currentCandidate = candidate
    this.$refs.modalCandidateInProject.open()
  }

  get projectHasPlacement() {
    return (
      this.project &&
      [ProjectStatus.Placed, ProjectStatus.Runner, ProjectStatus.Completed].includes(this.project.status)
    )
  }

  get isEditable() {
    return (
      this.project &&
      (([ProjectStatus.Active, ProjectStatus.Paused, ProjectStatus.Runner].includes(this.project.status) &&
        !this.project.deleted_at) ||
        this.isAdmin)
    )
  }

  get cancelledByOptions() {
    const options = {}
    options[ProjectCanceller.Client] = 'Client'
    options[ProjectCanceller.Blackbull] = 'Blackbull'
    return options
  }

  get statusTextClass() {
    if (!this.project) {
      return ''
    }
    return statusTextColor(this.project.status)
  }

  @(namespace('account').Getter('isAdmin'))
  isAdmin!: boolean

  get alwaysVisibleEvents() {
    if (!this.clientEvents) {
      return []
    }
    return this.clientEvents.slice(0, 5)
  }

  get hiddenEvents() {
    if (!this.clientEvents || this.clientEvents.length <= 5) {
      return []
    }
    return this.clientEvents.slice(5)
  }

  toggleEventsVisibility() {
    this.areAllEventsVisible = !this.areAllEventsVisible
  }

  get alwaysVisibleRevenue() {
    if (!this.project || !this.project.revenues) {
      return []
    }
    return this.project.revenues.slice(0, 5)
  }

  get hiddenRevenue() {
    if (!this.project || !this.project.revenues || this.project.revenues.length <= 5) {
      return []
    }
    return this.project.revenues.slice(5)
  }

  toggleRevenueVisibility() {
    this.isAllRevenueVisible = !this.isAllRevenueVisible
  }

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.project) {
      this.$router.replace('/projects')
      return
    }

    this.project.users.forEach((user) => {
      if (this.accountUser && user.id === this.accountUser.id) {
        this.myParticipationInProject = user.pivot!
      }
    })
  }

  addEvent(client) {
    this.$bus.openEventFormModal(client, this.project)
  }

  addRevenue() {
    this.$bus.openRevenueFormModal(this.project)
  }

  onRevenueDeleted(revenue) {
    if (!this.project) {
      return
    }

    const revenueIndex = this.project.revenues.indexOf(revenue)
    this.project.revenues.splice(revenueIndex, 1)
  }

  createdNewRevenue(revenue) {
    if (!this.project) {
      return
    }

    this.project.revenues.unshift(revenue)
    this.sortRevenueList()
  }

  updatedRevenue(revenue) {
    if (!this.project) {
      return
    }

    const revenueIndex = this.project.revenues.indexOf(revenue)
    this.project.revenues.splice(revenueIndex, 1, revenue)
    this.sortRevenueList()
  }

  sortRevenueList() {
    if (!this.project) {
      return
    }
    const revenues = this.project.revenues.slice()
    revenues.sort((a, b) => {
      const aI = a.year.toString() + a.month.toString()
      const bI = b.year.toString() + b.month.toString()
      if (aI < bI) {
        return 1
      } else if (aI > bI) {
        return -1
      } else {
        return 0
      }
    })
    this.project.revenues = revenues
  }

  addToBucket() {
    this.$bus.openAddToBucketFormModal('project', 'project', [this.project!.id])
  }

  pauseProject() {
    if (this.isSubmitting) {
      return
    }

    // reset form values
    this.changeStatusModalAttrs.changeTo = ModalChangeStatusTo.PAUSE
    this.changeStatusModalAttrs.title = 'Pause project'
    this.changeStatusModalAttrs.form.note = ''

    this.$refs.modalChangeStatus.open()
  }

  reactivateProject() {
    if (this.isSubmitting) {
      return
    }

    // reset form values
    this.changeStatusModalAttrs.changeTo = ModalChangeStatusTo.REACTIVATE
    this.changeStatusModalAttrs.title = 'Reactivate project'
    this.changeStatusModalAttrs.form.note = ''

    this.$refs.modalChangeStatus.open()
  }

  resumeProject() {
    if (this.isSubmitting) {
      return
    }

    // reset form values
    this.changeStatusModalAttrs.changeTo = ModalChangeStatusTo.RESUME
    this.changeStatusModalAttrs.title = 'Resume project'
    this.changeStatusModalAttrs.form.note = ''

    this.$refs.modalChangeStatus.open()
  }

  completeProject() {
    if (this.isSubmitting) {
      return
    }

    // reset form values
    this.changeStatusModalAttrs.changeTo = ModalChangeStatusTo.COMPLETE
    this.changeStatusModalAttrs.title = 'Complete project'
    this.changeStatusModalAttrs.form.note = ''

    this.$refs.modalChangeStatus.open()
  }

  onChangeStatusSubmit() {
    this.isSubmitting = true
    this.$refs.modalChangeStatus.close()

    const variables:
      | PauseProjectMutationVariables
      | ResumeProjectMutationVariables
      | CompleteProjectMutationVariables = {
      id: this.project!.id,
      note: this.changeStatusModalAttrs.form.note,
    }

    let sendRequestToServer
    if (this.changeStatusModalAttrs.changeTo === ModalChangeStatusTo.PAUSE) {
      sendRequestToServer = this.sendPauseProject
    } else if (this.changeStatusModalAttrs.changeTo === ModalChangeStatusTo.RESUME) {
      sendRequestToServer = this.sendResumeProject
    } else if (this.changeStatusModalAttrs.changeTo === ModalChangeStatusTo.COMPLETE) {
      sendRequestToServer = this.sendCompleteProject
    } else if (this.changeStatusModalAttrs.changeTo === ModalChangeStatusTo.REACTIVATE) {
      sendRequestToServer = this.sendReactivateProject
    }

    sendRequestToServer(variables)
      .then((project) => {
        this.isSubmitting = false
        this.project!.status = project.status
        this.project!.status_note = project.status_note
      })
      .catch((err) => {
        this.isSubmitting = false
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }

  cancelProject() {
    if (this.isSubmitting) {
      return
    }

    // reset form values
    this.modalCancelForm.cancelledBy = ProjectCanceller.Client
    this.modalCancelForm.note = ''

    this.$refs.modalCancelProject.open()
  }

  onCancelProjectSubmit() {
    this.isSubmitting = true
    this.$refs.modalCancelProject.close()

    const variables: CancelProjectMutationVariables = {
      id: this.project!.id,
      note: this.modalCancelForm.note,
      cancelled_by: this.modalCancelForm.cancelledBy,
    }

    this.$apollo
      .mutate<CancelProjectMutation>({
        mutation: CancelProject,
        variables,
      })
      .then(({ data }) => {
        this.isSubmitting = false
        this.project!.status = data!.cancelProject!.status
        this.project!.status_note = data!.cancelProject!.status_note
      })
      .catch((err) => {
        this.isSubmitting = false
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }

  forceDelete() {
    const variables: ForceDeleteProjectMutationVariables = {
      id: this.project!.id,
    }
    return this.$apollo
      .mutate<ForceDeleteProjectMutation>({
        mutation: ForceDeleteProject,
        variables,
      })
      .then(async (result) => {
        await this.$apollo.provider.defaultClient.cache.reset()
        this.$router.push('/companies')
      })
  }

  restore() {
    const variables: RestoreProjectMutationVariables = {
      id: this.project!.id,
    }
    return this.$apollo
      .mutate<RestoreProjectMutation>({
        mutation: RestoreProject,
        variables,
      })
      .then(async (result) => {
        await this.$apollo.provider.defaultClient.cache.reset()
        this.project!.deleted_at = null
      })
  }

  archiveProject() {
    return this.$apollo
      .mutate<ArchiveProjectMutation>({
        mutation: ArchiveProject,
        variables: {
          id: this.project!.id,
        } as ArchiveProjectMutationVariables,
      })
      .then(async ({ data }) => {
        await this.$apollo.provider.defaultClient.cache.reset()
        this.project!.archived_at = data!.archiveProject!.archived_at
      })
  }

  unarchiveProject() {
    return this.$apollo
      .mutate<UnarchiveProjectMutation>({
        mutation: UnarchiveProject,
        variables: {
          id: this.project!.id,
        } as UnarchiveProjectMutationVariables,
      })
      .then(async () => {
        await this.$apollo.provider.defaultClient.cache.reset()
        this.project!.archived_at = null
      })
  }

  openShareProjectModal() {
    this.shareModalForm.isSubmitting = false
    this.shareModalForm.expiresAfterDays = '14'
    this.shareModalForm.isLonglistShared = false

    this.$refs.modalShareProject.open()
  }

  clipboardSharedLink(sharedLink: ProjectSharedLink) {
    copyToClipboard(location.origin + '/shared/project-short-list/' + sharedLink.token)
  }

  clipboardSharedLinkPassword(sharedLink: ProjectSharedLink) {
    copyToClipboard(sharedLink.password)
  }

  onShareProjectSubmit() {
    if (this.shareModalForm.isSubmitting) {
      return
    }
    this.shareModalForm.isSubmitting = true
    const variables: GenerateProjectShareLinkMutationVariables = {
      project_id: this.project!.id,
      expires_after_days: parseInt(this.shareModalForm.expiresAfterDays),
      is_longlist_shared: this.shareModalForm.isLonglistShared,
    }

    this.$apollo
      .mutate<GenerateProjectShareLinkMutation>({
        mutation: GenerateProjectShareLink,
        variables,
      })
      .then(({ data }) => {
        this.shareModalForm.isLonglistShared = false
        this.shareModalForm.expiresAfterDays = '14'

        this.project!.shared_links.push(data!.generateProjectShareLink)

        copyToClipboard(location.origin + '/shared/project-short-list/' + data!.generateProjectShareLink.token)
        this.$apollo.provider.defaultClient.clearStore()
        this.shareModalForm.isSubmitting = false
      })
      .catch((err) => {
        this.shareModalForm.isSubmitting = false
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }

  changeClientLongListAccess(clientId: number, newValue: boolean) {
    if (this.isSubmitting) {
      return
    }
    this.isSubmitting = true
    this.$apollo
      .mutate<ChangeClientLongListAccessMutation>({
        mutation: ChangeClientLongListAccess,
        variables: {
          projectId: this.projectId,
          clientId,
          newValue,
        } as ChangeClientLongListAccessMutationVariables,
      })
      .then(({ data }) => {
        this.project!.clients.find(
          (client) => client.id === clientId
        )!.client_project_pivot!.has_long_list_access = data!.updateProject!.clients.find(
          (client) => client.id === clientId
        )!.client_project_pivot!.has_long_list_access
      })
      .catch((err) => {
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
      .finally(() => {
        this.isSubmitting = false
      })
  }

  openInvoiceRecipientModal(revenueId) {
    this.$refs.invoiceRecipientModal.open(revenueId)
  }

  private async sendPauseProject(variables: PauseProjectMutationVariables) {
    const { data } = await this.$apollo.mutate<PauseProjectMutation>({
      mutation: PauseProject,
      variables,
    })
    return data!.pauseProject
  }

  private async sendResumeProject(variables: ResumeProjectMutationVariables) {
    const { data } = await this.$apollo.mutate<ResumeProjectMutation>({
      mutation: ResumeProject,
      variables,
    })
    return data!.resumeProject
  }

  private async sendReactivateProject(variables: ReactivateProjectMutationVariables) {
    const { data } = await this.$apollo.mutate<ReactivateProjectMutation>({
      mutation: ReactivateProject,
      variables,
    })
    return data!.reactivateProject
  }

  private async sendCompleteProject(variables: CompleteProjectMutationVariables) {
    const { data } = await this.$apollo.mutate<CompleteProjectMutation>({
      mutation: CompleteProject,
      variables,
    })
    return data!.completeProject
  }
}
</script>
<style lang="scss">
.modal-candidate-in-project {
  & > .sweet-modal {
    @apply max-w-none w-full;
    & > .sweet-content {
      height: calc(100vh - 64px);
      @apply max-h-[none] flex overflow-auto items-start bg-gray-100;
      & > .sweet-content-content {
        @apply min-h-full;
      }
      & .sweet-modal-overlay {
        @apply w-full;
      }
    }
  }
}
</style>
