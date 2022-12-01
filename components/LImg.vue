<template>
  <div class="l-img relative overflow-hidden">
    <template v-if="image">
      <img
        v-if="image"
        :src="image.thumbnail"
        :data-src="pathPrefix + image.regular"
        :data-srcset="`${pathPrefix + image.regular} 1x, ${pathPrefix + image.retina} 2x`"
        class="block relative w-full h-full object-cover l-img__img lazy"
        :alt="alt"
        ref="img"
      />
      <img
        :src="image.thumbnail"
        class="absolute top-0 left-0 right-0 bottom-0 z-[5] w-full h-full blur-sm object-cover l-img__thumbnail-overlay"
        :alt="`${alt} thumbnail`"
      />
    </template>
    <div class="flex justify-center items-center h-full w-full" v-else>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { isIntersectionObserverSupported, revealImage } from '~/helpers/intersectionObserverHelpers'
import { ImageSizeFormat } from '~/graphql/GQLTypes'

@Component
export default class LImg extends Vue {
  $refs!: {
    img: HTMLImageElement
  }

  @Prop({ default: null })
  image!: ImageSizeFormat

  @Prop({ default: '' })
  alt!: string

  get pathPrefix() {
    return this.image.regular.substr(0, 1) === '/' ? '' : this.$config.publicUrl
  }

  @Watch('image')
  onImageChanges() {
    if (!this.$refs.img) {
      return
    }
    this.$refs.img.srcset = ''
    this.$refs.img.classList.add('lazy')
  }

  mounted() {
    if (!isIntersectionObserverSupported) {
      revealImage(this.$refs.img)
    }
  }
}
</script>

<style lang="scss">
.l-img {
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);

  &.l-img--contain {
    .l-img__img,
    .l-img__thumbnail-overlay {
      object-fit: contain;
    }
  }
}

.l-img__thumbnail-overlay {
  opacity: 0;
}

.l-img__img.lazy + .l-img__thumbnail-overlay {
  opacity: 1;
}
</style>
