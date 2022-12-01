<template>
  <div v-if="candidate" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/candidates" class="tbtn-icon tbtn--white" v-if="isEmployee">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>

      <h1>
        {{ candidate.person.title }} {{ candidate.person.firstname }} {{ candidate.person.other_firstnames }}
        {{ candidate.person.lastname }}
      </h1>
      <div class="flex items-center space-x-2">
        <nuxt-link :to="`/candidates/${candidate.id}/form`" class="tbtn-icon tbtn--blue" v-tooltip="'Edit'">
          <IHPencil class="w-6 h-6" />
        </nuxt-link>
        <DropdownButton v-if="isEmployee">
          <template #items>
            <button
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-green-700 hover:bg-green-100"
              type="button"
              @click="addToProject"
              v-if="!candidate.deleted_at && isEmployee"
            >
              <IHPlus class="w-5 h-5 mr-3" />
              Add to project
            </button>
            <button
              class="flex items-center px-4 py-2 text-sm text-gray-700 outline-none hover:text-blue-700 hover:bg-blue-100"
              type="button"
              @click="addToBucket"
            >
              <IHCollection class="w-5 h-5 mr-3" />
              Add to bucket
            </button>
          </template>
        </DropdownButton>
      </div>
    </div>

    <template v-if="isEmployee">
      <div class="alert alert-danger" v-if="candidate.deleted_at">
        This candidate was deleted at {{ candidate.deleted_at | datetime }}, therefore it is not editable! You can
        <button class="underline" type="button" @click="restore">restore</button>
        <template v-if="isAdmin">
          or
          <button class="underline" type="button" @click="forceDelete">force delete</button>
        </template>
        this candidate.
      </div>

      <div class="alert alert-danger" v-if="candidate.is_blacklisted">
        This candidate is blacklisted.
        <span v-if="candidate.blacklisting_reason">Blacklisting reason:</span>
        <p class="whitespace-pre-wrap">{{ candidate.blacklisting_reason }}</p>
      </div>

      <InviteCandidateOrClientToCreateAccount :model="candidate" />

      <div class="alert alert-info" v-if="candidate.person.client_id">
        This candidate is also our client.
        <nuxt-link :to="`/clients/${candidate.person.client_id}`">Show client profile</nuxt-link>
      </div>

      <div class="alert alert-warning" v-if="candidate.is_research">
        This is a research candidate without detailed information.
      </div>
    </template>

    <div class="grid gap-6 mb-8 grid-cols-1 xl:grid-cols-11">
      <div class="xl:col-span-6 flex flex-col space-y-6">
        <div class="card">
          <div class="card-header">
            <div>
              <h3>Candidate information</h3>
            </div>
          </div>
          <div class="card-body">
            <div v-if="candidate.person.title">
              <span class="card-item-title first-col-1-4">Title</span>
              <span>{{ candidate.person.title }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-4">Firstname</span>
              <span>{{ candidate.person.firstname }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-4">Lastname</span>
              <span>{{ candidate.person.lastname }}</span>
            </div>
            <div v-if="candidate.person.other_firstnames">
              <span class="card-item-title first-col-1-4">Other firstnames</span>
              <span>{{ candidate.person.other_firstnames }}</span>
            </div>
            <div v-if="candidate.person.birth_name">
              <span class="card-item-title first-col-1-4">Birth name</span>
              <span>{{ candidate.person.birth_name }}</span>
            </div>
            <div v-if="candidate.person.birthdate">
              <span class="card-item-title first-col-1-4">Birthdate</span>
              <span>{{ dateFilter(candidate.person.birthdate) }}</span>
            </div>
            <div v-if="candidate.person.gender">
              <span class="card-item-title first-col-1-4">Gender</span>
              <span>{{ candidate.person.gender }}</span>
            </div>
            <div v-if="candidate.marital_status">
              <span class="card-item-title first-col-1-4">Marital status</span>
              <span>{{ candidate.marital_status }}</span>
            </div>
            <div v-if="candidate.nationalities.length > 0">
              <span class="card-item-title first-col-1-4">Nationalities</span>
              <span>
                <ul class="space-y-2">
                  <li v-for="nationality in candidate.nationalities" :key="nationality.id">
                    <span>{{ nationality.name }}</span>
                  </li>
                </ul>
              </span>
            </div>
            <div v-if="candidate.languages.length > 0">
              <span class="card-item-title first-col-1-4">Languages</span>
              <span>
                <ul class="space-y-2">
                  <li v-for="language in candidate.languages" :key="language.code">
                    <span>{{ language.name }}</span>
                    <span class="text-gray-500" v-if="language.language_pivot.level">
                      &middot; {{ language.language_pivot.level | formatSnakeCaseString }}
                    </span>
                  </li>
                </ul>
              </span>
            </div>
            <div v-if="candidate.industries.length > 0">
              <span class="card-item-title first-col-1-4">Industries</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/industries/${industry.id}`"
                  v-for="industry in candidate.industries"
                  :key="`ind_${industry.id}`"
                >
                  {{ industry.title }}
                </nuxt-link>
              </span>
            </div>
            <div v-if="candidate.skills.length > 0">
              <span class="card-item-title first-col-1-4">Skills</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/skills/${skill.id}`"
                  v-for="skill in candidate.skills"
                  :key="`skill_${skill.id}`"
                >
                  {{ skill.title }}
                </nuxt-link>
              </span>
            </div>
            <div v-if="candidate.certifications.length > 0">
              <span class="card-item-title first-col-1-4">Certifications</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/certifications/${certification.id}`"
                  v-for="certification in candidate.certifications"
                  :key="`certification_${certification.id}`"
                >
                  {{ certification.title }}
                </nuxt-link>
              </span>
            </div>
            <div v-if="candidate.it_skills.length > 0">
              <span class="card-item-title first-col-1-4">IT Skills</span>
              <span class="-mb-2 -mr-2">
                <nuxt-link
                  class="tbadge tbadge--blue mr-2 mb-2"
                  :to="`/it-skills/${itSkill.id}`"
                  v-for="itSkill in candidate.it_skills"
                  :key="`it-skill_${itSkill.id}`"
                >
                  {{ itSkill.title }}
                </nuxt-link>
              </span>
            </div>
            <div v-if="isEmployee && candidate.notes">
              <span class="card-item-title first-col-1-4">Notes</span>
              <span class="whitespace-pre-wrap">{{ candidate.notes }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3>Contact information</h3>
            </div>
          </div>
          <div class="card-body">
            <div v-if="candidate.email">
              <span class="card-item-title first-col-1-4">Email</span>
              <a :href="`mailto:${candidate.email}`">{{ candidate.email }}</a>
            </div>
            <div v-if="candidate.skype_name">
              <span class="card-item-title first-col-1-4">Skype ID</span>
              <span>{{ candidate.skype_name }}</span>
            </div>
            <div v-if="candidate.zoom_id">
              <span class="card-item-title first-col-1-4">Zoom ID</span>
              <a :href="`https://zoom.us/j/${candidate.zoom_id}`">{{ candidate.zoom_id }}</a>
            </div>
            <div v-if="candidate.linked_in_profile">
              <span class="card-item-title first-col-1-4">LinkedIn</span>
              <a :href="sanitizedLinkedInProfile" target="_blank">{{ candidate.linked_in_profile }}</a>
            </div>
            <div v-if="candidate.xing_profile">
              <span class="card-item-title first-col-1-4">XING</span>
              <a :href="sanitizedXingProfile" target="_blank">{{ candidate.xing_profile }}</a>
            </div>
            <div v-if="candidate.url">
              <span class="card-item-title first-col-1-4">URL</span>
              <a :href="sanitizedUrl" target="_blank">{{ candidate.url }}</a>
            </div>
            <div v-if="candidate.location">
              <span class="card-item-title first-col-1-4">Location</span>
              <span>
                {{ candidate.location.full_address }}
              </span>
            </div>
            <div v-if="candidate.phonenumbers.length > 0">
              <span class="card-item-title first-col-1-4">Phonenumbers</span>
              <span>
                <ul class="space-y-2">
                  <li v-for="phonenumber in candidate.phonenumbers" :key="phonenumber.id">
                    <a :href="`tel:${phonenumber.dial_code} ${phonenumber.number}`">
                      {{ phonenumber.dial_code }} {{ phonenumber.number }}
                    </a>
                    {{ phonenumber.label ? ` - ${phonenumber.label}` : '' }}
                  </li>
                </ul>
              </span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3>Job preferences</h3>
            </div>
          </div>
          <div class="card-body">
            <div v-if="candidate.desired_job">
              <span class="card-item-title first-col-1-3">Desired position</span>
              <span>{{ candidate.desired_job }}</span>
            </div>
            <div v-if="candidate.max_distance_from_home">
              <span class="card-item-title first-col-1-3">Maximum distance from home</span>
              <span>{{ candidate.max_distance_from_home }}km</span>
            </div>
            <div v-if="candidate.willing_to_travel">
              <span class="card-item-title first-col-1-3">Travel willingness</span>
              <span>{{ candidate.willing_to_travel }}%</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <h3>Education</h3>
            </div>
          </div>
          <div class="divide-y">
            <div class="card-body" v-for="education in candidate.educations" :key="education.id">
              <div>
                <span class="card-item-title first-col-1-3">Institution</span>
                <span>{{ education.institution.name }}</span>
              </div>
              <div v-if="education.main_field_of_study">
                <span class="card-item-title first-col-1-3">Main field of study</span>
                <span>{{ education.main_field_of_study }}</span>
              </div>
              <div v-if="education.additional_fields_of_study.length > 0">
                <span class="card-item-title first-col-1-3">Additional fields of study</span>
                <span>
                  <ul class="space-y-2">
                    <li v-for="fieldsIfStudy in education.additional_fields_of_study" :key="fieldsIfStudy">
                      <span>{{ fieldsIfStudy }}</span>
                    </li>
                  </ul>
                </span>
              </div>
              <div v-if="education.from">
                <span class="card-item-title first-col-1-3">From</span>
                <span>{{ dateFilter(education.from) }}</span>
              </div>
              <div v-if="education.till">
                <span class="card-item-title first-col-1-3">Till</span>
                <span>{{ dateFilter(education.till) }}</span>
              </div>
              <div v-if="education.degree">
                <span class="card-item-title first-col-1-3">Degree</span>
                <span>{{ education.degree }}</span>
              </div>
              <div v-if="education.final_grade">
                <span class="card-item-title first-col-1-3">Final grade</span>
                <span>{{ education.final_grade }}</span>
              </div>
              <div v-if="education.notes">
                <span class="card-item-title first-col-1-3">Notes</span>
                <span class="whitespace-pre-wrap">{{ education.notes }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <h3>Worked at companies</h3>
            </div>
          </div>
          <div class="divide-y">
            <nuxt-link
              :to="`/companies/${companyPivot.company.id}`"
              class="p-6 flex items-center"
              v-for="companyPivot in candidate.worked_at_companies"
              :key="companyPivot.id"
            >
              <div class="small-foto mr-4">
                <LImg :image="companyPivot.company.logo ? companyPivot.company.logo.sizes.PROFILE_IMAGE : null">
                  <IHUserFilled class="w-12 h-12 text-gray-400 mt-3" />
                </LImg>
              </div>
              <div class="flex flex-col">
                <div class="flex items-center">
                  <span class="tbadge tbadge--red mr-2" v-if="companyPivot.company.deleted_at">DELETED</span>
                  {{ companyPivot.company.name }}
                </div>
                <div class="mt-0.5 text-gray-600">
                  {{ companyPivot.job_title }}<br />
                  <span class="text-xs">{{ companyPivot.job_level | formatSnakeCaseString }}</span>
                </div>
                <div class="mt-0.5 text-gray-500">
                  <template v-if="companyPivot.from && !companyPivot.till">
                    From {{ companyPivot.from | date }}</template
                  >
                  <template v-else-if="companyPivot.from && companyPivot.till">
                    {{ companyPivot.from | date }} - {{ companyPivot.till | date }}
                  </template>
                  <template v-else-if="!companyPivot.from && companyPivot.till">
                    Till {{ companyPivot.till | date }}
                  </template>
                </div>
                <div
                  class="space-y-2"
                  v-if="companyPivot.main_responsibilities && companyPivot.main_responsibilities.length > 0"
                >
                  <div v-for="item in companyPivot.main_responsibilities" :key="item">
                    <span>{{ item }}</span>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>

      <div class="xl:col-span-5 flex flex-col space-y-6">
        <div class="card">
          <div class="card-body">
            <div class="flex justify-center">
              <div class="relative !flex-none">
                <LImg
                  class="!flex-none w-48 h-48 border-gray-400 border-2 overflow-hidden rounded-full bg-gray-200"
                  :image="candidate.person.foto ? candidate.person.foto.sizes.PROFILE_IMAGE : null"
                >
                  <IHUserFilled class="w-48 h-48 text-gray-400 mt-12" />
                </LImg>

                <span
                  class="tbadge--icon tbadge--red ring-1 ring-red-700 absolute -right-6 top-12"
                  v-if="candidate.caution"
                  v-tooltip="{ content: 'At least in 1 project beyond first interview!', classes: ['tooltip--red'] }"
                >
                  <IHExclamation class="w-7 h-7" />
                </span>
                <span
                  class="tbadge--icon tbadge--green ring-1 ring-green-700 absolute right-0 top-1"
                  v-if="candidate.was_placed"
                  v-tooltip="{ content: 'At least 1 time placed', classes: ['tooltip--green'] }"
                >
                  <IHCash class="w-7 h-7" />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="card" v-if="candidate.is_interim">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHBriefcase class="w-6 h-6 text-gray-700" />
              <h3>Interim conditions</h3>
            </div>
          </div>
          <div class="card-body">
            <div v-if="candidate.available_from">
              <span class="card-item-title first-col-1-3">Available from</span>
              <span>{{ dateFilter(candidate.available_from) }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Has hourly rate</span>
              <span>{{ candidate.has_hourly_rate ? 'Yes' : 'No' }}</span>
            </div>
            <div v-if="candidate.has_hourly_rate">
              <span class="card-item-title first-col-1-3">Hourly rate</span>
              <span>{{ (candidate.daily_rate / 8) | currency }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Daily rate</span>
              <span>{{ candidate.daily_rate | currency }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Expenses</span>
              <span>{{ candidate.expenses_included ? 'Included' : 'Not included' }}</span>
            </div>
          </div>
        </div>

        <div class="card" v-if="candidate.is_permanent">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHBriefcase class="w-6 h-6 text-gray-700" />
              <h3>Permanent conditions</h3>
            </div>
          </div>
          <div class="card-body">
            <div v-if="candidate.period_of_notice">
              <span class="card-item-title first-col-1-3">Notice period</span>
              <span>{{ noticePeriodFilter(candidate.period_of_notice) }}</span>
            </div>
            <div v-if="candidate.next_possible_notice_to">
              <span class="card-item-title first-col-1-3">Next possible notice</span>
              <span>{{ dateFilter(candidate.next_possible_notice_to) }}</span>
            </div>
            <div>
              <span class="card-item-title first-col-1-3">Business car</span>
              <span>{{ candidate.is_business_car_included ? 'Included' : 'Not included' }}</span>
            </div>
            <div v-if="candidate.basic_salary">
              <span class="card-item-title first-col-1-3">Basic salary</span>
              <span>{{ candidate.basic_salary | currency }}</span>
            </div>
            <div v-if="candidate.bonus_eur">
              <span class="card-item-title first-col-1-3">Bonus</span>
              <span>{{ candidate.bonus_eur | currency }}</span>
            </div>
            <div v-if="candidate.other_bonus">
              <span class="card-item-title first-col-1-3">Other bonuses</span>
              <span>{{ candidate.other_bonus | currency }}</span>
            </div>
            <div v-if="candidate.basic_salary || candidate.bonus_eur">
              <span class="card-item-title first-col-1-3">Salary package</span>
              <span>{{ (candidate.basic_salary + candidate.bonus_eur) | currency }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHFolder class="w-6 h-6 text-gray-700" />
              <h3>Documents</h3>
            </div>
          </div>
          <DocumentsWrapper
            class="divide-y"
            :documents="candidate.documents"
            :is-parsing-info-enabled="true"
            :is-sharing-enabled="true"
          >
            <template v-slot:document="slotProps">
              <DocumentRow class="px-6 py-3" v-bind="slotProps" />
            </template>
          </DocumentsWrapper>
        </div>

        <div v-if="isEmployee" class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHBriefcase class="w-6 h-6 text-gray-700" />
              <h3>
                Projects
                <span class="text-gray-500">&middot; {{ candidate.projects.length }}</span>
              </h3>
            </div>
            <div class="space-x-4 flex items-center">
              <button
                class="tbtn-icon tbtn--white tbtn-icon--small"
                @click="toggleProjectsVisibility"
                v-if="hiddenProjects.length > 0"
              >
                <span
                  class="transform transition duration-300 ease-in-out"
                  :class="{ 'rotate-180': areAllProjectsVisible }"
                >
                  <IHChevronDown class="w-5 h-5" />
                </span>
              </button>
              <button
                class="tbtn-icon tbtn--green tbtn-icon--small"
                @click="addToProject"
                v-if="!candidate.deleted_at"
              >
                <IHPlus class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div v-if="candidate.projects.length > 0">
            <table class="card-body w-full">
              <tr class="text-left">
                <th class="w-1/2">Title</th>
                <th class="w-1/2">Status</th>
                <th class="w-8"></th>
              </tr>
              <tr v-for="project in alwaysVisibleProjects">
                <td class="w-1/2">
                  <span class="tbadge tbadge--red" v-if="project.deleted_at">DELETED</span>
                  <nuxt-link :to="`/projects/${project.id}`">
                    {{ project.title }}
                  </nuxt-link>
                </td>
                <td class="w-1/2">
                  <span :class="'border px-2.5 py-0.5 rounded-full ' + statusTextClass(project.status)">
                    {{ project.status | formatSnakeCaseString }}
                  </span>
                </td>
                <td class="w-8">
                  <div class="flex justify-end">
                    <button
                      class="tbtn-icon tbtn--green tbtn-icon--small relative"
                      @click="addEvent(project)"
                      v-tooltip="{ content: 'Add Event', classes: ['tooltip--green'] }"
                    >
                      <IHCalendar class="w-4 h-4 relative -left-[3px] -bottom-0.5" />
                      <IHPlus class="w-4 h-4 absolute right-0 top-0.5" />
                    </button>
                  </div>
                </td>
              </tr>
            </table>
            <SlideUpDown class="border-t ease-in-out" :active="areAllProjectsVisible" :duration="350">
              <table class="card-body w-full">
                <tr v-for="project in hiddenProjects">
                  <td class="w-1/2">
                    <span class="tbadge tbadge--red" v-if="project.deleted_at">DELETED</span>
                    <nuxt-link :to="`/projects/${project.id}`">
                      {{ project.title }}
                    </nuxt-link>
                  </td>
                  <td class="w-1/2">
                    <span :class="'border px-2.5 py-0.5 rounded-full ' + statusTextClass(project.status)">
                      {{ project.status | formatSnakeCaseString }}
                    </span>
                  </td>
                  <td class="w-8">
                    <div class="flex justify-end">
                      <button
                        class="tbtn-icon tbtn--green tbtn-icon--small relative"
                        @click="addEvent(project)"
                        v-tooltip="{ content: 'Add Event', classes: ['tooltip--green'] }"
                      >
                        <IHCalendar class="w-4 h-4 relative -left-[3px] -bottom-0.5" />
                        <IHPlus class="w-4 h-4 absolute right-0 top-0.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </table>
            </SlideUpDown>
          </div>
        </div>

        <div v-if="isEmployee" class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHCalendar class="w-6 h-6 text-gray-700" />
              <h3>
                Events with candidate
                <span class="text-gray-500">&middot; {{ candidateEvents.length }}</span>
              </h3>
            </div>
            <div class="space-x-4 flex items-center">
              <button
                class="tbtn-icon tbtn--white tbtn-icon--small"
                @click="toggleEventsVisibility"
                v-if="hiddenEvents.length > 0"
              >
                <span
                  class="transform transition duration-300 ease-in-out"
                  :class="{ 'rotate-180': areAllEventsVisible }"
                >
                  <IHChevronDown class="w-5 h-5" />
                </span>
              </button>
              <button class="tbtn-icon tbtn--green tbtn-icon--small" @click="addEvent()">
                <IHPlus class="w-5 h-5" />
              </button>
            </div>
          </div>
          <table class="bg-white w-full overflow-hidden rounded-b-lg">
            <tbody class="divide-y">
              <EventTableRow
                class=""
                v-for="event in alwaysVisibleEvents"
                :event="event"
                :key="`candidateEvent_${event.id}`"
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
                  :key="`candidateEvent_${event.id}`"
                ></EventTableRow>
              </tbody>
            </table>
          </SlideUpDown>
        </div>
      </div>
    </div>

    <div class="mb-8" v-if="isAdmin">
      <button class="h2" @click="isHistoryExpanded = !isHistoryExpanded">Modification history (click to toggle)</button>
      <HistoryList :histories="candidate.histories" v-if="isHistoryExpanded" />
    </div>

    <template v-if="isEmployee">
      <AddToBucketModal />
      <AddEventModal />
      <client-only>
        <SweetModal ref="modalAddToProject" title="Add candidate to project">
          <ValidationObserver
            tag="form"
            @submit.prevent="onAddToProjectSubmit()"
            ref="addToProjectValidationObserver"
            class="space-y-6"
          >
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
              <FActiveProjectAutocomplete
                v-model="selectedProject"
                label="Project"
                :rules="'required'"
                errorLabel="project"
                :projects="projectsForLonglist"
              />
            </div>

            <p class="text-gray-600 pb-32">
              NOTE: Autocomplete contains only suitable projects for the candidate. E.g. if candidate works just as
              interim, only projects that requires interim are showed! If candidate is already in longlist, project will
              not be listed!
            </p>

            <div class="form-action-buttons mt-0 mb-0">
              <button type="submit" class="tbtn tbtn--blue">
                <template v-if="!isSubmittingAddToProject"> Add to longlist</template>
                <template v-else> Adding to longlist...</template>
              </button>
            </div>
          </ValidationObserver>
        </SweetModal>
      </client-only>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, namespace, State, Vue } from 'nuxt-property-decorator'

import GetCandidateForView from '~/graphql/ressources/candidates/GetCandidateForView.gql'
import GetProjectsForAutocompleteForLonglist from '~/graphql/ressources/projects/GetProjectsForAutocompleteForLonglist.gql'
import AddCandidateToProject from '~/graphql/ressources/candidates/AddCandidateToProject.gql'
import {
  AddCandidateToProjectMutation,
  AddCandidateToProjectMutationVariables,
  GetCandidateForViewQuery,
  GetProjectsForAutocompleteForLonglistQuery,
  GetProjectsForAutocompleteForLonglistQueryVariables,
  UserRole,
  Maybe,
  ForceDeleteCandidateMutationVariables,
  ForceDeleteCandidateMutation,
  RestoreCandidateMutationVariables,
  RestoreCandidateMutation, Project,
} from '~/graphql/GQLTypes'
import HistoryList from '~/components/admin/HistoryList.vue'
import formatSnakeCaseString from '~/helpers/formatSnakeCaseString'
import AddEventModal from '~/components/admin/AddEventModal.vue'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import FActiveProjectAutocomplete from '~/components/admin/FActiveProjectAutocomplete.vue'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import ForceDeleteCandidate from '~/graphql/ressources/candidates/ForceDeleteCandidate.gql'
import RestoreCandidate from '~/graphql/ressources/candidates/RestoreCandidate.gql'
import AddToBucketModal from '~/components/admin/AddToBucketModal.vue'
import InviteCandidateOrClientToCreateAccount from '~/components/admin/InviteCandidateOrClientToCreateAccount.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import IHPlus from '~/components/globals/icons/heroicons/IHPlus.vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import EventTableRow from '~/components/events/EventTableRow.vue'
import IHBriefcase from '~/components/globals/icons/heroicons/IHBriefcase.vue'
import IHFolder from '~/components/globals/icons/heroicons/IHFolder.vue'
import DocumentRow from '~/components/documents/DocumentRow.vue'
import SlideUpDown from 'vue-slide-up-down'
import DocumentsWrapper from '~/components/documents/DocumentsWrapper.vue'
import IHCalendar from '~/components/globals/icons/heroicons/IHCalendar.vue'
import IHChevronDown from '~/components/globals/icons/heroicons/IHChevronDown.vue'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
import DropdownButton from '~/components/DropdownButton.vue'
import IHCollection from '~/components/globals/icons/heroicons/IHCollection.vue'
import IHExclamation from '~/components/globals/icons/heroicons/IHExclamation.vue'
import IHCash from '~/components/globals/icons/heroicons/IHCash.vue'
import sanitizeUrl from '~/helpers/sanitizeUrl'
import { statusTextColor } from '~/helpers/projectHelpers'

@Component({
  components: {
    IHCash,
    IHExclamation,
    IHCollection,
    DropdownButton,
    IHUserFilled,
    IHChevronDown,
    IHCalendar,
    DocumentsWrapper,
    DocumentRow,
    IHFolder,
    IHBriefcase,
    EventTableRow,
    IHPencil,
    IHPlus,
    IHChevronLeft,
    InviteCandidateOrClientToCreateAccount,
    AddToBucketModal,
    FActiveProjectAutocomplete,
    AddEventModal,
    HistoryList,
    ValidationObserver,
    SlideUpDown,
  },
  async asyncData({ app, route, store, redirect }) {
    const data: any = {
      candidateId: Number.parseInt(route.params.id),
    }

    if (data.candidateId) {
      try {
        const res = await app.apolloProvider!.defaultClient.query<GetCandidateForViewQuery>({
          query: GetCandidateForView,
          variables: {
            id: data.candidateId,
          },
        })
        data.candidate = res.data.candidate
      } catch (e) {
        console.error(e)
        data.candidate = null
      }
    }

    // redirect to overview, if queried id was not found
    if (!data.candidate) {
      return redirect(404, '/candidates')
    }
    store.commit('candidate/setEvents', data.candidate ? data.candidate.events : [])
    return data
  },
  head() {
    let candidateName = ''
    if ((this as CandidatesView).candidate) {
      const candidate = (this as CandidatesView).candidate!
      candidateName =
        (candidate.person.title ? candidate.person.title + ' ' : '') +
        candidate.person.firstname +
        ' ' +
        candidate.person.lastname
    }
    return {
      title: candidateName,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.Employee,
    allowAlsoFor: {
      userPath: 'candidate.id',
      routePath: 'params.id',
    },
  },
})
export default class CandidatesView extends Vue {
  $refs!: {
    modalAddToProject: any
    addToProjectValidationObserver: InstanceType<typeof ValidationObserver>
  }

  UserRole = UserRole
  candidate: GetCandidateForViewQuery['candidate'] = null
  publicUrl = this.$config.publicUrl
  dateFilter = this.$options.filters!.date
  noticePeriodFilter = this.$options.filters!.noticePeriod
  formatSnakeCaseString = formatSnakeCaseString

  @State((state) => state.candidate.events)
  candidateEvents

  @(namespace('account').Getter('isCandidate'))
  isCandidate!: boolean

  @(namespace('account').Getter('isAdmin'))
  isAdmin!: boolean

  @(namespace('account').Getter('isEmployee'))
  isEmployee!: boolean

  projectsForLonglist: GetProjectsForAutocompleteForLonglistQuery['projectsForAutocompleteForLonglist'] = []
  selectedProject: Maybe<GetProjectsForAutocompleteForLonglistQuery['projectsForAutocompleteForLonglist'][0]> = null
  isSubmittingAddToProject = false
  isHistoryExpanded = false

  areAllEventsVisible = false
  areAllProjectsVisible = false

  get alwaysVisibleEvents() {
    if (!this.candidate) {
      return []
    }
    return this.candidateEvents.slice(0, 5)
  }

  get hiddenEvents() {
    if (!this.candidate || this.candidateEvents.length <= 5) {
      return []
    }
    return this.candidateEvents.slice(5)
  }

  get sanitizedLinkedInProfile() {
    return sanitizeUrl(this.candidate?.linked_in_profile)
  }

  get sanitizedXingProfile() {
    return sanitizeUrl(this.candidate?.xing_profile)
  }

  get sanitizedUrl() {
    return sanitizeUrl(this.candidate?.url)
  }

  toggleEventsVisibility() {
    this.areAllEventsVisible = !this.areAllEventsVisible
  }

  get alwaysVisibleProjects() {
    if (!this.candidate || !this.candidate.projects) {
      return []
    }
    return this.candidate.projects.filter((project) => project.status == 'ACTIVE' || project.status == 'PLACED')
  }

  get hiddenProjects() {
    if (
      !this.candidate ||
      !this.candidate.projects ||
      this.alwaysVisibleProjects.length == this.candidate.projects.length
    ) {
      return []
    }
    return this.candidate.projects.filter((project) => project.status !== 'ACTIVE' && project.status !== 'PLACED')
  }

  toggleProjectsVisibility() {
    this.areAllProjectsVisible = !this.areAllProjectsVisible
  }

  statusTextClass(projectStatus) {
    return statusTextColor(projectStatus)
  }

  mounted() {}


  addEvent(project?: Project) {
    this.$bus.openEventFormModal(this.candidate, project)
  }

  addToProject() {
    // reset selected project
    this.selectedProject = null

    // get projects for autocomplete
    this.$apollo
      .query<GetProjectsForAutocompleteForLonglistQuery>({
        query: GetProjectsForAutocompleteForLonglist,
        variables: {
          candidateId: this.candidate!.id,
        } as GetProjectsForAutocompleteForLonglistQueryVariables,
      })
      .then(({ data }) => {
        this.projectsForLonglist = data.projectsForAutocompleteForLonglist
      })

    // open modal
    this.$refs.modalAddToProject.open()
  }

  addToBucket() {
    this.$bus.openAddToBucketFormModal('candidate', 'candidate', [this.candidate!.id])
  }

  forceDelete() {
    const variables: ForceDeleteCandidateMutationVariables = {
      id: this.candidate!.id,
    }
    return this.$apollo
      .mutate<ForceDeleteCandidateMutation>({
        mutation: ForceDeleteCandidate,
        variables,
      })
      .then(async (result) => {
        await this.$apollo.provider.defaultClient.cache.reset()
        this.$router.push('/candidates')
      })
  }

  restore() {
    const variables: RestoreCandidateMutationVariables = {
      id: this.candidate!.id,
    }
    return this.$apollo
      .mutate<RestoreCandidateMutation>({
        mutation: RestoreCandidate,
        variables,
      })
      .then(async (result) => {
        await this.$apollo.provider.defaultClient.cache.reset()
        this.candidate!.deleted_at = null
      })
  }

  async onAddToProjectSubmit() {
    if (this.isSubmittingAddToProject) {
      return
    }

    if (!(await validateObserver(this.$refs.addToProjectValidationObserver))) {
      return
    }

    this.isSubmittingAddToProject = true
    this.$apollo
      .mutate<AddCandidateToProjectMutation>({
        mutation: AddCandidateToProject,
        variables: {
          projectId: this.selectedProject!.id,
          candidateId: this.candidate!.id,
        } as AddCandidateToProjectMutationVariables,
      })
      .then(({ data }) => {
        this.isSubmittingAddToProject = false
        this.$apollo.provider.defaultClient.clearStore()
        this.$refs.modalAddToProject.close()
        this.$bus.showSuccessModal(
          `Candidate was successfully added to longlist of ${this.selectedProject!.title}`,
          3000
        )
      })
      .catch((err) => {
        this.isSubmittingAddToProject = false
        this.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  }
}
</script>
