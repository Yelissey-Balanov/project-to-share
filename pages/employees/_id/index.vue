<template>
  <div v-if="employee" class="container pt-5">
    <div class="flex w-full justify-between items-center mb-6 space-x-8">
      <nuxt-link to="/employees" class="tbtn-icon tbtn--white">
        <IHChevronLeft class="w-6 h-6" />
      </nuxt-link>

      <h1>{{ employee.vorname }} {{ employee.familienname }}</h1>

      <div class="flex items-center space-x-2">
        <nuxt-link
          :to="`/employees/${employee.id}/form`"
          class="tbtn-icon tbtn--blue"
          v-if="!employee.deleted_at"
          v-tooltip="'Edit'"
        >
          <IHPencil class="w-6 h-6" />
        </nuxt-link>
      </div>
    </div>

    <div>
      <div class="alert alert-danger" v-if="employee.deleted_at">
        This employee was deleted at {{ employee.deleted_at | datetime }}, therefore it is not editable! You can
        <button class="underline" type="button" @click="restore">restore</button>
        <template v-if="isEmployeeManager">
          or
          <button class="underline" type="button" @click="forceDelete">force delete</button>
        </template>
        this employee.
      </div>
    </div>

    <div class="mb-8 flex flex-col space-y-6">
      <div class="card">
        <div class="card-header">
          <div>
            <h3>Persönliche Angaben</h3>
          </div>
        </div>
        <div class="card-body">
          <div v-if="employee.personalnummer">
            <span class="card-item-title first-col-1-4">Personalnummer</span>
            <span>{{ employee.personalnummer }}</span>
          </div>
          <div v-if="employee.betr_personalnummer">
            <span class="card-item-title first-col-1-4">Betr. Personalnummer</span>
            <span>{{ employee.betr_personalnummer }}</span>
          </div>
          <div v-if="employee.user">
            <span class="card-item-title first-col-1-4">Zugeordnetes Account</span>
            <span>{{ employee.user.firstname }} {{ employee.user.lastname }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Familienname</span>
            <span>{{ employee.familienname }}</span>
          </div>
          <div v-if="employee.geburtsname">
            <span class="card-item-title first-col-1-4">Geburtsname</span>
            <span>{{ employee.geburtsname }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Vorname</span>
            <span>{{ employee.vorname }}</span>
          </div>
          <div v-if="employee.location">
            <span class="card-item-title first-col-1-4">Anschrift</span>
            <span>{{ employee.location.full_address }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Geburtsdatum</span>
            <span>{{ dateFilter(employee.geburtsdatum) }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Geschlecht</span>
            <span>{{ t_de.Gender[employee.geschlecht] }}</span>
          </div>
          <div v-if="employee.versicherungsnummer">
            <span class="card-item-title first-col-1-4">Versicherungsnummer</span>
            <span>{{ employee.versicherungsnummer }}</span>
          </div>
          <div v-if="employee.geburtsort">
            <span class="card-item-title first-col-1-4">Geburtsort, -land - nur bei fehlender Versicherungsnummer</span>
            <span>{{ employee.geburtsort }}</span>
          </div>
          <div v-if="employee.familienstand">
            <span class="card-item-title first-col-1-4">Familienstand</span>
            <span>{{ employee.familienstand }}</span>
          </div>
          <div v-if="employee.staatsangehoerigkeit.length > 0">
            <span class="card-item-title first-col-1-4">Staatsangehörigkeit</span>
            <span>
              <ul class="space-y-2">
                <li v-for="nationality in employee.staatsangehoerigkeit" :key="nationality.id">
                  <span>{{ nationality.name }}</span>
                </li>
              </ul>
            </span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Schwerbehindert</span>
            <span>{{ employee.schwerbehindert ? 'Yes' : 'No' }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">IBAN</span>
            <span>{{ employee.iban }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">BIC</span>
            <span>{{ employee.bic }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3>Beschäftigung</h3>
          </div>
        </div>
        <div class="card-body">
          <div>
            <span class="card-item-title first-col-1-4">Eintrittsdatum</span>
            <span>{{ dateFilter(employee.eintrittsdatum) }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Ersteintrittsdatum</span>
            <span>{{ dateFilter(employee.ersteintrittsdatum) }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Betriebstätte</span>
            <span>{{ employee.betriebsstaette }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Berufsbezeichnung</span>
            <span>{{ employee.berufsbezeichnung }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Ausgeübte Tätigkeit</span>
            <span>{{ employee.ausgeuebte_taetigkeit }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Beschäftigungsart</span>
            <span>{{ t_de.EmployeeBeschaeftigungsart[employee.beschaeftigungsart] }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Ausgeübte Tätigkeit</span>
            <span>{{ employee.probezeit ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="employee.probezeit_dauer">
            <span class="card-item-title first-col-1-4">Dauer der Probezeit</span>
            <span>{{ employee.probezeit_dauer }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Weitere Beschäftigungen ausgeübt</span>
            <span>{{ employee.weitere_beschaeftigungen ? 'Yes' : 'No' }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4"
              >Es handelt sich hierbei um eine geringfügige Beschäftigung</span
            >
            <span>{{ employee.ist_weitere_beschaeftigung_geringfuegig ? 'Yes' : 'No' }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Höchster Schulabschluss</span>
            <span>{{ t_de.EmployeeSchulabschluss[employee.hoechster_schullabschluss] }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Höchster Berufsausbildung</span>
            <span>{{ t_de.EmployeeBerufsausbildung[employee.hoechste_berufsausbildung] }}</span>
          </div>
          <div v-if="employee.beginn_der_ausbildung">
            <span class="card-item-title first-col-1-4">Beginn der Ausbildung</span>
            <span>{{ dateFilter(employee.beginn_der_ausbildung) }}</span>
          </div>
          <div v-if="employee.voraussichtliches_ende_der_ausbildung">
            <span class="card-item-title first-col-1-4">Voraussichtliches Ende der Ausbildung</span>
            <span>{{ employee.voraussichtliches_ende_der_ausbildung }}</span>
          </div>
          <div v-if="employee.im_baugewerbe_seit">
            <span class="card-item-title first-col-1-4">Im Baugewerbe beschäftigt seit</span>
            <span>{{ employee.im_baugewerbe_seit }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Wöchentliche Arbeitszeit</span>
            <span>{{ t_de.EmployeeWoechentlicheArbeitszeit[employee.woechentliche_arbeitszeit] }}</span>
          </div>
          <div v-if="employee.verteilung_der_woechentlichen_arbeitszeit">
            <div class="flex space-x-8">
              <div>
                <span class="card-item-title first-col-1-4">Mo</span>
                <span>{{ employee.verteilung_der_woechentlichen_arbeitszeit.mo }}</span>
              </div>
              <div>
                <span class="card-item-title first-col-1-4">Di</span>
                <span>{{ employee.verteilung_der_woechentlichen_arbeitszeit.di }}</span>
              </div>
              <div>
                <span class="card-item-title first-col-1-4">Mi</span>
                <span>{{ employee.verteilung_der_woechentlichen_arbeitszeit.mi }}</span>
              </div>
              <div>
                <span class="card-item-title first-col-1-4">Do</span>
                <span>{{ employee.verteilung_der_woechentlichen_arbeitszeit.do }}</span>
              </div>
              <div>
                <span class="card-item-title first-col-1-4">Fr</span>
                <span>{{ employee.verteilung_der_woechentlichen_arbeitszeit.fr }}</span>
              </div>
            </div>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Urlaubsanspruch</span>
            <span>{{ employee.urlaubsanspruch }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3>Befristung</h3>
          </div>
        </div>
        <div class="card-body">
          <div>
            <span class="card-item-title first-col-1-3">Das Arbeitsverhältniss ist befristet</span>
            <span>{{ employee.ist_befristet ? 'Yes' : 'No' }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-3">Das Arbeitsverhältniss ist zweckbefristet</span>
            <span>{{ employee.ist_zweckbefristet ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="employee.befristung_arbeitsvertrag_zum">
            <span class="card-item-title first-col-1-3">Befristung Arbeitsvertrag zum</span>
            <span>{{ dateFilter(employee.befristung_arbeitsvertrag_zum) }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-3">Schriftlicher Abschluss des befristeten Arbeitsvertrages</span>
            <span>{{ employee.schrieftlicher_abschluss_des_befristeten_arbeitsvertrages ? 'Yes' : 'No' }}</span>
          </div>
          <div v-if="employee.abschluss_arbeitsvertrag_am">
            <span class="card-item-title first-col-1-3">Abschluss Arbeitsvertrag am</span>
            <span>{{ dateFilter(employee.abschluss_arbeitsvertrag_am) }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-3"
              >Befristete Beschäftigung ist für mindestens 2 Monate vorgesehen, mit Aussicht auf
              Weiterbeschäftigung</span
            >
            <span>{{ employee.befristet_mit_aussicht ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3>Bescheinigungen elektronisch annehmen (Bea)</h3>
          </div>
        </div>
        <div class="card-body">
          <div>
            <span class="card-item-title flex-auto"
              >Ich wiederspreche der elektronischen Übermittlung von Arbeits- und Nebeneinkommenbescheinigungen an die
              Bundesagentur für Arbeit</span
            >
            <span>{{ employee.ich_wiederspreche_bea_an_bafa ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3>Steuer</h3>
          </div>
        </div>
        <div class="card-body">
          <div>
            <span class="card-item-title first-col-1-4">Identifikationsnummer</span>
            <span>{{ employee.identifikationsnummer }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Finanzamt-Nummer</span>
            <span>{{ employee.finanzamt_nummer }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-4">Steuerklasse/Faktor</span>
            <span>{{ employee.steuerklasse_faktor }}</span>
          </div>
          <div v-if="employee.kinderfreibetraege">
            <span class="card-item-title first-col-1-4">Kinderfreibeträge</span>
            <span>{{ employee.kinderfreibetraege }}</span>
          </div>
          <div v-if="employee.kinderfreibetraege">
            <span class="card-item-title first-col-1-4">Kinderfreibeträge</span>
            <span>{{ employee.kinderfreibetraege }}</span>
          </div>
          <div v-if="employee.konfession">
            <span class="card-item-title first-col-1-4">Konfession</span>
            <span>{{ employee.konfession }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3>Sozialversicherung</h3>
          </div>
        </div>
        <div class="card-body">
          <div>
            <span class="card-item-title first-col-1-3"
              >Gesetzliche Krankenkasse (bei PKV: letzte ges. Krankenkasse)</span
            >
            <span>{{ employee.gesetzliche_krankenkasse }}</span>
          </div>
          <div>
            <span class="card-item-title first-col-1-3">Elterneigenschaft</span>
            <span>{{ employee.elterneigenschaft ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3>Entlohnung</h3>
          </div>
        </div>
        <div class="card-body">
          <div v-if="employee.entl_bezeichnung">
            <span class="card-item-title first-col-1-4">Bezeichnung</span>
            <span>{{ employee.entl_bezeichnung }}</span>
          </div>
          <div v-if="employee.entl_betrag">
            <span class="card-item-title first-col-1-4">Betrag</span>
            <span>{{ employee.entl_betrag | currency }}</span>
          </div>
          <div v-if="employee.entl_gueltig_ab">
            <span class="card-item-title first-col-1-4">Gültig ab</span>
            <span>{{ dateFilter(employee.entl_gueltig_ab) }}</span>
          </div>
          <div v-if="employee.stundenlohn">
            <span class="card-item-title first-col-1-4">Stundenlohn</span>
            <span>{{ employee.stundenlohn | currency }}</span>
          </div>
          <div v-if="employee.stundenlohn_gueltig_ab">
            <span class="card-item-title first-col-1-4">Gültig ab</span>
            <span>{{ dateFilter(employee.stundenlohn_gueltig_ab) }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3>VWL - nur notwendig, wenn Vertrag vorliegt</h3>
          </div>
        </div>
        <div class="card-body">
          <div v-if="employee.vwl_empfaenger">
            <span class="card-item-title first-col-1-4">Empfänger VWL</span>
            <span>{{ employee.vwl_empfaenger }}</span>
          </div>
          <div v-if="employee.vwl_betrag">
            <span class="card-item-title first-col-1-4">Betrag</span>
            <span>{{ employee.vwl_betrag | currency }}</span>
          </div>
          <div v-if="employee.vwl_ag_anteil">
            <span class="card-item-title first-col-1-4">AG-Anteil (Höhe mtl.)</span>
            <span>{{ employee.vwl_ag_anteil | currency }}</span>
          </div>
          <div v-if="employee.vwl_seit_wann">
            <span class="card-item-title first-col-1-4">Seit wann</span>
            <span>{{ dateFilter(employee.vwl_seit_wann) }}</span>
          </div>
          <div v-if="employee.vwl_vertragsnummer">
            <span class="card-item-title first-col-1-4">Vertragsnummer</span>
            <span>{{ employee.vwl_vertragsnummer }}</span>
          </div>
          <div v-if="employee.vwl_iban">
            <span class="card-item-title first-col-1-4">IBAN</span>
            <span>{{ employee.vwl_iban }}</span>
          </div>
          <div v-if="employee.vwl_bic">
            <span class="card-item-title first-col-1-4">BIC</span>
            <span>{{ employee.vwl_bic }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <h3>Angaben zu steuerpflichtigen Vorbeschäftigungszeiten im laufenden Kalenderjahr</h3>
          </div>
        </div>
        <div class="card-body">
          <p v-if="employee.steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr.length === 0">
            Keine Angaben
          </p>
          <div
            v-for="(angabe, index) of employee.steuerpflichtige_vorbeschaeftigung_im_laufenden_kalenderjahr"
            :key="'angabe_' + index"
          >
            <div class="grid grid-cols-4 gap-4">
              <div v-if="angabe.zeitraum_von">
                <span class="card-item-title first-col-1-4">Zeitraum von</span>
                <span>{{ dateFilter(angabe.zeitraum_von) }}</span>
              </div>
              <div v-if="angabe.zeitraum_bis">
                <span class="card-item-title first-col-1-4">Zeitraum bis</span>
                <span>{{ dateFilter(angabe.zeitraum_bis) }}</span>
              </div>
              <div v-if="angabe.art_der_beschaeftigung">
                <span class="card-item-title first-col-1-4">Art der Beschäftigung</span>
                <span>{{ angabe.art_der_beschaeftigung }}</span>
              </div>
              <div v-if="angabe.anzahl_der_beschaeftigungstage">
                <span class="card-item-title first-col-1-4">Anzahl der Beschäftigungstage</span>
                <span>{{ angabe.anzahl_der_beschaeftigungstage }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="flex items-center space-x-4">
            <IHFolder class="w-6 h-6 text-gray-700" />
            <h3>Documents</h3>
          </div>
        </div>
        <DocumentsWrapper
          class="divide-y"
          :documents="employee.documents"
          :is-parsing-info-enabled="true"
          :is-sharing-enabled="true"
        >
          <template v-slot:document="slotProps">
            <DocumentRow class="px-6 py-3" v-bind="slotProps" />
          </template>
        </DocumentsWrapper>
      </div>
    </div>

    <div class="mb-8" v-if="isEmployeeManager">
      <button class="h2" @click="isHistoryExpanded = !isHistoryExpanded">Modification history (click to toggle)</button>
      <HistoryList :histories="employee.histories" v-if="isHistoryExpanded" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, State, Vue } from 'nuxt-property-decorator'

import GetEmployeeForView from '@/graphql/ressources/employees/GetEmployeeForView.gql'
import ForceDeleteEmployee from '@/graphql/ressources/employees/ForceDeleteEmployee.gql'
import RestoreEmployee from '@/graphql/ressources/employees/RestoreEmployee.gql'
import {
  ForceDeleteEmployeeMutation,
  ForceDeleteEmployeeMutationVariables,
  GetEmployeeForViewQuery,
  RestoreEmployeeMutation,
  RestoreEmployeeMutationVariables,
  StellaPlugin,
  UserRole,
} from '~/graphql/GQLTypes'
import HistoryList from '~/components/admin/HistoryList.vue'
import { t_de } from '~/helpers/i18n'
import IHChevronLeft from '~/components/globals/icons/heroicons/IHChevronLeft.vue'
import IHPencil from '~/components/globals/icons/heroicons/IHPencil.vue'
import DocumentRow from '~/components/documents/DocumentRow.vue'
import DocumentsWrapper from '~/components/documents/DocumentsWrapper.vue'
import IHFolder from '~/components/globals/icons/heroicons/IHFolder.vue'

@Component({
  components: {
    IHFolder,
    DocumentsWrapper,
    DocumentRow,
    IHPencil,
    IHChevronLeft,
    HistoryList,
  },
  async asyncData({ app, route }) {
    const data: any = {
      employeeId: Number.parseInt(route.params.id),
    }
    if (data.employeeId) {
      const res = await app.apolloProvider!.defaultClient.query<GetEmployeeForViewQuery>({
        query: GetEmployeeForView,
        variables: {
          id: data.employeeId,
        },
      })
      data.employee = res.data.employee
    }
    return data
  },
  head() {
    const employee = (this as EmployeesView).employee
    return {
      title: employee ? `${employee.vorname} ${employee.familienname}` : '',
    }
  },
  middleware: ['auth', 'stellaPlugin'],
  meta: {
    requiredRole: UserRole.EmployeeManager,
    plugin: StellaPlugin.Employees,
  },
})
export default class EmployeesView extends Vue {
  employee: GetEmployeeForViewQuery['employee'] = null
  dateFilter = this.$options.filters!.date
  t_de = t_de

  isHistoryExpanded = false

  @State((state) => state.account.user)
  accountUser

  get isEmployeeManager() {
    return this.accountUser && this.accountUser.roles.includes(UserRole.EmployeeManager)
  }

  mounted() {
    // redirect to overview, if queried id was not found
    if (!this.employee) {
      this.$router.push('/employees')
      return
    }
  }

  forceDelete() {
    const variables: ForceDeleteEmployeeMutationVariables = {
      id: this.employee!.id,
    }
    return this.$apollo
      .mutate<ForceDeleteEmployeeMutation>({
        mutation: ForceDeleteEmployee,
        variables,
      })
      .then(async (result) => {
        await this.$apollo.provider.defaultClient.cache.reset()
        this.$router.push('/employees')
      })
  }

  restore() {
    const variables: RestoreEmployeeMutationVariables = {
      id: this.employee!.id,
    }
    return this.$apollo
      .mutate<RestoreEmployeeMutation>({
        mutation: RestoreEmployee,
        variables,
      })
      .then(async (result) => {
        await this.$apollo.provider.defaultClient.cache.reset()
        this.employee!.deleted_at = null
      })
  }
}
</script>
