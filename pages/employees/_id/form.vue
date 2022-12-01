<template>
  <div class="container pt-5">
    <div class="flex w-full justify-start items-center mb-6 space-x-8">
      <nuxt-link :to="`/employees/${isCreating ? '' : $route.params.id}`" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>
      <h1>{{ isCreating ? 'Create' : 'Edit' }} Employee</h1>
    </div>

    <ValidationObserver tag="form" @submit.prevent="onSubmit()" ref="formValidationObserver">
      <div class="flex flex-col space-y-6 mb-8">
        <div class="card">
          <div class="card-header">
            <div>
              <h3>Persönliche Angaben</h3>
            </div>
          </div>
          <div class="space-y-6 p-6">
            <div class="grid grid-cols-3 gap-4">
              <FInput v-model="form.personalnummer" label="Personalnummer" />
              <FInput v-model="form.betr_personalnummer" label="Betr. Personalnummer" />
              <FUserAutocomplete v-model="form.userAutocompleteValue" label="Zugeordnetes Account" />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <FInput v-model="form.familienname" label="Familienname" rules="required" />
              <FInput v-model="form.geburtsname" label="Geburtsname" />
              <FInput v-model="form.vorname" label="Vorname" rules="required" />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <FLocationAutocomplete v-model="form.location.autocompleteValue" label="Anschrift" />
              <FDatePicker v-model="form.geburtsdatum" label="Geburtsdatum" rules="required" />
              <FSelectSimple v-model="form.geschlecht" label="Geschlecht" :options="genderOptions" rules="required" />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <FInput v-model="form.versicherungsnummer" label="Versicherungsnummer" />
              <FInput v-model="form.geburtsort" label="Geburtsort, -land - nur bei fehlender Versicherungsnummer" />
              <FInput v-model="form.familienstand" label="Familienstand" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <FNationalityAutocomplete v-model="form.staatsangehoerigkeit" label="Staatsangehörigkeit" />
              <FCheckbox v-model="form.schwerbehindert" label="Schwerbehindert" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <FInput v-model="form.iban" label="IBAN" rules="required" />
              <FInput v-model="form.bic" label="BIC" rules="required" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3>Beschäftigung</h3>
            </div>
          </div>
          <div class="space-y-6 p-6">
            <div class="grid grid-cols-3 gap-4">
              <FDatePicker v-model="form.eintrittsdatum" label="Eintrittsdatum" rules="required" />
              <FDatePicker v-model="form.ersteintrittsdatum" label="Ersteintrittsdatum" rules="required" />
              <FInput v-model="form.betriebsstaette" label="Betriebstätte" rules="required" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <FInput v-model="form.berufsbezeichnung" label="Berufsbezeichnung" rules="required" />
              <FInput v-model="form.ausgeuebte_taetigkeit" label="Ausgeübte Tätigkeit" rules="required" />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <FSelectSimple
                v-model="form.beschaeftigungsart"
                label="Beschäftigungsart"
                :options="beschaeftigungsartOptions"
                rules="required"
              />
              <FCheckbox v-model="form.probezeit" label="Probezeit" />
              <FInput v-model="form.probezeit_dauer" label="Dauer der Probezeit" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <FCheckbox v-model="form.weitere_beschaeftigungen" label="Weitere Beschäftigungen ausgeübt" />
              <FCheckbox
                v-model="form.ist_weitere_beschaeftigung_geringfuegig"
                label="Es handelt sich hierbei um eine geringfügige Beschäftigung"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <FSelectSimple
                v-model="form.hoechster_schullabschluss"
                label="Höchster Schulabschluss"
                :options="schulabschlussOptions"
                rules="required"
              />
              <FSelectSimple
                v-model="form.hoechste_berufsausbildung"
                label="Höchste Berufsausbildung"
                :options="berufsausbildungOptions"
                rules="required"
              />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <FDatePicker v-model="form.beginn_der_ausbildung" label="Beginn der Ausbildung" />
              <FDatePicker
                v-model="form.voraussichtliches_ende_der_ausbildung"
                label="Voraussichtliches Ende der Ausbildung"
              />
              <FDatePicker v-model="form.im_baugewerbe_seit" label="Im Baugewerbe beschäftigt seit" />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <FSelectSimple
                v-model="form.woechentliche_arbeitszeit"
                label="Wöchentliche Arbeitszeit"
                :options="arbeitszeitOptions"
                rules="required"
              />
              <div class="grid grid-cols-5 gap-4">
                <FInput
                  v-model="form.verteilung_der_woechentlichen_arbeitszeit.mo"
                  label="Mo"
                  :disabled="form.woechentliche_arbeitszeit === EmployeeWoechentlicheArbeitszeit.Vollzeit"
                  @input="calculateUrlaubsanspruch"
                />
                <FInput
                  v-model="form.verteilung_der_woechentlichen_arbeitszeit.di"
                  label="Di"
                  :disabled="form.woechentliche_arbeitszeit === EmployeeWoechentlicheArbeitszeit.Vollzeit"
                  @input="calculateUrlaubsanspruch"
                />
                <FInput
                  v-model="form.verteilung_der_woechentlichen_arbeitszeit.mi"
                  label="Mi"
                  :disabled="form.woechentliche_arbeitszeit === EmployeeWoechentlicheArbeitszeit.Vollzeit"
                  @input="calculateUrlaubsanspruch"
                />
                <FInput
                  v-model="form.verteilung_der_woechentlichen_arbeitszeit.do"
                  label="Do"
                  :disabled="form.woechentliche_arbeitszeit === EmployeeWoechentlicheArbeitszeit.Vollzeit"
                  @input="calculateUrlaubsanspruch"
                />
                <FInput
                  v-model="form.verteilung_der_woechentlichen_arbeitszeit.fr"
                  label="Fr"
                  :disabled="form.woechentliche_arbeitszeit === EmployeeWoechentlicheArbeitszeit.Vollzeit"
                  @input="calculateUrlaubsanspruch"
                />
              </div>
              <FInput v-model="form.urlaubsanspruch" label="Urlaubsanspruch" rules="required" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3>Befristung</h3>
            </div>
          </div>
          <div class="space-y-6 p-6">
            <div class="grid grid-cols-3 gap-4">
              <FCheckbox v-model="form.ist_befristet" label="Das Arbeitsverhältniss ist befristet" />
              <FCheckbox v-model="form.ist_zweckbefristet" label="Das Arbeitsverhältniss ist zweckbefristet" />
              <FDatePicker v-model="form.befristung_arbeitsvertrag_zum" label="Befristung Arbeitsvertrag zum" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <FCheckbox
                v-model="form.schrieftlicher_abschluss_des_befristeten_arbeitsvertrages"
                label="Schriftlicher Abschluss des befristeten Arbeitsvertrages"
              />
              <FDatePicker v-model="form.abschluss_arbeitsvertrag_am" label="Abschluss Arbeitsvertrag am" />
            </div>
            <div class="grid grid-cols-1 gap-4">
              <FCheckbox
                v-model="form.befristet_mit_aussicht"
                label="Befristete Beschäftigung ist für mindestens 2 Monate vorgesehen, mit Aussicht auf Weiterbeschäftigung"
              />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3>Bescheinigungen elektronisch annehmen (Bea)</h3>
            </div>
          </div>
          <div class="space-y-6 p-6">
            <div class="grid grid-cols-1 gap-4">
              <FCheckbox
                v-model="form.ich_wiederspreche_bea_an_bafa"
                label="Ich wiederspreche der elektronischen Übermittlung von Arbeits- und Nebeneinkommenbescheinigungen an die Bundesagentur für Arbeit"
              />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3>Steuer</h3>
            </div>
          </div>
          <div class="space-y-6 p-6">
            <div class="grid grid-cols-3 gap-4">
              <FInput v-model="form.identifikationsnummer" label="Identifikationsnummer" rules="required" />
              <FInput v-model="form.finanzamt_nummer" label="Finanzamt-Nummer" rules="required" />
              <FInput v-model="form.steuerklasse_faktor" label="Steuerklasse/Faktor" rules="required" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <FInput v-model="form.kinderfreibetraege" label="Kinderfreibeträge" />
              <FInput v-model="form.konfession" label="Konfession" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3>Sozialversicherung</h3>
            </div>
          </div>
          <div class="space-y-6 p-6">
            <div class="grid grid-cols-2 gap-4">
              <FInput
                v-model="form.gesetzliche_krankenkasse"
                label="Gesetzliche Krankenkasse (bei PKV: letzte ges. Krankenkasse)"
                rules="required"
              />
              <FCheckbox v-model="form.elterneigenschaft" label="Elterneigenschaft"  />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3>Entlohnung</h3>
            </div>
          </div>
          <div class="space-y-6 p-6">
            <div class="grid grid-cols-3 gap-4">
              <FInput v-model="form.entl_bezeichnung" label="Bezeichnung" />
              <FInput v-model="form.entl_betrag" label="Betrag" :asCurrency="true" :rules="'currency'" />
              <FDatePicker v-model="form.entl_gueltig_ab" label="Gültig ab" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <FInput v-model="form.stundenlohn" label="Stundenlohn" :asCurrency="true" :rules="'currency'" />
              <FDatePicker v-model="form.stundenlohn_gueltig_ab" label="Gültig ab" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3>VWL - nur notwendig, wenn Vertrag vorliegt</h3>
            </div>
          </div>
          <div class="space-y-6 p-6">
            <div class="grid grid-cols-3 gap-4">
              <FInput v-model="form.vwl_empfaenger" label="Empfänger VWL" />
              <FInput v-model="form.vwl_betrag" label="Betrag" :asCurrency="true" :rules="'currency'" />
              <FInput
                v-model="form.vwl_ag_anteil"
                label="AG-Anteil (Höhe mtl.)"
                :asCurrency="true"
                :rules="'currency'"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <FDatePicker v-model="form.vwl_seit_wann" label="Seit wann" />
              <FInput v-model="form.vwl_vertragsnummer" label="Vertragsnummer" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <FInput v-model="form.vwl_iban" label="IBAN" />
              <FInput v-model="form.vwl_bic" label="BIC" />
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3>Angaben zu steuerpflichtigen Vorbeschäftigungszeiten im laufenden Kalenderjahr </h3>
            <button
              type="button"
              class="tbtn tbtn-icon tbtn-icon--small tbtn--green"
              @click="addEmptyVorbeschaeftigung"
            >
              <IPlus class="w-5 h-5"></IPlus>
            </button>
          </div>
          <div class="divide-y">
            <div
              class="flex space-x-6 p-6"
              v-for="(formAngabe, index) of form.steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr"
              :key="formAngabe.itemIndex"
            >
              <div class="grid grid-cols-4 gap-4 flex-auto">
                <FDatePicker v-model="formAngabe.value.zeitraum_von" label="Zeitraum von" />
                <FDatePicker v-model="formAngabe.value.zeitraum_bis" label="Zeitraum bis" />
                <FInput v-model="formAngabe.value.art_der_beschaeftigung" label="Art der Beschäftigung" />
                <FInput
                  v-model="formAngabe.value.anzahl_der_beschaeftigungstage"
                  label="Anzahl der Beschäftigungstage"
                />
              </div>
              <button
                class="tbtn tbtn-icon tbtn-icon--small tbtn--red"
                type="button"
                @click="form.steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr.splice(index, 1)"
              >
                <IMinus class="w-5 h-5"></IMinus>
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="flex items-center space-x-4">
              <IHFolder class="w-6 h-6 text-gray-700" />
              <h3>Documents</h3>
            </div>
            <div>
              <input
                type="file"
                multiple
                @change="form.documents.processSelectedDocuments($refs.addDocumentsInput.files)"
                style="display: none"
                ref="addDocumentsInput"
              />
              <button
                type="button"
                class="tbtn tbtn-icon tbtn-icon--small tbtn--green"
                @click="$refs.addDocumentsInput.click()"
              >
                <IPlus class="w-5 h-5"></IPlus>
              </button>
            </div>
          </div>
          <div class="divide-y">
            <div
              class="flex space-x-6 p-6"
              v-for="(formDocument, index) in form.documents.documents"
              :key="formDocument.itemIndex"
            >
              <div class="space-y-6 flex-auto">
                <FileIcon :mime_type="formDocument.mime_type" />
                <FInput v-model="formDocument.title" label="Title" />
                <FSelectDocumentTags v-model="formDocument.tags" label="Tags" />
              </div>
              <button
                type="button"
                class="tbtn tbtn-icon tbtn-icon--small tbtn--red"
                @click="form.documents.deleteDocument(formDocument, index)"
              >
                <IMinus class="w-5 h-5"></IMinus>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-action-buttons">
        <button class="tbtn tbtn--red mr-auto" v-if="!isCreating" type="button" @click="deleteEmployee">
          Delete
        </button>
        <nuxt-link to="." class="tbtn tbtn--white">Abort</nuxt-link>
        <button class="tbtn tbtn--blue">Save</button>
      </div>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'

import GetEmployee from '@/graphql/ressources/employees/GetEmployee.gql'
import DeleteEmployee from '@/graphql/ressources/employees/DeleteEmployee.gql'
import CreateEmployee from '@/graphql/ressources/employees/CreateEmployee.gql'
import UpdateEmployee from '@/graphql/ressources/employees/UpdateEmployee.gql'
import UpdateEmployeeDocuments from '@/graphql/ressources/employees/UpdateEmployeeDocuments.gql'

import { apolloParseErrors } from '~/helpers/apolloParseErrors'
import {
  CreateEmployeeMutation,
  CreateEmployeeMutationVariables,
  DeleteEmployeeMutationVariables,
  EmployeeBerufsausbildung,
  EmployeeBeschaeftigungsart,
  EmployeeSchulabschluss,
  EmployeeWoechentlicheArbeitszeit,
  Gender,
  GetEmployeeQuery,
  GetUsersForAutocompleteQuery,
  Maybe,
  StellaPlugin,
  UpdateEmployeeDocumentsMutation,
  UpdateEmployeeDocumentsMutationVariables,
  UpdateEmployeeMutation,
  UpdateEmployeeMutationVariables,
  UserRole,
} from '~/graphql/GQLTypes'
import { ValidationObserver } from 'vee-validate'
import { validateObserver } from '~/helpers/validationHelpers'
import { DocumentsForm } from '~/helpers/fileUploadHelpers'
import { generateLocationInput, IFormSingleLocation } from '~/helpers/locationHelpers'
import FNationalityAutocomplete from '~/components/admin/FNationalityAutocomplete.vue'
import {
  employeeBerufsausbildungOptions,
  employeeBeschaeftigungsartOptions,
  employeeSchulabschlussOptions,
  employeeWoechentlicheArbeitszeitOptions,
  genderOptions,
} from '~/helpers/simpleSelectorOptions'
import { parseDateFromISO, toISODate } from '~/helpers/dateHelpers'
import FUserAutocomplete from '~/components/admin/FUserAutocomplete.vue'
import FileIcon from '~/components/admin/FileIcon.vue'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import IHFolder from '~/components/globals/icons/heroicons/IHFolder.vue'

@Component({
  components: { IHFolder, IHChevronLeft, FileIcon, FUserAutocomplete, FNationalityAutocomplete, ValidationObserver },
  async asyncData({ app, route }) {
    const data: any = {
      isCreating: route.params.id === 'new',
      employeeId: Number.parseInt(route.params.id),
    }
    if (!data.isCreating) {
      const res = await app.apolloProvider!.defaultClient.query<GetEmployeeQuery>({
        query: GetEmployee,
        variables: {
          id: data.employeeId,
        },
      })
      data.loadedData = res.data.employee
    }
    return data
  },
  head() {
    return {
      title: `${(this as EmployeesEdit).isCreating ? 'Create' : 'Edit'} employee`,
    }
  },
  middleware: ['auth', 'stellaPlugin'],
  meta: {
    requiredRole: UserRole.EmployeeManager,
    plugin: StellaPlugin.Employees,
  },
})
export default class EmployeesEdit extends Vue {
  $refs!: {
    formValidationObserver: InstanceType<typeof ValidationObserver>
    addDocumentsInput: HTMLInputElement
  }
  EmployeeWoechentlicheArbeitszeit = EmployeeWoechentlicheArbeitszeit
  isCreating = false

  form: {
    userAutocompleteValue: Maybe<NonNullable<GetUsersForAutocompleteQuery['users']>['data'][0]>
    personalnummer: Maybe<string>
    betr_personalnummer: Maybe<string>
    familienname: Maybe<string>
    geburtsname: Maybe<string>
    vorname: Maybe<string>
    geburtsdatum: Maybe<Date>
    geschlecht: Maybe<Gender>
    versicherungsnummer: Maybe<string>
    geburtsort: Maybe<string>
    familienstand: Maybe<string>
    schwerbehindert: boolean
    iban: Maybe<string>
    bic: Maybe<string>
    eintrittsdatum: Maybe<Date>
    ersteintrittsdatum: Maybe<Date>
    betriebsstaette: Maybe<string>
    berufsbezeichnung: Maybe<string>
    ausgeuebte_taetigkeit: Maybe<string>
    beschaeftigungsart: Maybe<EmployeeBeschaeftigungsart>
    probezeit: boolean
    probezeit_dauer: Maybe<string>
    weitere_beschaeftigungen: boolean
    ist_weitere_beschaeftigung_geringfuegig: boolean
    hoechster_schullabschluss: Maybe<EmployeeSchulabschluss>
    hoechste_berufsausbildung: Maybe<EmployeeBerufsausbildung>
    beginn_der_ausbildung: Maybe<Date>
    voraussichtliches_ende_der_ausbildung: Maybe<Date>
    im_baugewerbe_seit: Maybe<Date>
    woechentliche_arbeitszeit: Maybe<EmployeeWoechentlicheArbeitszeit>
    verteilung_der_woechentlichen_arbeitszeit: {
      mo: number
      di: number
      mi: number
      do: number
      fr: number
    }
    urlaubsanspruch: Maybe<number>
    ist_befristet: boolean
    ist_zweckbefristet: boolean
    befristung_arbeitsvertrag_zum: Maybe<Date>
    schrieftlicher_abschluss_des_befristeten_arbeitsvertrages: boolean
    abschluss_arbeitsvertrag_am: Maybe<Date>
    befristet_mit_aussicht: boolean
    ich_wiederspreche_bea_an_bafa: boolean
    identifikationsnummer: Maybe<string>
    finanzamt_nummer: Maybe<string>
    steuerklasse_faktor: Maybe<string>
    kinderfreibetraege: Maybe<string>
    konfession: Maybe<string>
    gesetzliche_krankenkasse: Maybe<string>
    elterneigenschaft: boolean
    entl_bezeichnung: Maybe<string>
    entl_betrag: Maybe<number>
    entl_gueltig_ab: Maybe<Date>
    stundenlohn: Maybe<number>
    stundenlohn_gueltig_ab: Maybe<Date>
    vwl_empfaenger: Maybe<string>
    vwl_betrag: Maybe<number>
    vwl_ag_anteil: Maybe<number>
    vwl_seit_wann: Maybe<Date>
    vwl_vertragsnummer: Maybe<string>
    vwl_iban: Maybe<string>
    vwl_bic: Maybe<string>
    steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr: Array<{
      itemIndex: number
      value: {
        zeitraum_von: Maybe<Date>
        zeitraum_bis: Maybe<Date>
        art_der_beschaeftigung: Maybe<string>
        anzahl_der_beschaeftigungstage: Maybe<string>
      }
    }>
    staatsangehoerigkeit: string[]
    location: IFormSingleLocation
    documents: DocumentsForm
  } = {
    userAutocompleteValue: null,
    personalnummer: null,
    betr_personalnummer: null,
    familienname: null,
    geburtsname: null,
    vorname: null,
    geburtsdatum: null,
    geschlecht: null,
    versicherungsnummer: null,
    geburtsort: null,
    familienstand: null,
    schwerbehindert: false,
    iban: null,
    bic: null,
    eintrittsdatum: null,
    ersteintrittsdatum: null,
    betriebsstaette: null,
    berufsbezeichnung: null,
    ausgeuebte_taetigkeit: null,
    beschaeftigungsart: null,
    probezeit: false,
    probezeit_dauer: null,
    weitere_beschaeftigungen: false,
    ist_weitere_beschaeftigung_geringfuegig: false,
    hoechster_schullabschluss: null,
    hoechste_berufsausbildung: null,
    beginn_der_ausbildung: null,
    voraussichtliches_ende_der_ausbildung: null,
    im_baugewerbe_seit: null,
    woechentliche_arbeitszeit: null,
    verteilung_der_woechentlichen_arbeitszeit: {
      mo: 8,
      di: 8,
      mi: 8,
      do: 8,
      fr: 8,
    },
    urlaubsanspruch: 30,
    ist_befristet: false,
    ist_zweckbefristet: false,
    befristung_arbeitsvertrag_zum: null,
    schrieftlicher_abschluss_des_befristeten_arbeitsvertrages: false,
    abschluss_arbeitsvertrag_am: null,
    befristet_mit_aussicht: false,
    ich_wiederspreche_bea_an_bafa: false,
    identifikationsnummer: null,
    finanzamt_nummer: null,
    steuerklasse_faktor: null,
    kinderfreibetraege: null,
    konfession: null,
    gesetzliche_krankenkasse: null,
    elterneigenschaft: false,
    entl_bezeichnung: null,
    entl_betrag: null,
    entl_gueltig_ab: null,
    stundenlohn: null,
    stundenlohn_gueltig_ab: null,
    vwl_empfaenger: null,
    vwl_betrag: null,
    vwl_ag_anteil: null,
    vwl_seit_wann: null,
    vwl_vertragsnummer: null,
    vwl_iban: null,
    vwl_bic: null,
    steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr: [],
    staatsangehoerigkeit: [],
    location: {
      label: null,
      autocompleteValue: null,
    },
    documents: new DocumentsForm(),
  }

  genderOptions = genderOptions
  beschaeftigungsartOptions = employeeBeschaeftigungsartOptions
  schulabschlussOptions = employeeSchulabschlussOptions
  berufsausbildungOptions = employeeBerufsausbildungOptions
  arbeitszeitOptions = employeeWoechentlicheArbeitszeitOptions

  loadedData!: Maybe<GetEmployeeQuery['employee']>
  private employeeId: number | null = null

  private incrementalIndex = 0
  private isSubmitting = false

  @Watch('form.woechentliche_arbeitszeit')
  onWoechentlicheArbeitszeitChanged() {
    if (this.form.woechentliche_arbeitszeit === EmployeeWoechentlicheArbeitszeit.Vollzeit) {
      this.form.verteilung_der_woechentlichen_arbeitszeit.mo = 8
      this.form.verteilung_der_woechentlichen_arbeitszeit.di = 8
      this.form.verteilung_der_woechentlichen_arbeitszeit.mi = 8
      this.form.verteilung_der_woechentlichen_arbeitszeit.do = 8
      this.form.verteilung_der_woechentlichen_arbeitszeit.fr = 8
      this.calculateUrlaubsanspruch()
    }
  }

  created() {
    // redirect to overview, if queried id was not found
    if (!this.isCreating && !this.loadedData) {
      this.$router.push('/employees')
      return
    }

    // fetch data, when editing
    if (!this.isCreating && this.loadedData) {
      this.form.personalnummer = this.loadedData.personalnummer!
      this.form.betr_personalnummer = this.loadedData.betr_personalnummer!
      this.form.familienname = this.loadedData.familienname
      this.form.geburtsname = this.loadedData.geburtsname!
      this.form.vorname = this.loadedData.vorname
      this.form.geburtsdatum = parseDateFromISO(this.loadedData.geburtsdatum)
      this.form.geschlecht = this.loadedData.geschlecht
      this.form.versicherungsnummer = this.loadedData.versicherungsnummer!
      this.form.geburtsort = this.loadedData.geburtsort!
      this.form.familienstand = this.loadedData.familienstand!
      this.form.schwerbehindert = this.loadedData.schwerbehindert!
      this.form.iban = this.loadedData.iban
      this.form.bic = this.loadedData.bic
      this.form.eintrittsdatum = parseDateFromISO(this.loadedData.eintrittsdatum)
      this.form.ersteintrittsdatum = parseDateFromISO(this.loadedData.ersteintrittsdatum)
      this.form.betriebsstaette = this.loadedData.betriebsstaette
      this.form.berufsbezeichnung = this.loadedData.berufsbezeichnung
      this.form.ausgeuebte_taetigkeit = this.loadedData.ausgeuebte_taetigkeit
      this.form.beschaeftigungsart = this.loadedData.beschaeftigungsart
      this.form.probezeit = this.loadedData.probezeit
      this.form.probezeit_dauer = this.loadedData.probezeit_dauer!
      this.form.weitere_beschaeftigungen = this.loadedData.weitere_beschaeftigungen
      this.form.ist_weitere_beschaeftigung_geringfuegig = this.loadedData.ist_weitere_beschaeftigung_geringfuegig
      this.form.hoechster_schullabschluss = this.loadedData.hoechster_schullabschluss
      this.form.hoechste_berufsausbildung = this.loadedData.hoechste_berufsausbildung
      this.form.beginn_der_ausbildung = parseDateFromISO(this.loadedData.beginn_der_ausbildung)
      this.form.voraussichtliches_ende_der_ausbildung = parseDateFromISO(
        this.loadedData.voraussichtliches_ende_der_ausbildung
      )
      this.form.im_baugewerbe_seit = parseDateFromISO(this.loadedData.im_baugewerbe_seit)
      this.form.woechentliche_arbeitszeit = this.loadedData.woechentliche_arbeitszeit
      this.form.verteilung_der_woechentlichen_arbeitszeit = this.loadedData.verteilung_der_woechentlichen_arbeitszeit
      this.form.urlaubsanspruch = this.loadedData.urlaubsanspruch
      this.form.ist_befristet = this.loadedData.ist_befristet
      this.form.ist_zweckbefristet = this.loadedData.ist_zweckbefristet
      this.form.befristung_arbeitsvertrag_zum = parseDateFromISO(this.loadedData.befristung_arbeitsvertrag_zum)
      this.form.schrieftlicher_abschluss_des_befristeten_arbeitsvertrages = this.loadedData.schrieftlicher_abschluss_des_befristeten_arbeitsvertrages
      this.form.abschluss_arbeitsvertrag_am = parseDateFromISO(this.loadedData.abschluss_arbeitsvertrag_am)
      this.form.befristet_mit_aussicht = this.loadedData.befristet_mit_aussicht
      this.form.ich_wiederspreche_bea_an_bafa = this.loadedData.ich_wiederspreche_bea_an_bafa
      this.form.identifikationsnummer = this.loadedData.identifikationsnummer
      this.form.finanzamt_nummer = this.loadedData.finanzamt_nummer
      this.form.steuerklasse_faktor = this.loadedData.steuerklasse_faktor
      this.form.kinderfreibetraege = this.loadedData.kinderfreibetraege!
      this.form.konfession = this.loadedData.konfession!
      this.form.gesetzliche_krankenkasse = this.loadedData.gesetzliche_krankenkasse
      this.form.elterneigenschaft = this.loadedData.elterneigenschaft!
      this.form.entl_bezeichnung = this.loadedData.entl_bezeichnung!
      this.form.entl_betrag = this.loadedData.entl_betrag!
      this.form.entl_gueltig_ab = parseDateFromISO(this.loadedData.entl_gueltig_ab)
      this.form.stundenlohn = this.loadedData.stundenlohn!
      this.form.stundenlohn_gueltig_ab = parseDateFromISO(this.loadedData.stundenlohn_gueltig_ab)
      this.form.vwl_empfaenger = this.loadedData.vwl_empfaenger!
      this.form.vwl_betrag = this.loadedData.vwl_betrag!
      this.form.vwl_ag_anteil = this.loadedData.vwl_ag_anteil!
      this.form.vwl_seit_wann = parseDateFromISO(this.loadedData.vwl_seit_wann)
      this.form.vwl_vertragsnummer = this.loadedData.vwl_vertragsnummer!
      this.form.vwl_iban = this.loadedData.vwl_iban!
      this.form.vwl_bic = this.loadedData.vwl_bic!
      this.form.steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr = this.loadedData.steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr.map(
        (item) => ({
          itemIndex: this.incrementalIndex++,
          value: {
            zeitraum_von: parseDateFromISO(item.zeitraum_von),
            zeitraum_bis: parseDateFromISO(item.zeitraum_bis),
            art_der_beschaeftigung: item.art_der_beschaeftigung!,
            anzahl_der_beschaeftigungstage: item.anzahl_der_beschaeftigungstage!,
          },
        })
      )

      this.form.staatsangehoerigkeit = this.loadedData.staatsangehoerigkeit.map((nationality) => nationality.id)

      if (this.loadedData.location) {
        const storedLocation = this.loadedData.location
        delete storedLocation.__typename
        this.form.location = {
          id: storedLocation.id,
          autocompleteValue: storedLocation,
          label: null,
        }
      }

      if (this.loadedData.user) {
        this.form.userAutocompleteValue = {
          id: this.loadedData.user.id,
          firstname: this.loadedData.user.firstname,
          lastname: this.loadedData.user.lastname,
        }
      }

      this.loadedData.documents.forEach((document) => {
        this.form.documents.add({
          id: document.id,
          title: document.title,
          mime_type: document.mime_type,
          tags: document.tags,
        })
      })
    }
  }

  calculateUrlaubsanspruch() {
    let days = 0
    Object.values(this.form.verteilung_der_woechentlichen_arbeitszeit)
      .map((h) => (isNaN(parseInt(h as any)) ? 0 : parseInt(h as any)))
      .forEach((h) => {
        if (h > 0) {
          days += 1
        }
      })
    // calculate full days in the week
    this.form.urlaubsanspruch = Math.floor((30 / 5) * days)
  }

  addEmptyVorbeschaeftigung() {
    this.form.steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr.unshift({
      itemIndex: this.incrementalIndex++,
      value: {
        zeitraum_von: null,
        zeitraum_bis: null,
        art_der_beschaeftigung: null,
        anzahl_der_beschaeftigungstage: null,
      },
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
      this.$store.commit('updateGenericModal', {
        text: 'Storing form values...',
        progress: 0,
        blocking: true,
      })
      this.$bus.showGenericModal()

      // determine if we should run create or update mutation
      // let createOrUpdateFn = this.isCreating ? this.createEmployee : this.updateEmployee;
      let createOrUpdateFn = this.isCreating ? this.createEmployee : this.updateEmployee
      // store employeeId
      this.employeeId = await createOrUpdateFn()
      // as we store employee in 2 steps, mark that employee was already created
      this.isCreating = false

      this.$store.commit('updateGenericModal', {
        text: 'Storing documents...',
        progress: Math.round(100 / 2),
      })
      // process documents changes
      await this.updateEmployeeDocuments()
      this.$bus.hideGenericModal()

      // everything went good, clear store and navigate back to list overview
      this.$bus.showSuccessModal('Employee was successfully ' + (this.isCreating ? 'created' : 'updated'), 3000)
      this.isSubmitting = false
      await this.$apollo.provider.defaultClient.clearStore()
      this.$router.push('/employees/' + this.employeeId)
    } catch (err) {
      this.isSubmitting = false
      console.error(err)
      this.$bus.hideGenericModal()
      this.$bus.showErrorModal({
        errors: apolloParseErrors(err),
      })
    }
  }

  async createEmployee(): Promise<number> {
    const variables: CreateEmployeeMutationVariables = {
      input: this.generateInput(),
    }

    // process location
    if (this.form.location.autocompleteValue) {
      variables.input.location = {
        create: {
          ...generateLocationInput(this.form.location),
        },
      }
    }

    const { data } = await this.$apollo.mutate<CreateEmployeeMutation>({
      mutation: CreateEmployee,
      variables,
    })

    return data!.createEmployee!.id
  }

  async updateEmployee(): Promise<number> {
    if (!this.employeeId) {
      throw new Error("employeeId is empty, can't call updateConsultant()")
    }
    const variables: UpdateEmployeeMutationVariables = {
      id: this.employeeId,
      input: this.generateInput(),
    }

    // process location changes
    if (this.form.location.autocompleteValue) {
      // autocomplete value exists
      if (this.form.location.id) {
        // if location ID is defined, update location
        variables.input.location = {
          update: {
            ...generateLocationInput(this.form.location),
            id: this.form.location.id,
          },
        }
      } else {
        // otherwise create new location
        variables.input.location = {
          create: {
            ...generateLocationInput(this.form.location),
          },
        }
      }
    } else {
      // autocomple value is empty
      if (this.form.location.id) {
        // if ID of location is present, delete this location
        variables.input.location = {
          delete: this.form.location.id,
        }
      }
    }

    const { data } = await this.$apollo.mutate<UpdateEmployeeMutation>({
      mutation: UpdateEmployee,
      variables,
    })

    return data!.updateEmployee!.id
  }

  async updateEmployeeDocuments(): Promise<{ data?: UpdateEmployeeDocumentsMutation }> {
    if (!this.employeeId) {
      throw new Error('this.candidateId is not set! Calling updateCandidateDocuments() is not allowed')
    }
    const variables: UpdateEmployeeDocumentsMutationVariables = {
      id: this.employeeId,
      input: this.form.documents.generateMutationInput(),
    }

    const response = await this.$apollo.mutate({
      mutation: UpdateEmployeeDocuments,
      variables,
      context: {
        fetchOptions: {
          onUploadProgress: (progressEvent) => {
            this.$store.commit('updateGenericModal', {
              progress: Math.round(100 / 2 + ((100 / 2) * progressEvent.loaded) / progressEvent.total),
            })
          },
        },
      },
    })

    return response
  }

  deleteEmployee() {
    if (!this.employeeId) {
      this.$bus.showErrorModal({
        errors: ['Deletion of employee is not possible, as employee id is not specified.'],
      })
      return
    }
    this.$bus.showDeleteConfirmModal('Are you sure you want to delete this employee?', () => {
      const variables: DeleteEmployeeMutationVariables = {
        id: this.employeeId!,
      }
      this.$apollo
        .mutate({
          mutation: DeleteEmployee,
          variables,
        })
        .then(async () => {
          this.$bus.showSuccessModal('Employee was successfully removed', 3000)
          await this.$apollo.provider.defaultClient.clearStore()
          this.$router.push('/employees')
        })
        .catch((err) => {
          this.$bus.showErrorModal({
            errors: apolloParseErrors(err),
          })
        })
    })
  }

  private generateInput(): CreateEmployeeMutationVariables['input'] {
    // sanitize values
    Object.keys(this.form.verteilung_der_woechentlichen_arbeitszeit).forEach((day) => {
      const int = parseInt(this.form.verteilung_der_woechentlichen_arbeitszeit[day])
      this.form.verteilung_der_woechentlichen_arbeitszeit[day] = isNaN(int) ? 0 : int
    })

    return {
      user_id: this.form.userAutocompleteValue ? this.form.userAutocompleteValue.id : null,
      personalnummer: this.form.personalnummer!,
      betr_personalnummer: this.form.betr_personalnummer!,
      familienname: this.form.familienname!,
      geburtsname: this.form.geburtsname!,
      vorname: this.form.vorname!,
      geburtsdatum: toISODate(this.form.geburtsdatum),
      geschlecht: this.form.geschlecht!,
      versicherungsnummer: this.form.versicherungsnummer!,
      geburtsort: this.form.geburtsort!,
      familienstand: this.form.familienstand!,
      schwerbehindert: this.form.schwerbehindert!,
      iban: this.form.iban!,
      bic: this.form.bic!,
      eintrittsdatum: toISODate(this.form.eintrittsdatum)!,
      ersteintrittsdatum: toISODate(this.form.ersteintrittsdatum)!,
      betriebsstaette: this.form.betriebsstaette!,
      berufsbezeichnung: this.form.berufsbezeichnung!,
      ausgeuebte_taetigkeit: this.form.ausgeuebte_taetigkeit!,
      beschaeftigungsart: this.form.beschaeftigungsart!,
      probezeit: this.form.probezeit!,
      probezeit_dauer: this.form.probezeit_dauer!,
      weitere_beschaeftigungen: this.form.weitere_beschaeftigungen!,
      ist_weitere_beschaeftigung_geringfuegig: this.form.ist_weitere_beschaeftigung_geringfuegig!,
      hoechster_schullabschluss: this.form.hoechster_schullabschluss!,
      hoechste_berufsausbildung: this.form.hoechste_berufsausbildung!,
      beginn_der_ausbildung: toISODate(this.form.beginn_der_ausbildung),
      voraussichtliches_ende_der_ausbildung: toISODate(this.form.voraussichtliches_ende_der_ausbildung),
      im_baugewerbe_seit: toISODate(this.form.im_baugewerbe_seit),
      woechentliche_arbeitszeit: this.form.woechentliche_arbeitszeit!,
      verteilung_der_woechentlichen_arbeitszeit: this.form.verteilung_der_woechentlichen_arbeitszeit!,
      urlaubsanspruch: this.form.urlaubsanspruch!,
      ist_befristet: this.form.ist_befristet!,
      ist_zweckbefristet: this.form.ist_zweckbefristet!,
      befristung_arbeitsvertrag_zum: toISODate(this.form.befristung_arbeitsvertrag_zum),
      schrieftlicher_abschluss_des_befristeten_arbeitsvertrages: this.form
        .schrieftlicher_abschluss_des_befristeten_arbeitsvertrages!,
      abschluss_arbeitsvertrag_am: toISODate(this.form.abschluss_arbeitsvertrag_am),
      befristet_mit_aussicht: this.form.befristet_mit_aussicht!,
      ich_wiederspreche_bea_an_bafa: this.form.ich_wiederspreche_bea_an_bafa!,
      identifikationsnummer: this.form.identifikationsnummer!,
      finanzamt_nummer: this.form.finanzamt_nummer!,
      steuerklasse_faktor: this.form.steuerklasse_faktor!,
      kinderfreibetraege: this.form.kinderfreibetraege!,
      konfession: this.form.konfession!,
      gesetzliche_krankenkasse: this.form.gesetzliche_krankenkasse!,
      elterneigenschaft: this.form.elterneigenschaft!,
      entl_bezeichnung: this.form.entl_bezeichnung!,
      entl_betrag: this.form.entl_betrag!,
      entl_gueltig_ab: toISODate(this.form.entl_gueltig_ab),
      stundenlohn: this.form.stundenlohn!,
      stundenlohn_gueltig_ab: toISODate(this.form.stundenlohn_gueltig_ab),
      vwl_empfaenger: this.form.vwl_empfaenger!,
      vwl_betrag: this.form.vwl_betrag!,
      vwl_ag_anteil: this.form.vwl_ag_anteil!,
      vwl_seit_wann: toISODate(this.form.vwl_seit_wann),
      vwl_vertragsnummer: this.form.vwl_vertragsnummer!,
      vwl_iban: this.form.vwl_iban!,
      vwl_bic: this.form.vwl_bic!,
      steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr: this.form.steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr.map(
        (item) => {
          return {
            zeitraum_von: toISODate(item.value.zeitraum_von),
            zeitraum_bis: toISODate(item.value.zeitraum_bis),
            art_der_beschaeftigung: item.value.art_der_beschaeftigung,
            anzahl_der_beschaeftigungstage: item.value.anzahl_der_beschaeftigungstage,
          }
        }
      ),

      staatsangehoerigkeit: {
        sync: this.form.staatsangehoerigkeit.map((nationality) => ({ id: nationality })),
      },
    }
  }
}
</script>
