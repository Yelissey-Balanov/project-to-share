<template>
  <client-only>
    <SweetModal ref="modal" title="Einwilligung zur Speicherung der Daten">
      <p>
        Blackbull International GmbH (nachfolgend „<b>Blackbull International</b>“) wird, sofern die Einwilligung
        erteilt wird, Daten, die Sie im Rahmen der Registrierung zur Nutzung der Blackbull Plattform an Blackbull
        International übermittelten, auch nach Wegfall des ursprünglichen Zweckes der Übermittlung weiter speichern. Die
        Daten sind für Mitarbeiter von Blackbull International sichtbar, die diese auswerten können, um zu überprüfen,
        ob Sie gegebenenfalls auch für eine zukünftige offene Position bei einem Kunden von Blackbull International in
        Frage kommen. Sollte dies der Fall sein, wird Blackbull International Sie kontaktieren und fragen, ob Sie
        Interesse an der Position haben und der Offenlegung Ihrer Daten an den entsprechenden Kunden zustimmen. Eine
        Offenlegung der Daten an Kunden von Blackbull International erfolgt jedoch nur, wenn Sie hierzu Ihre gesonderte
        Einwilligung gegeben haben.
      </p>
      <p>Sie können Ihre Daten jederzeit ändern.</p>
      <p>
        Die Abgabe der Einwilligungserklärung ist freiwillig. Eine Registrierung ist auch ohne Abgabe der
        Einwilligungserklärung möglich. Die Daten werden dann nur zu dem Zweck verarbeitet, zu dem sie durch die
        Registrierung übermittelt werden. Blackbull International kann Ihnen dann aber keine für Sie möglicherweise in
        Zukunft interessanten Stellen anbieten.
      </p>
      <p>
        Sie können Ihre erteilte Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen. Hierzu genügt ein
        Schreiben, ein Fax oder eine E-Mail an
      </p>
      <p>
        <b>Blackbull International GmbH</b><br />
        Schumannstraße 27<br />
        60325 Frankfurt am Main<br />
        Fax: +49 69 254246-199
        <br />E-Mail: <a href="mailto:contact@blackbull-international.com">contact@blackbull-international.com</a>
      </p>
      <p>
        Weitere Informationen zur Verarbeitung von Daten durch Blackbull International gibt die Datenschutzerklärung.
      </p>

      <br />
      <h2>Einwilligung</h2>

      <p>
        Ich willige hiermit ein, dass Blackbull International meine mit der Registrierung abgegebenen Daten auch über
        den ursprünglichen Zweck der Datenübermittlung hinaus in der Blackbull International-Plattform speichert, um
        diese auszuwerten, ob ich gegebenenfalls auch für eine zukünftige offene Position bei einem Kunden von Blackbull
        International in Frage komme und mich hierzu auch kontaktieren kann. Eine Offenlegung dieser Daten an einen
        Kunden von Blackbull International bedarf jedoch meiner gesonderten Einwilligung.
      </p>
      <p>Ich kann diese Einwilligungserklärung jederzeit mit Wirkung für die Zukunft widerrufen.</p>
    </SweetModal>
  </client-only>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import Vue from 'vue'

@Component
export default class DataStorageConsent extends Vue {
  $refs!: {
    modal: any
  }

  open() {
    this.$refs.modal.open()
  }

  close() {
    this.$refs.modal.close()
  }
}
</script>
