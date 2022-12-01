<template>
  <div class="cropper-in-modal">
    <slot :openModal="openModal" />
    <input class="hidden" type="file" ref="fileInput" accept="image/*" @change="_onFileChanged" />
    <client-only>
      <SweetModal
        ref="modalCropper"
        title="Choose part of the image"
        class="test"
        :blocking="true"
        @close="_onModalClose"
        @open="_onModalOpen"
      >
        <Cropper
          ref="cropper"
          classname="h-[60vh]"
          :src="notSavedValue.fullImage"
          :stencil-props="stencilProps"
          :restrictions="_pixelsRestriction"
          v-if="isCropperVisible"
        />
        <p class="text-center" v-show="imageIsTooSmall">
          Selected image is too small and may be displayed blurry. We recommend you to choose another image with at
          least {{ imageSizeMinWidth }}x{{ imageSizeMinHeight }} pixels.
        </p>

        <button type="button" class="tbtn tbtn--gray" slot="button" @click="$refs.fileInput.click()">
          Choose file
        </button>
        <button type="button" class="tbtn tbtn--white ml-auto" slot="button" @click="_closeModal"> Abort </button>
        <button type="button" class="tbtn tbtn--blue" slot="button" @click="_onSaveSelection"> Save selection </button>
      </SweetModal>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import { IMAGE_SIZES_VALUES } from '~/helpers/imageSizes'
import { CropperInModalData } from '~/helpers/types'

@Component({
  components: { Cropper },
})
export default class CropperInModal extends Vue {
  $refs!: {
    modalCropper: any
    cropper: any
    fileInput: HTMLInputElement
  }

  @Prop({ required: true })
  value!: CropperInModalData
  notSavedValue!: CropperInModalData

  fileSelectState: 'NONE' | 'CHOOSING' | 'SELECTED' = 'NONE'
  isCropperVisible = false
  imageIsTooSmall = false

  retinaMultiplier = 2

  get stencilProps() {
    if (this.value.sizeName && IMAGE_SIZES_VALUES[this.value.sizeName]) {
      // if resize mode is "FIT", set fixed aspect ratio
      if (IMAGE_SIZES_VALUES[this.value.sizeName][2] === 1) {
        return { aspectRatio: this.fixAspectRatio }
      }
      // otherwise mode is "RESIZE". Set variable aspect ratio
      if (this.fixAspectRatio > 1) {
        return {
          minAspectRatio: 1,
          maxAspectRatio: this.fixAspectRatio,
        }
      } else {
        return {
          minAspectRatio: this.fixAspectRatio,
          maxAspectRatio: 1,
        }
      }
    }
    return {}
  }

  get fixAspectRatio() {
    return this.imageSizeMinWidth / this.imageSizeMinHeight
  }

  get imageSizeMinWidth(): number {
    const imageMinSize =
      this.value.sizeName && IMAGE_SIZES_VALUES[this.value.sizeName] ? IMAGE_SIZES_VALUES[this.value.sizeName] : null
    return (imageMinSize && typeof imageMinSize[0] === 'number' ? imageMinSize[0] : 100) * this.retinaMultiplier
  }

  get imageSizeMinHeight(): number {
    const imageMinSize =
      this.value.sizeName && IMAGE_SIZES_VALUES[this.value.sizeName] ? IMAGE_SIZES_VALUES[this.value.sizeName] : null
    return (imageMinSize && typeof imageMinSize[1] === 'number' ? imageMinSize[1]! : 100) * this.retinaMultiplier
  }

  mounted() {
    document.addEventListener('keydown', this._onDocumentKeydown)
  }

  _onDocumentKeydown(event) {
    if (event.keyCode == 13) {
      this._onSaveSelection()
    }
  }

  openModal() {
    this.notSavedValue = this.value
    if (!this.notSavedValue.fullImage && this.fileSelectState !== 'SELECTED') {
      this.chooseFileAndOpenModal()
      return
    }
    this.$refs.modalCropper.open()
  }

  chooseFileAndOpenModal() {
    this.$refs.fileInput.click()
    this.fileSelectState = 'CHOOSING'
  }

  _onFileChanged(event) {
    const input = event.target
    if (input.files && input.files[0]) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imageIsTooSmall = false
        this.notSavedValue.fullImage = e.target!.result as string
        this.notSavedValue.file = input.files[0]
        this.$refs.fileInput.value = ''
      }
      reader.readAsDataURL(input.files[0])
      if (this.fileSelectState === 'CHOOSING') {
        this.fileSelectState = 'SELECTED'
        this.openModal()
      }
    }
  }

  _pixelsRestriction({ minW, minH, maxW, maxH, imageWidth, imageHeight }) {
    let minWidth = this.imageSizeMinWidth
    let minHeight = this.imageSizeMinHeight
    const widthProportion = minWidth / imageWidth
    const heightProportion = minHeight / imageHeight
    if (widthProportion > 1 || heightProportion > 1) {
      this.imageIsTooSmall = true
      if (widthProportion > heightProportion) {
        // width passes less, then height, so recalculate min width and height based on width respecting aspect ratio
        minWidth = imageWidth
        minHeight = Math.min(imageHeight, Math.floor(minWidth / this.fixAspectRatio))
      } else {
        // height passes less, then width, so recalculate min height and width based on height respecting aspect ratio
        minHeight = imageHeight
        minWidth = Math.min(imageWidth, Math.floor(minHeight * this.fixAspectRatio))
      }
    }
    return {
      minWidth,
      minHeight,
      maxWidth: maxW,
      maxHeight: maxH,
    }
  }

  // NOTE: currently not used, should be used later to remove image
  reset() {
    this.fileSelectState = 'NONE'
    this.isCropperVisible = false
    this.imageIsTooSmall = false
    this.notSavedValue.croppedImage = null
    this.notSavedValue.file = null
    this.notSavedValue.cropProps = null
    this.notSavedValue.fullImage = null
    this.notSavedValue.isDirty = false

    this.$emit('input', this.notSavedValue)
    this._closeModal()
  }

  _closeModal() {
    this.$refs.modalCropper.close()
  }

  _onModalClose() {
    setTimeout(() => {
      this.isCropperVisible = false
    }, 400)

    document.removeEventListener('keydown', this._onDocumentKeydown)
  }

  async _onModalOpen() {
    this.isCropperVisible = true
    await this.$nextTick()
    if (this.notSavedValue.cropProps) {
      this.$refs.cropper.setCoordinates(this.notSavedValue.cropProps)
    }
  }

  _onSaveSelection() {
    const { coordinates, canvas } = this.$refs.cropper.getResult()
    this.notSavedValue.cropProps = coordinates
    this.notSavedValue.croppedImage = canvas.toDataURL()
    this.notSavedValue.isDirty = true
    this.$emit('input', this.notSavedValue)
    this._closeModal()
  }
}
</script>
