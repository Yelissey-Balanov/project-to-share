<template>
  <div class="f-tiptap" :class="{ 'is-disabled': disabled }">
    <label v-if="!!label">{{ label }}</label>
    <div class="tiptap-wrapper box-of-grouped-fields">
      <client-only v-if="editor" placeholder="Loading...">
        <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
          <div class="editor-buttons-group">
            <button type="button" class="editor-btn" :class="{ 'is-active': isActive.bold() }" @click="commands.bold">
              <IBold />
            </button>
            <button
              type="button"
              class="editor-btn"
              :class="{ 'is-active': isActive.italic() }"
              @click="commands.italic"
            >
              <IItalic />
            </button>
            <button
              type="button"
              class="editor-btn"
              :class="{ 'is-active': isActive.underline() }"
              @click="commands.underline"
            >
              <IUnderline />
            </button>
            <button
              type="button"
              class="editor-btn"
              :class="{ 'is-active': isActive.strike() }"
              @click="commands.strike"
            >
              <IStrike />
            </button>

            <button
              type="button"
              class="editor-btn"
              :class="{ 'is-active': isActive.heading({ level: 2 }) }"
              @click="commands.heading({ level: 2 })"
            >
              <IH2 />
            </button>
            <!--            <button-->
            <!--              type="button"-->
            <!--              class="editor-btn"-->
            <!--              :class="{ 'is-active': isActive.heading({ level: 3 }) }"-->
            <!--              @click="commands.heading({ level: 3 })"-->
            <!--            >-->
            <!--              <IH3 />-->
            <!--            </button>-->
            <!--            <button-->
            <!--              type="button"-->
            <!--              class="editor-btn"-->
            <!--              :class="{ 'is-active': isActive.heading({ level: 4 }) }"-->
            <!--              @click="commands.heading({ level: 4 })"-->
            <!--            >-->
            <!--              <IH4 />-->
            <!--            </button>-->
            <button type="button" class="editor-btn" :class="{ 'is-active': isActive.link() }" @click="showLinkModal">
              <ILink />
            </button>
            <button type="button" class="editor-btn" @click="showImageManagerModal">
              <IImage />
            </button>
            <button
              type="button"
              class="editor-btn"
              :class="{ 'is-active': isActive.bullet_list() }"
              @click="commands.bullet_list"
            >
              <IList />
            </button>
            <button type="button" class="editor-btn" @click="commands.undo">
              <IUndo />
            </button>
            <button type="button" class="editor-btn" @click="commands.redo">
              <IRedo />
            </button>
          </div>
        </editor-menu-bar>
        <EditorContent :editor="editor" />

        <SweetModal ref="imageManagerModal" :title="imageManager.node ? 'Modify Image' : 'Add Image'">
          <div class="grid grid-cols-1 gap-4">
            <FInput v-model="imageManager.url" label="Image URL" />
          </div>
          <div class="grid grid-cols-1 gap-4">
            <FInput v-model="imageManager.alt" label="Alternative text" />
          </div>
          <img :src="imageManager.url" :alt="imageManager.alt" />
          <input
            ref="fileInput"
            type="file"
            class="tiptap-file-input"
            accept="image/*"
            @change="onImageForUploadSelected"
          />

          <button slot="button" type="button" class="btn green-outline mr-auto" @click="$refs.fileInput.click()">
            Upload new image
          </button>
          <button slot="button" type="button" class="btn gray-outline" @click="closeImageManagerModal"> Abort </button>
          <button slot="button" type="button" class="tbtn tbtn--blue" @click="submitImageManagerModal"> Save </button>
        </SweetModal>
      </client-only>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { Maybe, UploadChArticleImageMutation, UploadChArticleImageMutationVariables } from '@/graphql/GQLTypes'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Bold,
  BulletList,
  HardBreak,
  Heading,
  History,
  Italic,
  Link,
  ListItem,
  Strike,
  Underline,
  Image,
} from 'tiptap-extensions'
import IBold from '@/components/globals/icons/editor/IBold.vue'
import IH2 from '@/components/globals/icons/editor/IH2.vue'
import IH3 from '@/components/globals/icons/editor/IH3.vue'
import IH4 from '@/components/globals/icons/editor/IH4.vue'
import IImage from '@/components/globals/icons/editor/IImage.vue'
import IItalic from '@/components/globals/icons/editor/IItalic.vue'
import ILink from '@/components/globals/icons/editor/ILink.vue'
import IList from '@/components/globals/icons/editor/IList.vue'
import IStrike from '@/components/globals/icons/editor/IStrike.vue'
import IUnderline from '@/components/globals/icons/editor/IUnderline.vue'
import IUndo from '@/components/globals/icons/editor/IUndo.vue'
import IRedo from '@/components/globals/icons/editor/IRedo.vue'
import UploadChArticleImage from '@/graphql/ressources/chArticles/UploadChArticleImage.gql'

@Component({
  components: {
    IUndo,
    IRedo,
    IBold,
    IH2,
    IH3,
    IH4,
    IImage,
    IItalic,
    ILink,
    IList,
    IStrike,
    IUnderline,
    EditorContent,
    EditorMenuBar,
  },
})
export default class FTiptap extends Vue {
  $refs!: {
    fileInput: HTMLInputElement
    imageManagerModal: any
  }

  @Prop()
  value?: Maybe<string>
  @Prop()
  label?: string
  @Prop({ default: false })
  disabled?: boolean

  editor: Editor = null

  imageManager: {
    url: Maybe<string>
    alt: Maybe<string>
    node: Maybe<any>
  } = {
    url: null,
    alt: null,
    node: null,
  }

  mounted() {
    this.editor = new Editor({
      extensions: [
        new Bold(),
        new BulletList(),
        new ListItem(),
        new HardBreak(),
        new Heading([2]),
        new History(),
        new Italic(),
        new Link(),
        new Strike(),
        new Underline(),
        new Image(),
      ],
      content: this.value,
    })
  }

  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
    }
  }

  private sentValueToOutside!: Maybe<string>

  showLinkModal() {
    // check if link is active
    const isActive = this.editor.isActive.link()
    const value = this.$bus.showPromptModal({
      title: isActive ? 'Edit Link' : 'Create Link',
      value: isActive ? this.editor.getMarkAttrs('link').href : '',

      cancelButtonText: 'Abort',
      submitButtonText: 'Save',
      submitCallback: (newValue) => {
        this.editor.commands.link({ href: newValue })
      },
    })
  }

  showImageManagerModal() {
    const isActive = this.editor.isActive.image()
    if (isActive) {
      this.imageManager.node = isActive ? this.editor.state.doc.nodeAt(this.editor.selection.from) : null
      if (this.imageManager.node) {
        this.imageManager.url = this.imageManager.node.attrs.src
        this.imageManager.alt = this.imageManager.node.attrs.alt
      }
    } else {
      this.imageManager.node = null
      this.imageManager.url = ''
      this.imageManager.alt = ''
    }
    this.$refs.imageManagerModal.open()
  }

  closeImageManagerModal() {
    this.$refs.imageManagerModal.close()
  }

  submitImageManagerModal() {
    if (this.imageManager.node) {
      this.editor.dispatchTransaction(
        this.editor.state.tr.setNodeMarkup(this.editor.selection.from, undefined, {
          src: this.imageManager.url,
          alt: this.imageManager.alt,
        })
      )
    } else {
      this.editor.commands.image({
        src: this.imageManager.url,
        alt: this.imageManager.alt,
      })
    }

    this.$refs.imageManagerModal.close()
  }

  onImageForUploadSelected() {
    if (!this.$refs.fileInput.files) {
      return
    }
    const file = this.$refs.fileInput.files[0]
    this.$refs.fileInput.value = ''

    this.$store.commit('updateGenericModal', {
      text: 'Uploading image...',
      progress: 0,
      blocking: true,
    })
    this.$bus.showGenericModal()

    this.$apollo
      .mutate<UploadChArticleImageMutation>({
        mutation: UploadChArticleImage,
        variables: { file } as UploadChArticleImageMutationVariables,
        context: {
          fetchOptions: {
            onUploadProgress: (progressEvent) => {
              this.$store.commit('updateGenericModal', {
                progress: Math.round((progressEvent.loaded / progressEvent.total) * 100),
              })
            },
          },
        },
      })
      .then(({ data }) => {
        this.imageManager.url = data!.uploadChArticleImage!
        this.imageManager.alt = ''
        this.$bus.hideGenericModal()
      })
  }

  getHTML(): string {
    return this.editor.getHTML()
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variables';
@import '../../assets/scss/tiptap/ch-theme';

.f-tiptap {
  position: relative;
  margin: 1em auto 0;

  > label {
    position: absolute;
    top: 3px;
    left: 0;
    pointer-events: none;
    font-weight: 400;
    transition: all 0.25s ease;
    transform-origin: left top;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: mix($color-text, white, 60);
    transform: translateY(-17px) scale(0.8);
  }

  &.is-disabled {
    > label {
      opacity: 0.4;
    }
  }

  .editor-buttons-group {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    border-bottom: 1px solid $color-gray-light;
    margin: 0 -1.5em 20px;
    padding: 10px 1.5em 10px;
    position: sticky;
    top: 0;
    z-index: 1;
    background: #fff;
  }

  .editor-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
    border-radius: 5px;
    background: transparent;
    transition: all 0.2s ease;
    color: $color-gray-dark;
    margin-right: 5px;

    &:focus,
    &:hover {
      background: transparentize($color-primary, 0.92);
      color: $color-text;
    }

    &.is-active {
      background: transparentize($color-primary, 0.85);
      color: $color-primary;
    }

    > svg {
      width: 18px;
      height: 18px;
    }
  }
}

.tiptap-wrapper {
  padding-top: 1px;
  padding-bottom: 1px;

  .ProseMirror {
    outline: none;
  }
}

.tiptap-file-input {
  display: none;
}
</style>
