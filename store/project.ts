import { ActionTree, GetterTree, MutationTree } from 'vuex'
import {
  AdditionalCandidateData,
  ButtonStatus,
  CalculatedTagsObject,
  CandidateInList,
  ProjectsFilterForm,
  ProjectState,
  RootState,
  SuitableCandidate,
  TagTitleWithSynonymReferenceMap,
} from './index'
import {
  AddCandidateToProjectMutation,
  AddCandidateToProjectMutationVariables,
  CandidateProjectPivotInput,
  CreateEventMutation,
  GetCandidatesOfProjectQuery,
  GetClientsForAutocompleteQuery,
  GetCompaniesForAutocompleteQuery,
  GetProjectForViewQuery,
  GetProjectsQuery,
  GetProjectsQueryVariables,
  GetSuitableCandidatesForProjectQuery,
  Maybe,
  MoveCandidateToShortlistMutation,
  MoveCandidateToShortlistMutationVariables,
  OnHoldCandidateInProjectMutation,
  OnHoldCandidateInProjectMutationVariables,
  ReactivateCandidateInProjectMutation,
  ReactivateCandidateInProjectMutationVariables,
  RefreshDataAfterPlacingEventQuery,
  RejectCandidateByBlackbullMutation,
  RejectCandidateByBlackbullMutationVariables,
  RejectCandidateByCandidateMutation,
  RejectCandidateByCandidateMutationVariables,
  RejectCandidateByClientMutation,
  RejectCandidateByClientMutationVariables,
  RemoveCandidateFromLonglistMutation,
  RemoveCandidateFromLonglistMutationVariables,
  RemoveCandidateFromShortlistMutation,
  RemoveCandidateFromShortlistMutationVariables,
  SendConsentToCandidateInProjectMutation,
  SendConsentToCandidateInProjectMutationVariables,
  SortOrder,
  ThumbDownCandidateByClientMutation,
  ThumbDownCandidateByClientMutationVariables,
  ThumbUpCandidateByClientMutation,
  ThumbUpCandidateByClientMutationVariables,
  UpdateCandidateNotesWithinProjectMutation,
  UpdateCandidateNotesWithinProjectMutationVariables,
  UpdateCandidateProjectPivotMutation,
  UpdateCandidateProjectPivotMutationVariables,
} from '~/graphql/GQLTypes'
import RemoveCandidateFromLonglist from '@/graphql/ressources/candidates/RemoveCandidateFromLonglist.gql'
import RemoveCandidateFromShortlist from '@/graphql/ressources/candidates/RemoveCandidateFromShortlist.gql'
import MoveCandidateToShortlist from '@/graphql/ressources/candidates/MoveCandidateToShortlist.gql'
import AddCandidateToProject from '@/graphql/ressources/candidates/AddCandidateToProject.gql'
import RejectCandidateByBlackbull from '@/graphql/ressources/candidates/RejectCandidateByBlackbull.gql'
import RejectCandidateByClient from '@/graphql/ressources/candidates/RejectCandidateByClient.gql'
import RejectCandidateByCandidate from '@/graphql/ressources/candidates/RejectCandidateByCandidate.gql'
import OnHoldCandidateInProject from '@/graphql/ressources/candidates/OnHoldCandidateInProject.gql'
import ReactivateCandidateInProject from '@/graphql/ressources/candidates/ReactivateCandidateInProject.gql'
import ThumbUpCandidateByClient from '@/graphql/ressources/candidates/ThumbUpCandidateByClient.gql'
import ThumbDownCandidateByClient from '@/graphql/ressources/candidates/ThumbDownCandidateByClient.gql'
import SendConsentToCandidateInProject from '@/graphql/ressources/candidates/SendConsentToCandidateInProject.gql'
import UpdateCandidateNotesWithinProject from '@/graphql/ressources/candidates/UpdateCandidateNotesWithinProject.gql'
import UpdateCandidateProjectPivot from '@/graphql/ressources/candidates/UpdateCandidateProjectPivot.gql'
import GetProjects from '~/graphql/ressources/projects/GetProjects.gql'
import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import { IdWithTitle } from '~/helpers/types'

// NOTE: this file contains many duplication of code in mutations and actions. It was intentionally made for the case,
// if later on some specific currentPage comes extra logic! So don't rage about less code quality ;)

export const state = (): ProjectState => ({
  prefilledForCreation: {
    client: undefined,
    company: undefined,
  },
  clientEvents: [],
  projectAdditionalData: {
    industriesMap: new Map(),
    skillsMap: new Map(),
    certificationsMap: new Map(),
    itSkillsMap: new Map(),
    maxPossibleScore: 0,
    scoreMultiplicators: {
      industry: 1,
      skill: 2,
      certification: 0,
      itSkill: 0,
    },
  },
  projectCandidates: {
    map: new Map(),
    suitable: undefined,
    longlist: [],
    shortlist: [],
  },
  sharedProject: {
    token: '',
    password: '',
  },
  projectsOverviewFilters: {
    title: null,
    user_autocomplete: undefined,
    with_archived: false,
    statuses: [],
    industries: [],
    skills: [],
    daily_rate_min: null,
    daily_rate_max: null,
    salary_package_min: null,
    salary_package_max: null,
    project_start_from: null,
    project_start_till: null,
    page: 1,
  },
})

export const getters: GetterTree<ProjectState, RootState> = {}

export const mutations: MutationTree<ProjectState> = {
  setClient(localState, client: GetClientsForAutocompleteQuery['clientsInCompany'][0]) {
    localState.prefilledForCreation.client = client
  },
  setCompany(localState, company: NonNullable<GetCompaniesForAutocompleteQuery['companies']>['data'][0]) {
    localState.prefilledForCreation.company = company
  },
  resetPrefilledForCreation(localState) {
    localState.prefilledForCreation.client = undefined
    localState.prefilledForCreation.company = undefined
  },

  // region DETAILED PROJECT VIEW AND WORKING WITH LISTS
  setProjectAdditionalData(localState, project: GetProjectForViewQuery['project']) {
    localState.projectCandidates.longlist = []
    localState.projectCandidates.shortlist = []
    localState.projectCandidates.suitable = undefined
    localState.projectCandidates.map.clear()
    localState.projectAdditionalData.industriesMap.clear()
    localState.projectAdditionalData.skillsMap.clear()
    localState.projectAdditionalData.certificationsMap.clear()
    localState.projectAdditionalData.itSkillsMap.clear()
    localState.projectAdditionalData.maxPossibleScore = 0

    if (!project) {
      return
    }

    project.industries.forEach((industry) => {
      localState.projectAdditionalData.industriesMap.set(industry.id, {
        title: industry.title,
      })
      localState.projectAdditionalData.maxPossibleScore += localState.projectAdditionalData.scoreMultiplicators.industry

      industry.synonyms.forEach((industrySynonym) => {
        localState.projectAdditionalData.industriesMap.set(industrySynonym.id, {
          title: industrySynonym.title,
          synonymOfId: industry.id,
        })
      })
    })

    project.skills.forEach((skill) => {
      localState.projectAdditionalData.skillsMap.set(skill.id, {
        title: skill.title,
      })

      localState.projectAdditionalData.maxPossibleScore += localState.projectAdditionalData.scoreMultiplicators.skill

      skill.synonyms.forEach((skillSynonym) => {
        localState.projectAdditionalData.skillsMap.set(skillSynonym.id, {
          title: skillSynonym.title,
          synonymOfId: skill.id,
        })
      })
    })

    project.certifications.forEach((certification) => {
      localState.projectAdditionalData.certificationsMap.set(certification.id, certification.title)
      localState.projectAdditionalData.maxPossibleScore +=
        localState.projectAdditionalData.scoreMultiplicators.certification
    })

    project.it_skills.forEach((itSkill) => {
      localState.projectAdditionalData.itSkillsMap.set(itSkill.id, {
        title: itSkill.title,
      })
      localState.projectAdditionalData.maxPossibleScore += localState.projectAdditionalData.scoreMultiplicators.itSkill

      itSkill.synonyms.forEach((itSkillSynonym) => {
        localState.projectAdditionalData.itSkillsMap.set(itSkillSynonym.id, {
          title: itSkillSynonym.title,
          synonymOfId: itSkill.id,
        })
      })
    })
  },
  setProjectCandidates(localState, candidates: NonNullable<GetCandidatesOfProjectQuery['project']>['candidates']) {
    if (!candidates) {
      return
    }

    candidates
      .map(
        (candidate) =>
          projectCandidateHelpers.createCandidateWithAdditionalData(localState, candidate) as CandidateInList
      )
      .forEach((candidate) => {
        localState.projectCandidates.map.set(candidate.id, candidate)
        localState.projectCandidates.longlist.push(candidate)
        if (candidate.candidate_project_pivot!.is_shortlisted) {
          localState.projectCandidates.shortlist.push(candidate)
        }
      })
    localState.projectCandidates.longlist.sort((a, b) => b.matchingScore - a.matchingScore)
    localState.projectCandidates.shortlist.sort((a, b) => b.matchingScore - a.matchingScore)
  },
  setSuitableCandidates(
    localState,
    data: {
      candidates: NonNullable<GetSuitableCandidatesForProjectQuery['suitableCandidatesForProject']>['data']
    }
  ) {
    if (!data) {
      localState.projectCandidates.suitable = undefined
      return
    }
    localState.projectCandidates.suitable = []
    data.candidates
      .map(
        (candidate) =>
          projectCandidateHelpers.createCandidateWithAdditionalData(localState, candidate) as SuitableCandidate
      )
      .forEach((candidate) => {
        localState.projectCandidates.suitable!.push(candidate)
      })
    // localState.projectCandidates.suitable.sort((a, b) => b.matchingScore - a.matchingScore)
  },
  movedToShortlist(localState, payload: { candidate: CandidateInList; gqlResponse: MoveCandidateToShortlistMutation }) {
    payload.candidate.buttonStatus.addToShortlist = ButtonStatus.PROCESSED
    payload.candidate.buttonStatus.removeFromShortlist = ButtonStatus.ACTIVE

    payload.candidate.candidate_project_pivot!.is_shortlisted = payload.gqlResponse!.moveCandidateToShortlist!.candidate_project_pivot!.is_shortlisted
    payload.candidate.candidate_project_pivot!.status = payload.gqlResponse!.moveCandidateToShortlist!.candidate_project_pivot!.status

    localState.projectCandidates.shortlist.push(payload.candidate)
    localState.projectCandidates.shortlist.sort((a, b) => b.matchingScore - a.matchingScore)
  },
  updateCandidateProjectPivot(localState, payload: { candidate: CandidateInList; pivot: CandidateProjectPivotInput }) {
    if (payload.candidate.buttonStatus) {
      payload.candidate.buttonStatus.changeConditions = ButtonStatus.ACTIVE
    }

    payload.candidate.candidate_project_pivot!.basic_salary = payload.pivot.basic_salary
    payload.candidate.candidate_project_pivot!.bonus_eur = payload.pivot.bonus_eur
    payload.candidate.candidate_project_pivot!.purchasing_daily_rate = payload.pivot.purchasing_daily_rate
    payload.candidate.candidate_project_pivot!.retail_daily_rate = payload.pivot.retail_daily_rate
  },
  removedFromShortlist(
    localState,
    payload: { candidate: CandidateInList; gqlResponse: RemoveCandidateFromShortlistMutation }
  ) {
    payload.candidate.buttonStatus.removeFromShortlist = ButtonStatus.PROCESSED
    payload.candidate.buttonStatus.removeFromLonglist = ButtonStatus.ACTIVE
    payload.candidate.buttonStatus.addToShortlist = ButtonStatus.ACTIVE
    payload.candidate.buttonStatus.onHold = ButtonStatus.ACTIVE

    payload.candidate.candidate_project_pivot!.is_shortlisted = payload.gqlResponse!.removeCandidateFromShortlist!.candidate_project_pivot!.is_shortlisted
    payload.candidate.candidate_project_pivot!.status = payload.gqlResponse!.removeCandidateFromShortlist!.candidate_project_pivot!.status

    localState.projectCandidates.shortlist.splice(localState.projectCandidates.shortlist.indexOf(payload.candidate), 1)
  },
  removedFromLonglist(localState, payload: { candidate: CandidateInList }) {
    payload.candidate.buttonStatus.removeFromLonglist = ButtonStatus.PROCESSED
    payload.candidate.buttonStatus.addToLonglist = ButtonStatus.ACTIVE
  },
  addedToLonglist(localState, payload: { candidate: CandidateInList }) {
    payload.candidate.buttonStatus.addToLonglist = ButtonStatus.PROCESSED
    payload.candidate.buttonStatus.removeFromLonglist = ButtonStatus.ACTIVE
    payload.candidate.buttonStatus.addToShortlist = ButtonStatus.ACTIVE
    payload.candidate.buttonStatus.onHold = ButtonStatus.ACTIVE
  },
  markButtonAs(localState, payload: { candidate: CandidateInList; button: string; status: ButtonStatus }) {
    payload.candidate.buttonStatus[payload.button] = payload.status
  },
  rejectedCandidate(
    localState,
    payload: {
      candidate: CandidateInList
      gqlResponse: RejectCandidateByCandidateMutation['rejectCandidateByCandidate']
    }
  ) {
    payload.candidate.buttonStatus.reject = ButtonStatus.PROCESSED
    payload.candidate.buttonStatus.reactivate = ButtonStatus.ACTIVE

    payload.candidate.candidate_project_pivot!.status = payload.gqlResponse!.candidate.candidate_project_pivot!.status
  },
  onHeldCandidate(
    localState,
    payload: {
      candidate: CandidateInList
      gqlResponse: OnHoldCandidateInProjectMutation['onHoldCandidateInProject']
    }
  ) {
    payload.candidate.buttonStatus.onHold = ButtonStatus.PROCESSED

    payload.candidate.candidate_project_pivot!.status = payload.gqlResponse!.candidate.candidate_project_pivot!.status
  },
  reactivatedCandidate(
    localState,
    payload: {
      candidate: CandidateInList
      gqlResponse: ReactivateCandidateInProjectMutation['reactivateCandidateInProject']
    }
  ) {
    payload.candidate.buttonStatus.reactivate = ButtonStatus.PROCESSED
    payload.candidate.buttonStatus.reject = ButtonStatus.ACTIVE
    payload.candidate.buttonStatus.removeFromLonglist = ButtonStatus.ACTIVE

    payload.candidate.candidate_project_pivot!.status = payload.gqlResponse!.candidate.candidate_project_pivot!.status
  },
  thumbUpCandidate(
    localState,
    payload: {
      candidate: CandidateInList
      gqlResponse: ThumbUpCandidateByClientMutation['thumbUpCandidateByClient']
    }
  ) {
    payload.candidate.buttonStatus.thumbUp = ButtonStatus.PROCESSED
    payload.candidate.buttonStatus.thumbDown = ButtonStatus.ACTIVE

    payload.candidate.candidate_project_pivot!.liked_by_client = payload.gqlResponse!.candidate.candidate_project_pivot!.liked_by_client
  },
  thumbDownCandidate(
    localState,
    payload: {
      candidate: CandidateInList
      gqlResponse: ThumbDownCandidateByClientMutation['thumbDownCandidateByClient']
    }
  ) {
    payload.candidate.buttonStatus.thumbDown = ButtonStatus.PROCESSED
    payload.candidate.buttonStatus.thumbUp = ButtonStatus.ACTIVE

    payload.candidate.candidate_project_pivot!.liked_by_client = payload.gqlResponse!.candidate.candidate_project_pivot!.liked_by_client
  },
  updateConsentData(
    localState,
    payload: {
      candidate: CandidateInList
      gqlResponse: SendConsentToCandidateInProjectMutation['sendConsentToCandidateInProject']
    }
  ) {
    payload.candidate.buttonStatus.consent = ButtonStatus.PROCESSED

    payload.candidate.candidate_project_pivot!.consent_sent_at = payload.gqlResponse!.consent_sent_at
    payload.candidate.candidate_project_pivot!.consent_sent_to_email = payload.gqlResponse!.consent_sent_to_email
  },
  refreshCandidateInProjectData(
    localState,
    payload: {
      candidate: CandidateInList
      data: NonNullable<NonNullable<RefreshDataAfterPlacingEventQuery['project']>['candidate']>
    }
  ) {
    const candidate = localState.projectCandidates.map.get(payload.candidate.id) as CandidateInList
    if (!candidate) {
      console.warn('could not find any candidate in localState!')
      return
    }
    candidate.was_placed = payload.data.was_placed
    candidate.caution = payload.data.caution
    candidate.candidate_project_pivot!.status = payload.data.candidate_project_pivot!.status
  },
  updateClientNotesForCandidateWithinProject(
    localState,
    payload: {
      candidate: CandidateInList
      gqlResponse: UpdateCandidateNotesWithinProjectMutation['updateCandidateNotesWithinProject']
    }
  ) {
    payload.candidate.candidate_project_pivot!.client_notes = payload.gqlResponse!.candidate_project_pivot!.client_notes
  },
  // endregion

  // region EVENTS
  setClientEvents(localState, project: GetProjectForViewQuery['project']) {
    localState.clientEvents = project ? project.client_events : []
  },
  addEventToCandidateInList(
    localState,
    payload: { event: CreateEventMutation['createEvent']; candidate: CandidateInList }
  ) {
    if (!payload.candidate.events_in_project) {
      return
    }
    payload.candidate.events_in_project.unshift(payload.event)
    payload.candidate.events_in_project.sort((a, b) => {
      if (a.happened_at < b.happened_at) return 1
      if (a.happened_at > b.happened_at) return -1
      return 0
    })
  },
  addClientEvent(localState, payload: { event: CreateEventMutation['createEvent'] }) {
    localState.clientEvents.unshift(payload.event)
    localState.clientEvents.sort((a, b) => {
      if (a.happened_at < b.happened_at) return 1
      if (a.happened_at > b.happened_at) return -1
      return 0
    })
  },
  removeClientEvent(localState, eventId: number) {
    const eventIndex = localState.clientEvents.findIndex((event) => event.id === eventId)
    if (eventIndex !== -1) {
      localState.clientEvents.splice(eventIndex, 1)
    }
  },
  // endregion
  setSharedProject(localState, sharedProject: { token: string; password: string }) {
    localState.sharedProject = sharedProject
  },
  setProjectsOverviewFilters(localState, projectsOverviewFilters: ProjectsFilterForm) {
    localState.projectsOverviewFilters = projectsOverviewFilters
  },
}

export const actions: ActionTree<ProjectState, RootState> = {
  moveToShortlist(
    { commit },
    payload: {
      candidate: CandidateInList
      projectId: number
      basic_salary: Maybe<number>
      bonus_eur: Maybe<number>
      purchasing_daily_rate: Maybe<number>
      retail_daily_rate: Maybe<number>
    }
  ) {
    commit('markButtonAs', { candidate: payload.candidate, button: 'addToShortlist', status: ButtonStatus.PROCESSING })
    const variables: MoveCandidateToShortlistMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
      pivot: {
        basic_salary: payload.basic_salary,
        bonus_eur: payload.bonus_eur,
        purchasing_daily_rate: payload.purchasing_daily_rate,
        retail_daily_rate: payload.retail_daily_rate,
      },
    }
    this.app
      .apolloProvider!.defaultClient.mutate<MoveCandidateToShortlistMutation>({
        mutation: MoveCandidateToShortlist,
        variables,
      })
      .then(({ data }) => {
        commit('movedToShortlist', { candidate: payload.candidate, gqlResponse: data })
        commit('updateCandidateProjectPivot', {
          candidate: payload.candidate,
          pivot: data!.moveCandidateToShortlist!.candidate_project_pivot,
        })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        commit('markButtonAs', { candidate: payload.candidate, button: 'addToShortlist', status: ButtonStatus.ACTIVE })
        console.log(err)
      })
  },
  updateCandidateProjectPivot(
    { commit },
    payload: {
      candidate: CandidateInList
      projectId: number
      basic_salary: Maybe<number>
      bonus_eur: Maybe<number>
      purchasing_daily_rate: Maybe<number>
      retail_daily_rate: Maybe<number>
    }
  ) {
    if (payload.candidate.buttonStatus) {
      commit('markButtonAs', {
        candidate: payload.candidate,
        button: 'changeConditions',
        status: ButtonStatus.PROCESSING,
      })
    }
    const variables: UpdateCandidateProjectPivotMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
      pivot: {
        basic_salary: payload.basic_salary,
        bonus_eur: payload.bonus_eur,
        purchasing_daily_rate: payload.purchasing_daily_rate,
        retail_daily_rate: payload.retail_daily_rate,
      },
    }
    this.app
      .apolloProvider!.defaultClient.mutate<UpdateCandidateProjectPivotMutation>({
        mutation: UpdateCandidateProjectPivot,
        variables,
      })
      .then(({ data }) => {
        commit('updateCandidateProjectPivot', {
          candidate: payload.candidate,
          pivot: data!.updateCandidateProjectPivot!.candidate_project_pivot,
        })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        if (payload.candidate.buttonStatus) {
          commit('markButtonAs', {
            candidate: payload.candidate,
            button: 'changeConditions',
            status: ButtonStatus.ACTIVE,
          })
        }
        console.log(err)
      })
  },
  removeFromShortlist({ commit }, payload: { candidate: CandidateInList; projectId: number }) {
    commit('markButtonAs', {
      candidate: payload.candidate,
      button: 'removeFromShortlist',
      status: ButtonStatus.PROCESSING,
    })
    const variables: RemoveCandidateFromShortlistMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
    }

    this.app
      .apolloProvider!.defaultClient.mutate<RemoveCandidateFromShortlistMutation>({
        mutation: RemoveCandidateFromShortlist,
        variables,
      })
      .then(({ data }) => {
        commit('removedFromShortlist', { candidate: payload.candidate, gqlResponse: data })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        commit('markButtonAs', {
          candidate: payload.candidate,
          button: 'removeFromShortlist',
          status: ButtonStatus.ACTIVE,
        })
        console.log(err)
      })
  },
  removeFromLonglist({ commit }, payload: { candidate: CandidateInList; projectId: number }) {
    commit('markButtonAs', {
      candidate: payload.candidate,
      button: 'removeFromLonglist',
      status: ButtonStatus.PROCESSING,
    })
    const variables: RemoveCandidateFromLonglistMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
    }

    this.app
      .apolloProvider!.defaultClient.mutate<RemoveCandidateFromLonglistMutation>({
        mutation: RemoveCandidateFromLonglist,
        variables,
      })
      .then(() => {
        commit('removedFromLonglist', { candidate: payload.candidate })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        commit('markButtonAs', {
          candidate: payload.candidate,
          button: 'removeFromLonglist',
          status: ButtonStatus.ACTIVE,
        })
        console.log(err)
      })
  },
  addToLonglist({ commit }, payload: { candidate: CandidateInList; projectId: number }) {
    commit('markButtonAs', {
      candidate: payload.candidate,
      button: 'addToLonglist',
      status: ButtonStatus.PROCESSING,
    })
    const variables: AddCandidateToProjectMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
    }

    this.app
      .apolloProvider!.defaultClient.mutate<AddCandidateToProjectMutation>({
        mutation: AddCandidateToProject,
        variables,
      })
      .then(() => {
        commit('addedToLonglist', { candidate: payload.candidate })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        commit('markButtonAs', {
          candidate: payload.candidate,
          button: 'addToLonglist',
          status: ButtonStatus.ACTIVE,
        })
        console.log(err)
      })
  },
  rejectCandidateByCandidate({ commit }, payload: { candidate: CandidateInList; projectId: number; note?: string }) {
    commit('markButtonAs', {
      candidate: payload.candidate,
      button: 'reject',
      status: ButtonStatus.PROCESSING,
    })
    const variables: RejectCandidateByCandidateMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
      note: payload.note,
    }

    this.app
      .apolloProvider!.defaultClient.mutate<RejectCandidateByCandidateMutation>({
        mutation: RejectCandidateByCandidate,
        variables,
      })
      .then(({ data }) => {
        commit('rejectedCandidate', { candidate: payload.candidate, gqlResponse: data!.rejectCandidateByCandidate })
        commit('addEventToCandidateInList', {
          candidate: payload.candidate,
          event: data!.rejectCandidateByCandidate!.event,
        })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        commit('markButtonAs', {
          candidate: payload.candidate,
          button: 'reject',
          status: ButtonStatus.ACTIVE,
        })
        console.log(err)
      })
  },
  rejectCandidateByClient({ commit }, payload: { candidate: CandidateInList; projectId: number; note?: string }) {
    commit('markButtonAs', {
      candidate: payload.candidate,
      button: 'reject',
      status: ButtonStatus.PROCESSING,
    })
    const variables: RejectCandidateByClientMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
      note: payload.note,
    }

    this.app
      .apolloProvider!.defaultClient.mutate<RejectCandidateByClientMutation>({
        mutation: RejectCandidateByClient,
        variables,
      })
      .then(({ data }) => {
        commit('rejectedCandidate', { candidate: payload.candidate, gqlResponse: data!.rejectCandidateByClient })
        commit('addEventToCandidateInList', {
          candidate: payload.candidate,
          event: data!.rejectCandidateByClient!.event,
        })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        commit('markButtonAs', {
          candidate: payload.candidate,
          button: 'reject',
          status: ButtonStatus.ACTIVE,
        })
        console.log(err)
      })
  },
  rejectCandidateByBlackbull({ commit }, payload: { candidate: CandidateInList; projectId: number; note?: string }) {
    commit('markButtonAs', {
      candidate: payload.candidate,
      button: 'reject',
      status: ButtonStatus.PROCESSING,
    })
    const variables: RejectCandidateByBlackbullMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
      note: payload.note,
    }

    this.app
      .apolloProvider!.defaultClient.mutate<RejectCandidateByBlackbullMutation>({
        mutation: RejectCandidateByBlackbull,
        variables,
      })
      .then(({ data }) => {
        commit('rejectedCandidate', { candidate: payload.candidate, gqlResponse: data!.rejectCandidateByBlackbull })
        commit('addEventToCandidateInList', {
          candidate: payload.candidate,
          event: data!.rejectCandidateByBlackbull!.event,
        })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        commit('markButtonAs', {
          candidate: payload.candidate,
          button: 'reject',
          status: ButtonStatus.ACTIVE,
        })
        console.log(err)
      })
  },
  onHoldCandidateInProject({ commit }, payload: { candidate: CandidateInList; projectId: number; note?: string }) {
    commit('markButtonAs', {
      candidate: payload.candidate,
      button: 'onHold',
      status: ButtonStatus.PROCESSING,
    })
    const variables: OnHoldCandidateInProjectMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
      note: payload.note,
    }

    this.app
      .apolloProvider!.defaultClient.mutate<OnHoldCandidateInProjectMutation>({
        mutation: OnHoldCandidateInProject,
        variables,
      })
      .then(({ data }) => {
        commit('onHeldCandidate', { candidate: payload.candidate, gqlResponse: data!.onHoldCandidateInProject })
        commit('addEventToCandidateInList', {
          candidate: payload.candidate,
          event: data!.onHoldCandidateInProject!.event,
        })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        commit('markButtonAs', {
          candidate: payload.candidate,
          button: 'onHold',
          status: ButtonStatus.ACTIVE,
        })
        console.log(err)
      })
  },
  reactivateCandidateInProject({ commit }, payload: { candidate: CandidateInList; projectId: number; note?: string }) {
    commit('markButtonAs', {
      candidate: payload.candidate,
      button: 'reactivate',
      status: ButtonStatus.PROCESSING,
    })
    const variables: ReactivateCandidateInProjectMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
      note: payload.note,
    }

    this.app
      .apolloProvider!.defaultClient.mutate<ReactivateCandidateInProjectMutation>({
        mutation: ReactivateCandidateInProject,
        variables,
      })
      .then(({ data }) => {
        commit('reactivatedCandidate', {
          candidate: payload.candidate,
          gqlResponse: data!.reactivateCandidateInProject,
        })
        commit('addEventToCandidateInList', {
          candidate: payload.candidate,
          event: data!.reactivateCandidateInProject!.event,
        })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        commit('markButtonAs', {
          candidate: payload.candidate,
          button: 'reactivate',
          status: ButtonStatus.ACTIVE,
        })
        console.error(err)
      })
  },
  updateClientNoteForCandidateInProject(
    { commit },
    payload: { candidate: CandidateInList; projectId: number; note?: string }
  ) {
    const variables: UpdateCandidateNotesWithinProjectMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
      note: payload.note,
    }

    return this.app
      .apolloProvider!.defaultClient.mutate<UpdateCandidateNotesWithinProjectMutation>({
        mutation: UpdateCandidateNotesWithinProject,
        variables,
      })
      .then(({ data }) => {
        commit('updateClientNotesForCandidateWithinProject', {
          candidate: payload.candidate,
          gqlResponse: data!.updateCandidateNotesWithinProject,
        })
      })
      .catch((err) => {
        console.error(err)
      })
  },
  thumbUpCandidateByClient({ commit }, payload: { candidate: CandidateInList; projectId: number; note?: string }) {
    commit('markButtonAs', {
      candidate: payload.candidate,
      button: 'thumbUp',
      status: ButtonStatus.PROCESSING,
    })
    const variables: ThumbUpCandidateByClientMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
      note: payload.note,
    }

    this.app
      .apolloProvider!.defaultClient.mutate<ThumbUpCandidateByClientMutation>({
        mutation: ThumbUpCandidateByClient,
        variables,
      })
      .then(({ data }) => {
        commit('thumbUpCandidate', { candidate: payload.candidate, gqlResponse: data!.thumbUpCandidateByClient })
        commit('addEventToCandidateInList', {
          candidate: payload.candidate,
          event: data!.thumbUpCandidateByClient!.event,
        })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        commit('markButtonAs', {
          candidate: payload.candidate,
          button: 'thumbUp',
          status: ButtonStatus.ACTIVE,
        })
        console.log(err)
      })
  },
  thumbDownCandidateByClient({ commit }, payload: { candidate: CandidateInList; projectId: number; note?: string }) {
    commit('markButtonAs', {
      candidate: payload.candidate,
      button: 'thumbDown',
      status: ButtonStatus.PROCESSING,
    })
    const variables: ThumbDownCandidateByClientMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
      note: payload.note,
    }

    this.app
      .apolloProvider!.defaultClient.mutate<ThumbDownCandidateByClientMutation>({
        mutation: ThumbDownCandidateByClient,
        variables,
      })
      .then(({ data }) => {
        commit('thumbDownCandidate', { candidate: payload.candidate, gqlResponse: data!.thumbDownCandidateByClient })
        commit('addEventToCandidateInList', {
          candidate: payload.candidate,
          event: data!.thumbDownCandidateByClient!.event,
        })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        commit('markButtonAs', {
          candidate: payload.candidate,
          button: 'thumbDown',
          status: ButtonStatus.ACTIVE,
        })
        console.log(err)
      })
  },
  sendConsentRequest({ commit }, payload: { candidate: CandidateInList; projectId: number }) {
    commit('markButtonAs', {
      candidate: payload.candidate,
      button: 'consent',
      status: ButtonStatus.PROCESSING,
    })
    const variables: SendConsentToCandidateInProjectMutationVariables = {
      candidateId: payload.candidate.id,
      projectId: payload.projectId,
    }

    this.app
      .apolloProvider!.defaultClient.mutate<SendConsentToCandidateInProjectMutation>({
        mutation: SendConsentToCandidateInProject,
        variables,
      })
      .then(({ data }) => {
        commit('updateConsentData', {
          candidate: payload.candidate,
          gqlResponse: data!.sendConsentToCandidateInProject,
        })
        this.app.apolloProvider!.defaultClient.clearStore()
      })
      .catch((err) => {
        commit('markButtonAs', {
          candidate: payload.candidate,
          button: 'consent',
          status: ButtonStatus.ACTIVE,
        })
        this.app.$bus.showErrorModal({
          errors: apolloParseErrors(err),
        })
      })
  },
  async fetchProjects({ state, rootState }) {
    const variables: GetProjectsQueryVariables = {
      first: 40,
      orderBy: [
        {
          column: 'updated_at',
          order: SortOrder.Desc,
        },
      ],
      page: state.projectsOverviewFilters.page,
      filter: {
        title: state.projectsOverviewFilters.title,
        with_archived: state.projectsOverviewFilters.with_archived,
        industries: state.projectsOverviewFilters.industries.map((item) => item.id),
        skills: state.projectsOverviewFilters.skills.map((item) => item.id),
        daily_rate_min: state.projectsOverviewFilters.daily_rate_min,
        daily_rate_max: state.projectsOverviewFilters.daily_rate_max,
        salary_package_min: state.projectsOverviewFilters.salary_package_min,
        salary_package_max: state.projectsOverviewFilters.salary_package_max,
        project_start_from: state.projectsOverviewFilters.project_start_from,
        project_start_till: state.projectsOverviewFilters.project_start_till,
        statuses: state.projectsOverviewFilters.statuses.map((option) => option.id),
      },
    }

    if (state.projectsOverviewFilters.user_autocomplete) {
      variables.filter!.user_id = state.projectsOverviewFilters.user_autocomplete.id
    }

    return this.app.apolloProvider!.defaultClient.query<GetProjectsQuery>({
      query: GetProjects,
      variables,
    })
  },
}

const projectCandidateHelpers = {
  createCandidateWithAdditionalData(
    localState: ProjectState,
    candidate:
      | NonNullable<GetCandidatesOfProjectQuery['project']>['candidates'][0]
      | NonNullable<GetSuitableCandidatesForProjectQuery['suitableCandidatesForProject']>['data'][0]
  ): CandidateInList | SuitableCandidate {
    const additionalData: AdditionalCandidateData = {
      industriesCalculated: {
        original: new Map(),
        match: [],
        missing: [],
        extra: [],
      },
      skillsCalculated: {
        original: new Map(),
        match: [],
        missing: [],
        extra: [],
      },
      certificationsCalculated: {
        original: new Map(),
        match: [],
        missing: [],
        extra: [],
      },
      itSkillsCalculated: {
        original: new Map(),
        match: [],
        missing: [],
        extra: [],
      },
      matchingScore: 0,
      buttonStatus: {
        addToLonglist: ButtonStatus.ACTIVE,
        removeFromLonglist: ButtonStatus.ACTIVE,
        addToShortlist: ButtonStatus.ACTIVE,
        removeFromShortlist: ButtonStatus.ACTIVE,
        reject: ButtonStatus.ACTIVE,
        reactivate: ButtonStatus.ACTIVE,
        onHold: ButtonStatus.ACTIVE,
        changeConditions: ButtonStatus.ACTIVE,
        thumbUp: ButtonStatus.ACTIVE,
        thumbDown: ButtonStatus.ACTIVE,
        consent: ButtonStatus.ACTIVE,
      },
    }

    projectCandidateHelpers.matchTagsWithSynonyms(
      candidate.industries,
      localState.projectAdditionalData.industriesMap,
      additionalData.industriesCalculated,
      additionalData,
      localState.projectAdditionalData.scoreMultiplicators.industry
    )

    projectCandidateHelpers.matchTagsWithSynonyms(
      candidate.skills,
      localState.projectAdditionalData.skillsMap,
      additionalData.skillsCalculated,
      additionalData,
      localState.projectAdditionalData.scoreMultiplicators.skill
    )

    projectCandidateHelpers.matchTags(
      candidate.certifications,
      localState.projectAdditionalData.certificationsMap,
      additionalData.certificationsCalculated,
      additionalData,
      localState.projectAdditionalData.scoreMultiplicators.certification
    )

    projectCandidateHelpers.matchTagsWithSynonyms(
      candidate.it_skills,
      localState.projectAdditionalData.itSkillsMap,
      additionalData.itSkillsCalculated,
      additionalData,
      localState.projectAdditionalData.scoreMultiplicators.itSkill
    )

    return {
      ...candidate,
      ...additionalData,
    }
  },
  matchTags(
    tagsArray,
    projectTagsMap,
    candidateCalculatedObject,
    additionalData?: AdditionalCandidateData,
    matchingFactor = 1
  ) {
    tagsArray.forEach((tag) => {
      candidateCalculatedObject.original.set(tag.id, tag.title)
      if (projectTagsMap.has(tag.id)) {
        candidateCalculatedObject.match.push(tag.title)
        if (additionalData) {
          additionalData.matchingScore += matchingFactor
        }
      } else {
        candidateCalculatedObject.extra.push(tag.title)
      }
    })
    projectTagsMap.forEach((tagTitle, tagId) => {
      if (!candidateCalculatedObject.original.has(tagId)) {
        candidateCalculatedObject.missing.push(tagTitle)
      }
    })
  },
  matchTagsWithSynonyms(
    tagsArray: Array<{ id: number; title: string }>,
    projectTagsMap: TagTitleWithSynonymReferenceMap,
    candidateCalculatedObject: CalculatedTagsObject<TagTitleWithSynonymReferenceMap>,
    additionalData?: AdditionalCandidateData,
    matchingFactor = 1
  ) {
    // first fill temp map with all tags project requires
    const tmpMissingTagsMap = new Map()
    projectTagsMap.forEach((tagObject, tagId) => {
      if (!tagObject.synonymOfId) {
        tmpMissingTagsMap.set(tagId, tagObject)
      }
    })

    const tmpOriginalMatchesMap = new Map()

    // then iterate over tags of candidate
    tagsArray.forEach((tag) => {
      // fetch tag withing project with possible synonym reference ID
      const tagWithinProject = projectTagsMap.get(tag.id)

      if (!tagWithinProject) {
        // if this tag was not found in project, then it is not relevant in project scope, therefore there is no need to know about synonyms
        candidateCalculatedObject.original.set(tag.id, { title: tag.title })
        // this tag is also simply an extra
        candidateCalculatedObject.extra.push(tag.title)
      } else {
        // if tag is in project, store with synonym relations (maybe for later use)
        candidateCalculatedObject.original.set(tag.id, tagWithinProject)

        // generate displayed tag title (append synonym notice)
        // TODO: this is probably overkill... check if it is really needed to display to client
        // let tagTitle = tag.title;
        // if (tagWithinProject.synonymOfId) {
        //   const originalTag = projectTagsMap.get(tagWithinProject.synonymOfId);
        //   tagTitle += ` (syn. of ${originalTag!.title})`;
        // }

        // add tag to matches
        candidateCalculatedObject.match.push(tag.title)

        // as this tag is a match, remove it from temporary missing map
        if (tmpMissingTagsMap.has(tag.id)) {
          tmpMissingTagsMap.delete(tag.id)
        }
        if (tagWithinProject.synonymOfId && tmpMissingTagsMap.has(tagWithinProject.synonymOfId)) {
          tmpMissingTagsMap.delete(tagWithinProject.synonymOfId)
        }

        // add matches to increase matching score later
        tmpOriginalMatchesMap.set(tagWithinProject.synonymOfId ? tagWithinProject.synonymOfId : tag.id, null)
      }
    })

    // increase matching score
    if (additionalData) {
      additionalData.matchingScore += tmpOriginalMatchesMap.size * matchingFactor
    }

    tmpMissingTagsMap.forEach((tagObject, tagId) => {
      candidateCalculatedObject.missing.push(tagObject.title)
    })
  },
}
