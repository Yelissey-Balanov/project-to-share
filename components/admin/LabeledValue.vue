<template>
  <div class="labeled-value">
    <template v-if="arrayValue">
      <div :class="{ 'space-y-1': asList }">
        <span
          class="tbadge tbadge--small tbadge--blue whitespace-nowrap"
          :class="{ 'm-0.5': !asList }"
          v-for="itemValue in arrayValue"
        >
          <template v-if="itemValue.internalLink">
            <template v-if="asHtml">
              <nuxt-link :to="itemValue.internalLink" v-html="itemValue.label"></nuxt-link>
            </template>
            <template v-else>
              <nuxt-link :to="itemValue.internalLink">{{ itemValue.label }}</nuxt-link>
            </template>
          </template>
          <template v-else>
            <span v-if="asHtml" v-html="itemValue.label"></span>
            <span v-else>
              {{ itemValue.label }}
            </span>
          </template>
        </span>
      </div>
    </template>
    <template v-else>
      <template v-if="hrefLink">
        <a :href="hrefLink" target="_blank" class="labeled-value--simple-value"
          >{{ simpleValue }}
          <template v-if="compareValueFormatted">
            <span class="text-black">/</span>
            <span :class="compareToValueClass">{{ compareValueFormatted }}</span>
          </template>
        </a>
      </template>
      <template v-else-if="internalLink">
        <div class="labeled-value--simple-value">
          <span class="tbadge tbadge--red" v-if="value && value.deleted_at">DELETED</span>
          <nuxt-link :to="internalLink"
            >{{ simpleValue }}
            <template v-if="compareValueFormatted">
              <span class="text-black">/</span>
              <span :class="compareToValueClass" v-if="compareValueFormatted">
                {{ compareValueFormatted }}
              </span>
            </template>
          </nuxt-link>
        </div>
      </template>
      <template v-else>
        <div class="labeled-value--simple-value" :class="{ 'pre-wrap': preWrap }"
          >{{ simpleValue }}
          <template v-if="compareValueFormatted">
            <span class="text-black">/</span>
            <span :class="compareToValueClass">{{ compareValueFormatted }}</span>
          </template>
        </div>
      </template>
    </template>
    <div class="labeled-value--label" v-if="label">{{ label }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import { Maybe } from '~/graphql/GQLTypes'
import sanitizeUrl from '~/helpers/sanitizeUrl'

interface ArrayItem {
  label: string
  internalLink?: string
}

@Component
export default class LabeledValue extends Vue {
  @Prop()
  value?: any
  @Prop()
  label?: string
  @Prop()
  attr?: string
  @Prop()
  formatted?: string
  @Prop()
  mapFn?: () => {}
  @Prop()
  internalLinkMapFn?: () => {}
  @Prop()
  link?: string
  @Prop()
  internalLink?: string
  @Prop()
  asBoolean?: boolean
  @Prop({ default: false })
  asCurrency?: boolean
  @Prop()
  currencyOptions?: any
  @Prop()
  asHtml?: boolean

  @Prop()
  compareToValue?: any
  @Prop({ default: '' })
  compareToValueClass?: any
  @Prop({ default: false })
  forceComparedToValue?: boolean

  @Prop({ default: false })
  preWrap?: boolean
  @Prop({ default: false })
  asList?: boolean

  hrefLink: Maybe<string> = null
  private simpleValue: any = null
  private compareValueFormatted: any = null
  private arrayValue: ArrayItem[] | any = null

  private FORMATTED_NULLABLE_VALUE = '---'

  @Watch('value', { immediate: true })
  onValueChanged(newValue) {
    this.reinitializeValues()
  }

  @Watch('compareToValue')
  onCompareToValueChanged(newValue) {
    this.reinitializeValues()
  }

  private reinitializeValues() {
    // format given value
    const formattedValue = this.formatValue(this.value)
    if ('simpleValue' in formattedValue) {
      this.simpleValue = formattedValue.simpleValue
    } else if ('arrayValue' in formattedValue) {
      this.arrayValue = formattedValue.arrayValue
    }

    // NOTE: compare value was never used to compare arrays, though after refactoring it is possible, but not implemented!
    if (this.compareToValue || this.forceComparedToValue) {
      const formattedCompareValue = this.formatValue(this.compareToValue)
      if ('simpleValue' in formattedCompareValue) {
        this.compareValueFormatted = formattedCompareValue.simpleValue
      }
    }

    // sanitize link
    if (this.simpleValue !== this.FORMATTED_NULLABLE_VALUE && this.link) {
      this.hrefLink = sanitizeUrl(this.link)
    }
  }

  private formatValue(value): { simpleValue?: any; arrayValue?: any[] } {
    // format boolean values
    if (this.asBoolean === true) {
      return {
        simpleValue: value ? 'Yes' : 'No',
      }
    }

    // format empty values
    if (!value || value.length === 0) {
      return {
        simpleValue: this.FORMATTED_NULLABLE_VALUE,
      }
    }

    // format array values
    if (Array.isArray(value)) {
      let arrayValue: any[] = []
      if (this.mapFn) {
        const labels = value.map(this.mapFn)
        if (this.internalLinkMapFn) {
          const internalLinks = value.map(this.internalLinkMapFn)
          const mergedArray: ArrayItem[] = []
          for (let i = 0; i < labels.length; i++) {
            mergedArray.push({
              label: labels[i] as string,
              internalLink: internalLinks[i] as string,
            })
          }
          arrayValue = mergedArray
        } else {
          arrayValue = labels.map((itemValue) => ({ label: itemValue }))
        }
      } else {
        arrayValue = value.map((itemValue) => ({ label: itemValue }))
      }
      return { arrayValue }
    }

    // format objects value via given attr
    if (this.attr) {
      return {
        simpleValue: this.applyCurrencyFilterIfNeeded(value[this.attr]),
      }
    }

    // format object value via formatted string
    if (this.formatted) {
      return {
        simpleValue: this.formatted.replace(/{([^}]+)}/g, (match, attr) => {
          if (attr === '_value_') {
            return value
          }

          const attrs = attr.split('.')
          let attrValue = value
          for (let i = 0; i < attrs.length; i++) {
            if (!(attrs[i] in attrValue)) {
              return undefined
            }
            attrValue = attrValue[attrs[i]]
          }
          return attrValue !== undefined ? (attrValue === null ? '' : attrValue) : `{${attr}}`
        }),
      }
    }

    // return simple value
    return {
      simpleValue: this.applyCurrencyFilterIfNeeded(value),
    }
  }

  private applyCurrencyFilterIfNeeded(value) {
    if (this.asCurrency) {
      return this.$options.filters!.currency(value, this.currencyOptions)
    }
    return value
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/variables';

.labeled-value {
  position: relative;
  margin-top: 1em;
  margin-bottom: 1em;
}

.labeled-value--simple-value {
  padding: 1px 0 4px 0;
  display: block;
  width: 100%;
  letter-spacing: 0.03em;

  &.pre-wrap {
    white-space: pre-line;
  }
}

.labeled-value--array {
  /*padding: 4px 0;*/
  //display: block;
  //width: 100%;
  //letter-spacing: 0.03em;
  //
  //&.display-as-pills {
  //  display: flex;
  //  flex-wrap: wrap;
  //
  //  .labeled-value--array--item {
  //    padding: 3px 7px 3px;
  //    font-size: 13px;
  //    line-height: 14px;
  //    border-radius: 5px;
  //    margin-right: 0.4em;
  //    color: #fff;
  //    background: $color-primary;
  //    margin-bottom: 0.4em;
  //    white-space: nowrap;
  //    overflow: hidden;
  //    max-width: 100%;
  //    text-overflow: ellipsis;
  //
  //    a {
  //      color: #fff;
  //    }
  //  }
  //}
  //
  //&.display-as-list {
  //  .labeled-value--array--item {
  //    display: block;
  //    line-height: 1;
  //    margin-top: 4px;
  //    margin-bottom: 6px;
  //    white-space: nowrap;
  //    overflow: hidden;
  //    max-width: 100%;
  //    text-overflow: ellipsis;
  //
  //    &::before {
  //      content: '';
  //      border-radius: 50%;
  //      width: 3px;
  //      height: 3px;
  //      background: $color-primary;
  //      display: inline-block;
  //      vertical-align: middle;
  //      margin-right: 5px;
  //      position: relative;
  //      top: -1px;
  //    }
  //  }
  //}
}

.labeled-value--label {
  position: absolute;
  top: 3px;
  left: 0;
  pointer-events: none;
  font-weight: 400;
  transform-origin: left top;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: mix($color-text, white, 60);
  transform: translateY(-17px) scale(0.8);
}
</style>
