import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { BucketState, RootState, WritableBucket } from './index'
import GetBuckets from '~/graphql/ressources/buckets/GetBuckets.gql'
import CreateBucket from '@/graphql/ressources/buckets/CreateBucket.gql'
import { CreateBucketMutation, CreateBucketMutationVariables, GetBucketsQuery } from '~/graphql/GQLTypes'
import { AddToBucketItemType } from '~/helpers/types'

export const state = (): BucketState => ({
  writableBuckets: [],
  lastSelectedBucket: null,
  candidateSelectionIsActive: false,
  candidateSelection: new Set(),
  candidateSelectionCount: 0,
  clientSelectionIsActive: false,
  clientSelection: new Set(),
  clientSelectionCount: 0,
  companySelectionIsActive: false,
  companySelection: new Set(),
  companySelectionCount: 0,
  projectSelectionIsActive: false,
  projectSelection: new Set(),
  projectSelectionCount: 0,
})

export const getters: GetterTree<BucketState, RootState> = {}

export const mutations: MutationTree<BucketState> = {
  setWritableFromBuckets(localState, buckets: GetBucketsQuery) {
    // filter writeable buckets from all buckets
    const writableBuckets: WritableBucket[] = []
    buckets.me!.buckets.forEach((myBucket) => {
      writableBuckets.push({
        id: myBucket.id,
        title: myBucket.title,
      })
    })

    buckets.me!.shared_buckets.forEach((sharedBucket) => {
      if (!sharedBucket.bucket_user_permission!.is_write_allowed) {
        return
      }
      writableBuckets.push({
        id: sharedBucket.id,
        title: sharedBucket.title,
        ownerName: `${sharedBucket.owner.firstname} ${sharedBucket.owner.lastname}`,
      })
    })

    localState.writableBuckets = writableBuckets
  },
  addBucket(localState, newBucket: NonNullable<CreateBucketMutation['createBucket']>) {
    // this is used only for own buckets
    localState.writableBuckets.push({
      id: newBucket.id,
      title: newBucket.title,
    })
  },
  setLastSelectedBucket(localState, bucket: WritableBucket) {
    localState.lastSelectedBucket = bucket
  },
  modifySelection(localState, payload: { resource: AddToBucketItemType; isChecked: boolean; id: number }) {
    const resourceSet: Set<number> = localState[payload.resource + 'Selection']
    if (!payload.isChecked && resourceSet.has(payload.id)) {
      resourceSet.delete(payload.id)
    } else if (payload.isChecked && !resourceSet.has(payload.id)) {
      resourceSet.add(payload.id)
    }
    localState[payload.resource + 'SelectionCount'] = resourceSet.size
  },
  clearSelection(localState) {
    localState.candidateSelection.clear()
    localState.clientSelection.clear()
    localState.companySelection.clear()
    localState.projectSelection.clear()
    localState.candidateSelectionIsActive = false
    localState.clientSelectionIsActive = false
    localState.companySelectionIsActive = false
    localState.projectSelectionIsActive = false
    localState.candidateSelectionCount = 0
    localState.clientSelectionCount = 0
    localState.companySelectionCount = 0
    localState.projectSelectionCount = 0
  },
  activateSelection(localState, itemType: AddToBucketItemType) {
    localState[itemType + 'SelectionIsActive'] = true
  },
}

export const actions: ActionTree<BucketState, RootState> = {
  fetchBuckets({ commit }) {
    return this.app
      .apolloProvider!.defaultClient.query({
        query: GetBuckets,
      })
      .then(({ data }: { data: GetBucketsQuery }) => {
        if (data.me) {
          commit('setWritableFromBuckets', data)
        }
        return data
      })
  },
  createMyBucket({ commit, rootState }, payload: { title: string }) {
    if (!rootState.account!.user!.id) {
      throw new Error("User don't has an id, so it is not allowed to create buckets")
    }
    const variables: CreateBucketMutationVariables = {
      input: {
        title: payload.title,
        owner_id: rootState.account!.user!.id,
      },
    }
    return this.app
      .apolloProvider!.defaultClient.mutate<CreateBucketMutation>({
        mutation: CreateBucket,
        variables,
      })
      .then(({ data }) => {
        if (data && data.createBucket) {
          commit('addBucket', data.createBucket)
          return data.createBucket
        }
        return
      })
  },
}
