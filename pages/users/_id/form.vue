<template>
  <div class="container pt-5">
    <div class="flex w-full justify-start items-center mb-6 space-x-8">
      <nuxt-link :to="`/users/${isCreating ? '' : $route.params.id}`" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ isCreating ? 'Create' : 'Edit' }} User</h1>
    </div>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver" class="space-y-4 mt-4">
      <div class="grid gap-6 mb-8 grid-cols-1 xl:grid-cols-11">
        <div class="xl:col-span-7 flex flex-col space-y-6">
          <div class="card">
            <div class="card-header">
              <div>
                <h3>User information</h3>
              </div>
            </div>
            <div class="divide-y">
              <div class="space-y-6 p-6">
                <FInput v-model="form.firstname" label="Firstname" />
                <FInput v-model="form.lastname" label="Lastname" />
                <FInput v-model="form.contact_email" label="Contact email" />
                <FInput v-model="form.contact_number" label="Contact number" />
                <FInput v-model="form.email" label="Email" :rules="'email|required'" errorLabel="email" />
                <FInput
                  v-model="form.password"
                  label="Password"
                  type="password"
                  :rules="passwordFieldRules"
                  autocomplete="new-password"
                  errorLabel="password"
                />
                <div class="text-xs !mt-2">
                  NOTE: If you let password field empty, current password will stay unchanged. Use password field only
                  if you wish to override current password.
                </div>
                <FMultiselect
                  v-model="form.roles"
                  label="Roles"
                  :options="roleOptions"
                  :isSingle="false"
                  :isTaggable="false"
                />
              </div>
              <div class="p-6">
                <div class="mb-4">
                  <h3>Roles description</h3>
                </div>
                <ul>
                  <li>
                    <b>Guest</b> - default role on registration. This role has no access rights at all, user is simply
                    blocked.
                  </li>
                  <li>
                    <b>Employee</b> - role for consultancy employees. This role has almost full access to the platform
                    except user management. The amount of users with employee role is limited by your license!
                  </li>
                  <li>
                    <b>Admin</b> - this role has additional access to all critical actions of the platform, like force
                    deleting entries. Note: Admin role is only an add-on on top of Employee role, so you still have to
                    add Employee! The amount of users with employee role is limited by your license!
                  </li>
                  <li><b>UserManager</b> - this role has ability to manage user accounts.</li>
                  <li v-if="isEmployeeEnabled">
                    <b>EmployeeManager</b> - this role has full access to employees management plugin.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="xl:col-span-4 flex flex-col space-y-6">
          <div class="card">
            <div class="divide-y">
              <div class="space-y-6 p-6">
                <div class="flex justify-center">
                  <CropperInModal class="relative" v-model="form.foto" v-slot="{ openModal }">
                    <img
                      class="!flex-none w-48 h-48 border-gray-400 border-2 overflow-hidden rounded-full bg-gray-200"
                      :src="form.foto.croppedImage"
                    />
                    <button
                      type="button"
                      class="absolute p-1 rounded-full"
                      :class="
                        form.foto.croppedImage
                          ? 'bottom-2.5 right-2.5 bg-slate-200 border border-slate-400'
                          : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                      "
                      @click="openModal()"
                    >
                      <IPencil />
                    </button>
                  </CropperInModal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-action-buttons">
        <button class="tbtn tbtn--red mr-auto" v-if="!isCreating" type="button" @click="deleteUser"> Delete </button>
        <nuxt-link to="." class="tbtn tbtn--white">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

import GetUser from '@/graphql/ressources/users/GetUser.gql'
import DeleteUser from '@/graphql/ressources/users/DeleteUser.gql'
import UpdateUser from '@/graphql/ressources/users/UpdateUser.gql'
import CreateUser from '@/graphql/ressources/users/CreateUser.gql'

import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  DeleteUserMutationVariables,
  GetUserQuery,
  Maybe,
  StellaPlugin,
  UpdateUserMutation,
  UpdateUserMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import { CropperInModalData, IdWithTitle } from '~/helpers/types'
import CropperInModal from '~/components/form/CropperInModal.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'

@Component({
  components: { IHChevronLeft, CropperInModal, ValidationObserver },
  async asyncData({ app, route }) {
    const data: any = {
      isCreating: route.params.id === 'new',
      userId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      const res = await app.apolloProvider!.defaultClient.query<GetUserQuery>({
        query: GetUser,
        variables: {
          id: data.userId,
        },
      })
      data.loadedData = res.data.user
    }
    return data
  },
  head() {
    return {
      title: `${(this as UsersEdit).isCreating ? 'Create' : 'Edit'} user`,
    }
  },
  middleware: 'auth',
  meta: {
    requiredRole: UserRole.UserManager,
  },
})
export default class UsersEdit extends Vue {
  UserRole = UserRole

  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
  }

  isCreating = false

  form: {
    firstname: Maybe<string>
    lastname: Maybe<string>
    contact_email: Maybe<string>
    contact_number: Maybe<string>
    email: Maybe<string>
    password: Maybe<string>
    roles: Array<IdWithTitle<string>>
    foto: CropperInModalData
  } = {
    firstname: null,
    lastname: null,
    contact_email: null,
    contact_number: null,
    email: null,
    password: null,
    roles: [],
    foto: {
      sizeName: 'PROFILE_IMAGE',
      file: null,
      fullImage: null,
      croppedImage: null,
      cropProps: null,
      isDirty: false,
    },
  }

  roleOptions: IdWithTitle<string>[] = []
  loadedData!: Maybe<GetUserQuery['user']>
  private userId: number | null = null

  private isSubmitting = false

  get isEmployeeEnabled() {
    return this.$store.getters['stella/isPluginEnabled'](StellaPlugin.Employees)
  }

  get passwordFieldRules() {
    return this.isCreating ? 'required' : ''
  }

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/users')
      return
    }

    // fetch data, when editing
    if (!this.isCreating && this.loadedData) {
      this.form.firstname = this.loadedData.firstname!
      this.form.lastname = this.loadedData.lastname!
      this.form.contact_email = this.loadedData.contact_email!
      this.form.contact_number = this.loadedData.contact_number!
      this.form.email = this.loadedData.email!
      this.form.roles = this.loadedData.roles.map((role) => ({ id: role, title: role }))

      if (this.loadedData.foto) {
        this.form.foto.croppedImage = this.$config.publicUrl + this.loadedData.foto.sizes.PROFILE_IMAGE!.retina
        this.form.foto.fullImage = this.$config.publicUrl + this.loadedData.foto.original_image
        this.form.foto.cropProps = this.loadedData.foto.sizes.PROFILE_IMAGE!.cropProps!
      }
    }

    Object.values(UserRole).forEach((role: UserRole) => {
      // ignore currently not used roles
      if ([UserRole.Candidate, UserRole.Client, UserRole.Company, UserRole.TokenizedSharedProject].includes(role)) {
        return
      }
      // ignore corona helpdesk plugin roles
      if (
        !this.$store.getters['stella/isPluginEnabled'](StellaPlugin.CoronaHelpdesk) &&
        UserRole.CoronaHelpdeskManager === role
      ) {
        return
      }
      // ignore employees plugin roles
      if (!this.isEmployeeEnabled && UserRole.EmployeeManager === role) {
        return
      }

      this.roleOptions.push({
        id: role,
        title: role,
      })
    })
  }

  async onSubmit() {
    if (this.isSubmitting) {
      return
    }

    if (!(await validateObserver(this.$refs.formValidationObserver))) {
      return
    }

    this.isSubmitting = true
    try {
      // determine if we should run create or update mutation
      let createOrUpdateFn = this.isCreating ? this.createUser : this.updateUser
      // store userId
      this.userId = await createOrUpdateFn()
      // as we store user in 2 steps, mark that user was already created
      this.isCreating = false

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal('User was successfully ' + (this.isCreating ? 'created' : 'updated'), 3000)
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/users/' + this.userId)
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createUser(): Promise<number> {
    const variables: CreateUserMutationVariables = {
      input: this.generateInput(),
    }

    const { data } = await this.$apollo.mutate<CreateUserMutation>({
      mutation: CreateUser,
      variables,
    })

    return data!.createUser!.id!
  }

  async updateUser(): Promise<number> {
    if (!this.userId) {
      throw new Error("userId is empty, can't call updateConsultant()")
    }
    const variables: UpdateUserMutationVariables = {
      id: this.userId,
      input: this.generateInput(),
    }

    const { data } = await this.$apollo.mutate<UpdateUserMutation>({
      mutation: UpdateUser,
      variables,
    })

    return data!.updateUser!.id!
  }

  private generateInput() {
    const input: CreateUserMutationVariables['input'] = {
      firstname: this.form.firstname!,
      lastname: this.form.lastname!,
      contact_email: this.form.contact_email!,
      contact_number: this.form.contact_number!,
      roles: this.form.roles.map((roleOption) => roleOption.id as UserRole),
    }

    if (this.isCreating || this.loadedData!.email !== this.form.email) {
      input.email = this.form.email!
    }

    if (this.form.password && this.form.password.length > 0) {
      input.password = this.form.password!
    }

    // fill profile image
    if (this.form.foto.isDirty) {
      input.foto = {
        file: this.form.foto.file,
        cropProps: this.form.foto.cropProps!,
        sizeName: this.form.foto.sizeName,
      }
    }

    return input
  }

  deleteUser() {
    if (!this.userId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of user is not possible, as user id is not specified.'],
      })
      return
    }
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this user?', () => {
      const variables: DeleteUserMutationVariables = {
        id: this.userId!,
      }
      this.$apollo
        .mutate({
          mutation: DeleteUser,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('User was successfully removed', 3000)
          await this.$apollo.provider.defaultClient.clearStore()
          this.$router.push('/users')
        })
        .catch((err) => {
          this.$bus.showErrorModal({
            errors: apolloParseErrors(err),
          })
        })
    })
  }
}
</script>
