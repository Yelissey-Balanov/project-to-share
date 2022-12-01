<template>
  <div id="pdfvuer">
    <!--    <div id="buttons" class="ui grey three item inverted bottom fixed menu transition hidden">-->
    <!--      <a class="item" @click="page > 1 ? page&#45;&#45; : 1">-->
    <!--        <i class="left chevron icon"></i>-->
    <!--        Back-->
    <!--      </a>-->
    <!--      <a class="ui active item">-->
    <!--        {{page}} / {{ numPages ? numPages : '∞' }}-->
    <!--      </a>-->
    <!--      <a class="item" @click="page < numPages ? page++ : 1">-->
    <!--        Forward-->
    <!--        <i class="right chevron icon"></i>-->
    <!--      </a>-->
    <!--    </div>-->
    <!--    <div id="buttons" class="ui grey three item inverted bottom fixed menu transition hidden">-->
    <!--      <a class="item" @click="scale -= scale > 0.2 ? 0.1 : 0">-->
    <!--        <i class="left chevron icon"/>-->
    <!--        Zoom - -->
    <!--      </a>-->
    <!--      <a class="ui active item">-->
    <!--        {{ formattedZoom }} %-->
    <!--      </a>-->
    <!--      <a class="item" @click="scale += scale < 2 ? 0.1 : 0">-->
    <!--        Zoom +-->
    <!--        <i class="right chevron icon"/>-->
    <!--      </a>-->
    <!--    </div>-->
    <div class="text-2xl min-h-[80vh] flex items-center justify-center text-center" v-if="numPages === 0"
      >Loading PDF Document...</div
    >
    <template v-if="numPages > 0">
      <component
        :is="pdfvuer"
        :src="pdfdata"
        v-for="i in numPages"
        :key="'pdfvuer_' + i"
        :id="i"
        :page="i"
        :scale.sync="scale"
        style="width: 100%; margin: 20px auto"
      >
      </component>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import 'pdfvuer/dist/pdfvuer.css'

@Component
export default class PDFViewer extends Vue {
  @Prop()
  url?: string
  @Prop()
  scale?: number

  page = 1
  numPages = 0
  pdfdata: any = undefined
  // scale: string | number = 'page-width';

  // get formattedZoom() {
  //   return Number.parseInt(this.scale as string) * 100;
  // }

  get pdfvuer() {
    return () => import('pdfvuer')
  }

  mounted() {
    this.getPdf()
  }

  @Watch('page')
  onPageChanged(p) {
    if (
      window.pageYOffset <= this.findPos(document.getElementById(p)) ||
      (document.getElementById(p + 1) && window.pageYOffset >= this.findPos(document.getElementById(p + 1)))
    ) {
      // window.scrollTo(0,this.findPos(document.getElementById(p)));
      document.getElementById(p)!.scrollIntoView()
    }
  }

  @Watch('url')
  private async onUrlChanges() {
    this.pdfdata = undefined
    this.numPages = 0
    this.page = 1
    this.getPdf()
  }

  async getPdf() {
    if (!this.url) {
      return
    }
    // if (!this.pdfvuer) {
    //   await this.loadPdfvuer();
    // }
    const pdfvuer: any = await this.pdfvuer()
    this.pdfdata = pdfvuer.default.createLoadingTask(this.url)
    const pdf = await this.pdfdata
    this.numPages = pdf.numPages
    // window.onscroll = function() {
    //   changePage();
    //   stickyNav();
    // };
    //
    // // Get the offset position of the navbar
    // var sticky = $('#buttons')[0].offsetTop;

    // Add the sticky class to the this.$refs.nav when you reach its scroll position. Remove "sticky" when you leave the scroll position
    // function stickyNav() {
    //   if (window.pageYOffset >= sticky) {
    //     $('#buttons')[0].classList.remove('hidden');
    //   } else {
    //     $('#buttons')[0].classList.add('hidden');
    //   }
    // }
    //
    // function changePage() {
    //   var i = 1,
    //     count = Number(pdf.numPages);
    //   do {
    //     if (
    //       window.pageYOffset >= this.findPos(document.getElementById(i)) &&
    //       window.pageYOffset <= this.findPos(document.getElementById(i + 1))
    //     ) {
    //       this.page = i;
    //     }
    //     i++;
    //   } while (i < count);
    //   if (window.pageYOffset >= this.findPos(document.getElementById(i))) {
    //     this.page = i;
    //   }
    // }
  }

  findPos(obj) {
    return obj.offsetTop
  }
}
</script>
