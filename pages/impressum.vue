<template>
  <div class="legal-pages">
    <div class="container">
      <h1>IMPRESSUM</h1>

      <h2 class="no-chapter-prefix">Angaben gemäß § 5 TMG:</h2>
      <p>
        BLACKBULL INTERNATIONAL GmbH<br />
        Schumannstraße 27<br />
        60325 Frankfurt am Main
      </p>
      <p>
        Vertreten durch:<br />
        Sven Wesley Guk-Hyong Herget<br />
        Fatih Ayar
      </p>

      <h2 class="no-chapter-prefix">Registereintrag:</h2>
      <p>
        Eintragung im Handelsregister<br />
        Registergericht: Frankfurt am Main<br />
        Registernummer: 102499<br />
        <br />
        Umsatzsteuer-Identifikationsnummer:<br />
        UStID DE295124064
      </p>

      <h2 class="no-chapter-prefix">Haftungshinweise</h2>
      <p>
        Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den
        Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich. Die hier veröffentlichten Daten
        sind urheberrechtlich geschützt. Es wird keine Haftung für Fehler im Text und fehlerhafte Verlinkungen
        übernommen. Anzeigen auf fremden Internetseiten sowie Reproduktion ist ohne schriftliche Genehmigung untersagt.
      </p>
    </div>

    <TermsFooter v-if="!isCandidate" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TermsFooter from '~/components/TermsFooter.vue'
import { namespace } from 'nuxt-property-decorator'

@Component({
  components: { TermsFooter },
  head: {
    title: 'Impressum',
  },
})
export default class TermsOfUse extends Vue {
  @(namespace('account').Getter('isCandidate'))
  isCandidate!: boolean
}
</script>
