<template>
  <div class="candidate-piwb" v-if="candidate">
    <span class="candidate-piwb__score" v-if="candidate.matchingScore && !hideScore">
      <span>{{ candidate.matchingScore }}</span>
      <span class="text-xs text-gray-400">of {{ maxPossibleScore }}</span>
    </span>
    <span
      class="candidate-piwb__was-placed"
      v-if="candidate.was_placed"
      v-tooltip="{ content: 'At least 1 time placed', classes: ['tooltip--green'] }"
    >
      <IMoneyBag class="icon" />
    </span>
    <span
      class="candidate-piwb__caution"
      v-if="candidate.caution"
      v-tooltip="{ content: 'At least in 1 project beyond first interview!', classes: ['tooltip--red'] }"
    >
      <IWarning class="icon" />
    </span>

    <template v-if="wrapWithLink">
      <a class="candidate-piwb__profile-image" target="_blank" :href="`/candidates/${candidate.id}`">
        <img v-if="candidate.person.foto" :src="publicUrl + candidate.person.foto.sizes.PROFILE_IMAGE.retina" />
      </a>
    </template>
    <template v-else>
      <div class="candidate-piwb__profile-image">
        <img v-if="candidate.person.foto" :src="publicUrl + candidate.person.foto.sizes.PROFILE_IMAGE.retina" />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { CandidateInList, SuitableCandidate } from '~/store'
import { State } from '~/node_modules/nuxt-property-decorator'

// TODO: Should be removed, after redesign not needed anymore
// #DEPRECATED
@Component({
  components: {},
})
export default class CandidateProfileImageWithBadges extends Vue {
  @Prop()
  candidate?: CandidateInList | SuitableCandidate

  @Prop({ default: true })
  wrapWithLink?: boolean

  @Prop({ default: false })
  hideScore!: boolean

  publicUrl = this.$config.publicUrl

  @State((state) => state.project.projectAdditionalData.maxPossibleScore)
  maxPossibleScore!: number
}
</script>

<style scoped lang="scss">
@import '../../assets/scss/variables';

.candidate-piwb {
  position: relative;
}

.candidate-piwb__score {
  position: absolute;
  z-index: 20;
  top: 16px;
  left: 156px;
  line-height: 1;
  border: 2px solid $color-gray-dark;
  background: $bg-color;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 45px;
  height: 45px;
}

.candidate-piwb__was-placed {
  position: absolute;
  z-index: 19;
  top: -3px;
  left: 136px;
  line-height: 1;
  border: 2px solid $color-green;
  background: $color-green;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 35px;
  height: 35px;

  .icon {
    width: 22px;
    height: 22px;
  }
}

.candidate-piwb__caution {
  position: absolute;
  z-index: 19;
  top: 51px;
  left: 179px;
  line-height: 1;
  border: 2px solid $color-red;
  background: $color-red;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 35px;
  height: 35px;

  .icon {
    margin-top: -2px;
    width: 22px;
    height: 22px;
  }
}

.candidate-piwb__profile-image {
  top: 0;
  left: 0;
  position: absolute;
  width: 200px;
  height: 200px;
  display: block;
  border-radius: 50%;
  border: 2px solid $color-gray-dark;
  overflow: hidden;
  box-sizing: content-box;
  background: $color-gray;
  z-index: 9;

  > img {
    display: block;
    width: 100%;
    height: 100%;
    transition: all 0.25s ease;
  }

  &:hover > img {
    transform: scale(1.05);
  }
}
</style>
