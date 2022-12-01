<template>
  <div v-if="chCategory" class="container pt-5">
    <div class="flex w-full justify-between items-center space-x-8 flex-wrap md:flex-nowrap mb-6">
      <h1>{{ chCategory.title }}</h1>
      <div class="flex items-center space-x-2">
        <nuxt-link to="/corona-helpdesk" class="btn gray-outline">Back to list</nuxt-link>
        <nuxt-link :to="`/corona-helpdesk/${chCategory.id}/form`" class="tbtn tbtn--blue">Edit</nuxt-link>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <LabeledValue :value="chCategory.title" label="Topic title" />
    </div>
    <div class="grid grid-cols-1 gap-4">
      <LabeledValue :value="chCategory.short_text" label="Hashtags" :pre-wrap="true" />
    </div>
    <div class="grid grid-cols-1 gap-4">
      <LabeledValue :value="chCategory.long_text" label="Description" :pre-wrap="true" />
    </div>

    <br />
    <h2> Candidates </h2>
    <div class="candidates">
      <template v-for="candidate in chCategory.candidates">
        <nuxt-link class="candidate-box text-black" :to="`/candidates/${candidate.id}`">
          <div class="candidate-box__image">
            <img v-if="candidate.person.foto" :src="publicUrl + candidate.person.foto.sizes.PROFILE_IMAGE.retina" />
          </div>
          <div class="candidate-box__details">
            <div class="candidate-box__details__name">
              {{ candidate.person.title }} {{ candidate.person.firstname }} {{ candidate.person.lastname }}
            </div>

            <div class="grid grid-cols-1 gap-4">
              <LabeledValue
                :value="candidate.industries"
                :mapFn="(industry) => industry.title"
                :internal-link-map-fn="(industry) => `/industries/${industry.id}`"
                label="Industries"
              />
            </div>

            <div class="grid grid-cols-1 gap-4">
              <LabeledValue
                :value="candidate.skills"
                :mapFn="(skill) => skill.title"
                :internal-link-map-fn="(skill) => `/skills/${skill.id}`"
                label="Skills"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <LabeledValue :value="candidate.candidate_ch_category_pivot.phonenumber" label="Phonenumber" />
              <LabeledValue :value="candidate.candidate_ch_category_pivot.email" label="Email" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <LabeledValue
                :value="t_de.WorkTime[candidate.candidate_ch_category_pivot.work_time]"
                label="Arbeitszeit"
              />
              <LabeledValue
                :value="t_de.WorkPlace[candidate.candidate_ch_category_pivot.work_place]"
                label="Arbeitsort"
              />
            </div>

            <div class="grid grid-cols-1 gap-4">
              <LabeledValue :value="candidate.candidate_ch_category_pivot.text" label="About candidate" class="mb-0" />
            </div>
          </div>
        </nuxt-link>
      </template>
    </div>

    <div class="form-action-buttons">
      <!--      <button class="btn red-outline btn-delete" v-if="!isCreating" type="button" @click="deleteChCategory">-->
      <!--        Delete-->
      <!--      </button>-->
      <nuxt-link to="/corona-helpdesk" class="btn gray-outline">Back to list</nuxt-link>
      <nuxt-link :to="`/corona-helpdesk/${chCategory.id}/form`" class="tbtn tbtn--blue">Edit</nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import GetChCategoryForView from '@/graphql/ressources/chCategories/GetChCategoryForView.gql'
import { GetChCategoryForViewQuery, StellaPlugin, UserRole } from '~/graphql/GQLTypes'
import LabeledValue from '~/components/admin/LabeledValue.vue'
import { t_de } from '~/helpers/i18n'

@Component({
  components: {
    LabeledValue,
  },
  async asyncData({ app, route }) {
    const data: any = {
      chCategoryId: Number.parseInt(route.params.id),
    }
    if (data.chCategoryId) {
      const res = await app.apolloProvider!.defaultClient.query<GetChCategoryForViewQuery>({
        query: GetChCategoryForView,
        variables: {
          id: data.chCategoryId,
        },
      })
      data.chCategory = res.data.chCategory
    }
    return data
  },
  head() {
    const chCategory = (this as ChCategoriesView).chCategory
    return {
      title: chCategory ? `${chCategory.title}` : '',
    }
  },
  middleware: ['auth', 'stellaPlugin'],
  meta: {
    requiredRole: UserRole.CoronaHelpdeskManager,
    plugin: StellaPlugin.CoronaHelpdesk,
  },
})
export default class ChCategoriesView extends Vue {
  chCategory: GetChCategoryForViewQuery['chCategory'] = null
  publicUrl = this.$config.publicUrl
  t_de = t_de

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.chCategory) {
      this.$router.push('/corona-helpdesk')
      return
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/scss/variables';

.candidates {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.candidate-box {
  display: flex;
  align-items: center;
  background: #fff;
  @include flex(0, 0, calc(100% - 75px));
  margin: 1em 1em 1em 85px;
  border: 1px solid $color-gray-light;
  text-decoration: none;
  transition: all 0.2s ease;

  &:focus,
  &:hover {
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.08);

    > .candidate-box__image {
      transform: scale(1.1);
    }
  }
}

.candidate-box__image {
  width: 148px;
  height: 148px;
  flex: 0 0 150px;
  margin-left: -75px;
  margin-right: 5px;
  border-radius: 50%;
  border: 1px solid $color-gray;
  overflow: hidden;
  background: $color-gray;
  transition: all 0.25s ease;
}

.candidate-box__details {
  width: 100%;
  text-align: left;
  padding: 15px;
}

.candidate-box__details__name {
  font-size: 1.4em;
  margin-bottom: 0.7em;
}
</style>
