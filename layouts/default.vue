<template>
  <div>
    <MainNav v-if="isLoggedInAndMoreThanGuest" class="hidden-on-print" />
    <div
      :class="{
        'page-wrapper': isLoggedInAndMoreThanGuest,
      }"
    >
      <nuxt />
    </div>

    <client-only>
      <SweetModal icon="error" :title="errorModal.title" ref="modalError">
        <div>
          <p v-for="err of errorModal.errors" class="mb-0 mt-0">
            {{ err }}
          </p>
        </div>
      </SweetModal>

      <SweetModal icon="success" ref="modalSuccess">
        {{ successModalText }}
      </SweetModal>

      <SweetModal ref="modalPrompt" :hide-close-button="true" :blocking="true" :title="promptModal.title">
        <FInput v-model="promptModal.value" :label="promptModal.label" />
        <button slot="button" type="button" class="tbtn tbtn--white" @click="closePromptModal">
          {{ promptModal.cancelButtonText }}
        </button>
        <button slot="button" type="button" class="tbtn tbtn--blue" @click="submitPromptModal">
          {{ promptModal.submitButtonText }}
        </button>
      </SweetModal>

      <SweetModal icon="warning" ref="modalDeleteConfirm">
        <div class="whitespace-pre-line">{{ deleteModal.message }}</div>
        <button slot="button" type="button" class="tbtn tbtn--white" @click="$refs.modalDeleteConfirm.close()">
          No
        </button>
        <button
          slot="button"
          type="button"
          class="tbtn tbtn--red"
          @click="$refs.modalDeleteConfirm.close() & deleteModal.callback()"
        >
          Yes
        </button>
      </SweetModal>

      <SweetModal icon="info" ref="modalUpdateAvailable" title="Update available">
        <div class="text-center">
          <p>
            New version of stella is available!<br />
            You have to refresh the page to get the updates.
          </p>
          <p>
            Application may work incorrectly and you may loss your data,<br />
            if you don't refresh the page as soon as possible!
          </p>
          <p class="whitespace-pre-line border-t pt-6" v-if="updateModalMessage">{{ updateModalMessage }}</p>
        </div>
        <button slot="button" type="button" class="tbtn tbtn--red" @click="$refs.modalUpdateAvailable.close()">
          Update later
        </button>
        <button slot="button" type="button" class="tbtn tbtn--blue" @click="refreshPage">Update now</button>
      </SweetModal>

      <SweetModal
        :icon="genericModal.icon"
        :blocking="genericModal.blocking === true"
        :hide-close-button="genericModal.blocking === true"
        ref="modalGeneric"
        @close="onGenericModalClose"
        v-if="genericModal"
      >
        <ProgressRing v-if="genericModal.progress >= 0" :radius="48" :stroke="4" :progress="genericModal.progress" />
        <div v-if="genericModal.html" v-html="genericModal.html"></div>
        <p v-else>{{ genericModal.text }}</p>
      </SweetModal>

      <NotificationsWrapper />
    </client-only>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import MainNav from '~/components/MainNav.vue'
import { State } from '~/node_modules/nuxt-property-decorator'
import { UserRole, Maybe } from '~/graphql/GQLTypes'
import { GenericModal } from '~/store'
import ProgressRing from '~/components/globals/ProgressRing.vue'
import NotificationsWrapper from '~/components/NotificationsWrapper.vue'

@Component({
  components: {
    NotificationsWrapper,
    ProgressRing,
    MainNav,
  },
})
export default class App extends Vue {
  UserRole = UserRole

  $refs!: {
    modalError: any
    modalSuccess: any
    modalPrompt: any
    modalDeleteConfirm: any
    modalGeneric: any
    modalUpdateAvailable: any
  }

  updateModalMessage = ''

  errorModal: {
    errors: string[]
    title: string
  } = {
    errors: [],
    title: '',
  }

  promptModal: {
    title: string
    value: Maybe<string>
    label: Maybe<string>
    cancelButtonText: string
    submitButtonText: string
    submitCallback: (value) => void
    cancelCallback: () => void
  } = {
    title: '',
    value: null,
    label: null,
    cancelButtonText: 'Cancel',
    submitButtonText: 'Save',
    submitCallback: () => {},
    cancelCallback: () => {},
  }

  successModalText = ''

  deleteModal: {
    message: string
    callback: () => void
  } = {
    message: '',
    callback: () => {},
  }

  timeouts: {
    errorModal?: NodeJS.Timeout
    successModal?: NodeJS.Timeout
  } = {}

  @State((state) => state.account.user)
  accountUser

  @State((state) => state.genericModal)
  genericModal?: GenericModal

  get isLoggedInAndMoreThanGuest() {
    return (
      this.accountUser &&
      !this.accountUser.roles.includes(UserRole.Guest) &&
      !this.accountUser.roles.includes(UserRole.TokenizedSharedProject)
    )
  }

  mounted() {
    // error modal
    this.$bus.$on('showErrorModal', (p: { errors: string[]; title?: string }, autocloseAfter?: number) => {
      this.errorModal.title = p.title || 'Error'
      this.errorModal.errors = p.errors
      const modalErrorRef = this.$refs.modalError
      modalErrorRef.open()
      if (autocloseAfter) {
        this.timeouts.errorModal = setTimeout(() => {
          modalErrorRef.close()
        }, autocloseAfter)
      }
    })
    if (this.$refs.modalError) {
      this.$refs.modalError.$on('close', () => {
        if (this.timeouts.errorModal) {
          clearTimeout(this.timeouts.errorModal)
          this.timeouts.errorModal = undefined
        }
      })
    }

    // success modal
    this.$bus.$on('showSuccessModal', (successText: string, autocloseAfter?: number) => {
      this.successModalText = successText
      const modalSuccessRef = this.$refs.modalSuccess
      modalSuccessRef.open()
      if (autocloseAfter) {
        this.timeouts.successModal = setTimeout(() => {
          modalSuccessRef.close()
        }, autocloseAfter)
      }
    })
    if (this.$refs.modalSuccess) {
      this.$refs.modalSuccess.$on('close', () => {
        if (this.timeouts.successModal) {
          clearTimeout(this.timeouts.successModal)
          this.timeouts.successModal = undefined
        }
      })
    }

    // prompt related modal
    this.$bus.$on(
      'showPromptModal',
      (options: {
        title: string
        value: Maybe<string>
        label?: Maybe<string>
        cancelButtonText?: string
        submitButtonText?: string
        submitCallback: (value) => void
        cancelCallback?: () => void
      }) => {
        this.promptModal.title = options.title
        this.promptModal.value = options.value
        this.promptModal.label = options.label ? options.label : null
        this.promptModal.cancelButtonText = options.cancelButtonText ? options.cancelButtonText : 'Cancel'
        this.promptModal.submitButtonText = options.submitButtonText ? options.submitButtonText : 'Submit'
        this.promptModal.submitCallback = options.submitCallback
        this.promptModal.cancelCallback = options.cancelCallback ? options.cancelCallback : () => {}
        this.$refs.modalPrompt.open()
      }
    )

    // delete item modal prompt
    this.$bus.$on('showDeleteConfirmModal', (message: string, callback: () => void) => {
      this.deleteModal.message = message
      this.deleteModal.callback = callback
      this.$refs.modalDeleteConfirm.open()
    })

    // generic modal
    this.$bus.$on('showGenericModal', () => {
      this.$refs.modalGeneric.open()
    })
    this.$bus.$on('hideGenericModal', () => {
      this.$refs.modalGeneric.close()
    })

    // update available
    this.$bus.$on('updateAvailable', (message) => {
      this.updateModalMessage = message
      this.$refs.modalUpdateAvailable.open()
    })
  }

  closePromptModal() {
    this.$refs.modalPrompt.close()
    this.promptModal.cancelCallback()
    // reset callback to prevent unexpected actions
    this.promptModal.submitCallback = () => {}
  }

  submitPromptModal() {
    this.promptModal.submitCallback(this.promptModal.value)
    this.$refs.modalPrompt.close()
  }

  onGenericModalClose() {
    setTimeout(() => {
      this.$store.commit('updateGenericModal', {
        text: '',
        html: undefined,
        progress: undefined,
        icon: undefined,
        blocking: undefined,
      })
    }, 350)
  }

  refreshPage() {
    window.location.reload()
  }
}
</script>

<style lang="scss">
@import '../assets/scss/variables';

.page-wrapper {
  @apply pl-[190px];

  @media print {
    @apply pl-[0px] #{!important};
  }
}

// some boxes definitions

.box-action-buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  position: absolute;
  bottom: -18px;
  left: 1.5em;
  right: 1.5em;

  .btn + .btn {
    margin-left: 6px;
  }
}

.mb-8 {
  > .btn,
  > .box-action-buttons > .btn {
    opacity: 0.15;
    transition: all 0.2s ease;
  }

  &:hover {
    > .btn,
    > .box-action-buttons > .btn {
      opacity: 1;
    }
  }

  @media (max-width: 560px) {
    > .btn,
    > .box-action-buttons > .btn {
      opacity: 1;
    }
  }
}

.phonenumber-box {
  display: flex;

  > :nth-child(1) {
    flex: 0 0 125px;
  }

  > :nth-child(2) {
    @include flex(0, 0, calc(50% - 125px - 15px - 7.5px));
    margin-left: 15px;
    margin-right: 15px;
  }

  > :nth-child(3) {
    flex: auto;
    margin-right: 15px;
  }

  > :nth-child(4) {
    flex: none;
    align-self: flex-start;
    margin-top: 4px;
  }

  @media (max-width: 560px) {
    flex-direction: column;

    > :nth-child(1),
    > :nth-child(2),
    > :nth-child(3) {
      flex: none;
      margin-left: 0;
      margin-right: 0;
    }

    > :nth-child(4) {
      flex: none;
      align-self: flex-end;
      margin-bottom: 1em;
      margin-top: 0;
    }
  }
}

.two-fields-box {
  display: flex;
  align-items: flex-start;

  > :nth-child(1) {
    @include flex(0, 0, calc(50% - 15px - 20px));
  }

  > :nth-child(2) {
    flex: auto;
    margin-left: 15px;
    margin-right: 15px;
  }

  > :nth-child(3) {
    flex: none;
    margin-top: 4px;
  }

  &.two-fields-box__icon-left {
    > :nth-child(1) {
      flex: 0 0 32px;
      margin-top: 3px;
    }

    > :nth-child(2) {
      @include flex(0, 0, calc(50% - 15px - 20px - 21px));
    }

    > :nth-child(3) {
      flex: auto;
      margin-left: 0;
      margin-top: 0;
      margin-right: 15px;
    }

    > :nth-child(4) {
      flex: none;
      margin-top: 4px;
    }
  }
}

.table--old {
  width: 100%;
  border-collapse: collapse;

  thead {
    tr {
      background: $color-primary;
      color: white;
    }

    th {
      padding: 10px 10px;
      vertical-align: bottom;
      border-bottom: 2px solid $color-gray-light;
      text-align: left;
    }
  }

  tr:nth-child(2n) {
    background: rgba(0, 0, 0, 0.03);
  }

  td,
  th {
    padding: 7px 10px;
    vertical-align: top;
    border-top: 1px solid $color-gray-light;
  }
}

@media #{$media-till-md} {
  .two-fields-box {
    flex-direction: column;

    > :nth-child(1),
    > :nth-child(2) {
      flex: none;
      margin-left: 0;
      margin-right: 0;
    }

    > :nth-child(3) {
      flex: none;
      align-self: flex-end;
      margin-bottom: 1em;
      margin-top: 0;
    }
  }
}

.document-row {
  display: flex;
  margin: 0 -1em;
  padding: 8px 1em 3px;

  & + & {
    border-top: 1px solid $color-gray;
  }

  &:hover .document-row--icon {
    color: $color-primary;
  }

  &:hover .document-row--buttons {
    opacity: 1;
  }

  .document-row--icon {
    flex: 0 0 32px;
    margin-right: 10px;
    align-self: center;
    padding-bottom: 4px;
    transition: all 0.2s ease;
  }

  .document-row--labels {
    flex: auto;
    display: flex;
    flex-direction: column;
  }

  .document-row--labels--title {
    margin-bottom: 2px;
  }

  .document-row--labels--tags {
    margin: 0 !important;
    font-size: 0.8em;
  }

  .document-row--buttons {
    flex: none;
    margin-left: 15px;
    opacity: 0.15;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    padding-bottom: 4px;

    > .btn {
      margin-left: 7px;
    }
  }
}

.progress-line,
.progress-line:before {
  @apply h-0.5;
}

.progress-line {
  @apply flex fixed z-[1000] top-0 left-0 right-0 bg-blue-500;
}

.progress-line:before {
  content: '';
  animation: running-progress 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  @apply origin-left w-full bg-blue-500;
}

@keyframes running-progress {
  0% {
    transform: translateX(-20%) scaleX(0.2);
  }
  50% {
    transform: translateX(40%) scaleX(0.6);
  }
  100% {
    transform: translateX(100%) scaleX(0);
  }
}
</style>
