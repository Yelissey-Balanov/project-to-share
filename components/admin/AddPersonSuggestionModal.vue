<template>
  <div>
    <client-only>
      <SweetModal ref="modalPersonSuggestion" title="Person probably exists">
        <div class="flex items-center mb-4" v-for="person in people">
          <div class="small-foto mr-4">
            <LImg class="w-20 h-20 border-2" :image="person.foto ? person.foto.sizes.PROFILE_IMAGE : null">
              <IHUserFilled class="w-20 h-20 text-gray-400 mt-5" />
            </LImg>
          </div>
          <div class="flex flex-col items-start">
            <h3 class="my-0">
              {{ person.title }} {{ person.firstname }} {{ person.other_firstnames }} {{ person.lastname }}
              <template v-if="person.birth_name"> ({{ person.birth_name }}) </template>
            </h3>
            <div>
              <nuxt-link :to="`/candidates/${person.candidate_id}`" v-if="person.candidate_id">
                Show candidate profile
              </nuxt-link>
              <template v-if="person.candidate_id && person.client_id"> | </template>
              <nuxt-link :to="`/clients/${person.client_id}`" v-if="person.client_id"> Show client profile </nuxt-link>
            </div>
            <div>
              <button
                class="text-green-700 hover:underline"
                v-if="!person.candidate_id"
                @click="storePersonAndNavigateTo(person, '/candidates/new/form')"
              >
                New candidate profile
              </button>
              <template v-if="!person.candidate_id && !person.client_id"> | </template>
              <button
                class="text-green-700 hover:underline"
                v-if="!person.client_id"
                @click="storePersonAndNavigateTo(person, '/clients/new/form')"
              >
                New client profile
              </button>
            </div>
          </div>
        </div>
        <div class="form-action-buttons mt-0 mb-0">
          <button type="button" class="tbtn tbtn--blue" @click="ignoreAndCloseModal()">
            Ignore and continue creating new entry
          </button>
        </div>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { GetPeopleByNameQuery } from '~/graphql/GQLTypes'
import { Mutation, State } from '~/node_modules/nuxt-property-decorator'
import IHUserFilled from '~/components/globals/icons/heroicons/IHUserFilled.vue'
@Component({
  components: { IHUserFilled },
})
export default class AddEventModal extends Vue {
  $refs!: {
    modalPersonSuggestion: any
  }

  publicUrl = this.$config.publicUrl
  people: GetPeopleByNameQuery['people'] = []

  @State((state) => state.account.user)
  accountUser

  @Mutation('person/setPrefilledPerson')
  setPrefilledPerson

  mounted() {
    this.$bus.$on('showPersonSuggestionModal', (people: GetPeopleByNameQuery['people']) => {
      this.people = people
      this.$refs.modalPersonSuggestion!.open()
    })
  }

  destroyed() {
    this.$bus.$off('showPersonSuggestionModal')
  }

  ignoreAndCloseModal() {
    this.$bus.ignorePersonSuggestion()
    this.$refs.modalPersonSuggestion!.close()
  }

  storePersonAndNavigateTo(person: GetPeopleByNameQuery['people'][0], link: string) {
    this.setPrefilledPerson(person)

    // either navigate to new route, or if we are already there, simply fire event
    if (this.$route.fullPath !== link) {
      this.$router.push(link)
    } else {
      this.$bus.selectSuggestedPerson()
    }

    this.$refs.modalPersonSuggestion!.close()
  }
}
</script>
