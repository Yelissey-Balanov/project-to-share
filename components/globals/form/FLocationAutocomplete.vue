<template>
  <div class="f-specified-multiselect is-single">
    <label v-if="!!label" :class="{ 'is-floating': value || isOpened || isFetchingDetails }">{{ label }}</label>
    <multiselect
      :value="selectedOption"
      @input="handleInput"
      @search-change="handleSearchChange"
      placeholder=""
      :options="locationOptions"
      openDirection="bottom"
      track-by="locationId"
      label="cleanTitle"
      :loading="isLoading || isFetchingDetails"
      @open="isOpened = true"
      @close="isOpened = false"
      :showNoOptions="false"
      :showNoResults="false"
      :internalSearch="false"
      :id="id"
    >
      <template slot="option" slot-scope="props">
        <span v-html="props.option.title"></span>
      </template>
    </multiselect>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
import Axios from 'axios'
import { HERE } from '@/helpers/types'
import _ from 'lodash'
import { Maybe } from '@/graphql/GQLTypes'
import generateFormFieldId from '~/helpers/generateFormFieldId'

interface LocationOption {
  locationId: string
  label?: string
  title: string
  cleanTitle: string
}

export interface LocationAutocompleteValue {
  postal_code?: Maybe<string>
  city?: Maybe<string>
  street?: Maybe<string>
  house_number?: Maybe<string>
  country?: Maybe<string>
  full_address?: Maybe<string>
  lat?: Maybe<number>
  long?: Maybe<number>
  shape?: Maybe<string>
}

@Component
export default class FLocationAutocomplete extends Vue {
  @Prop()
  value?: LocationAutocompleteValue
  @Prop()
  label?: string
  @Prop({ default: false })
  usedForRegion!: boolean

  locationOptions: LocationOption[] = []

  selectedOption: Maybe<LocationOption> = null
  isLoading = false
  isOpened = false
  isFetchingDetails = false

  id = ''

  private givenLocationAutocompleteValueFromOutside: Maybe<LocationAutocompleteValue> = null

  mounted() {
    this.id = generateFormFieldId(this.label)
  }

  handleSearchChange = _.debounce((searchQuery) => {
    this.getSuggestionsFromHere(searchQuery)
  }, 200)

  private sentValueToOutside!: Maybe<LocationAutocompleteValue>

  @Watch('value', { immediate: true })
  onValueChanges(val) {
    // console.log('from', oldVal, 'to', val);
    // parse initialized value into selected option.
    if (val !== this.sentValueToOutside) {
      if (val) {
        // we got some value via v-model. parse it and fill locationOption and selectedOption
        this.locationOptions = [
          {
            locationId: 'currentlyStored',
            cleanTitle: val.full_address || '',
            title: val.full_address || '',
          },
        ]
        this.selectedOption = this.locationOptions[0]
        this.givenLocationAutocompleteValueFromOutside = val
      } else {
        this.selectedOption = null
        this.givenLocationAutocompleteValueFromOutside = null
      }
      this.sentValueToOutside = val
    }
  }

  handleInput(e) {
    this.selectedOption = e

    // after location was selected, fetch detailed information for it
    if (this.selectedOption) {
      if (this.selectedOption.locationId !== 'currentlyStored') {
        this.getGeocodingById().catch((err) => {
          this.displayError(err)
        })
      } else {
        this.sentValueToOutside = this.givenLocationAutocompleteValueFromOutside
        this.$emit('input', this.givenLocationAutocompleteValueFromOutside)
      }
    } else {
      this.sentValueToOutside = null
      this.$emit('input', null)
    }
  }

  private getSuggestionsFromHere(query: string) {
    if (!query) {
      return
    }
    this.isLoading = true
    Axios.get<HERE.SuggestionResponse>(this.$config.here.suggestApi as string, {
      params: {
        app_id: this.$config.hereTokens.appId,
        app_code: this.$config.hereTokens.appCode,
        beginHighlight: '<b>',
        endHighlight: '</b>',
        resultType: this.usedForRegion ? 'areas' : '',
        query,
      },
    })
      .then((response) => {
        this.isLoading = false
        const suggestions: HERE.Suggestion[] = response.data.suggestions
        if (suggestions && suggestions.length > 0) {
          const newOptions: LocationOption[] = []
          suggestions.forEach((suggestion) => {
            if (this.skipForRegion(suggestion)) {
              return
            }
            const radiusNote = !this.usedForRegion ? '' : this.regionAsShape(suggestion.matchLevel) ? '' : ' +100km'
            newOptions.push({
              locationId: suggestion.locationId,
              label: suggestion.label.replace(/<\/?b>/g, ''),
              title: suggestion.label + radiusNote,
              cleanTitle: suggestion.label.replace(/<\/?b>/g, '') + radiusNote,
            })
          })

          this.locationOptions = newOptions
        } else {
          this.locationOptions = []
        }
      })
      .catch((err) => {
        console.error(err)
        this.isLoading = false
      })
  }

  private async getGeocodingById() {
    this.isFetchingDetails = true
    return Axios.get<HERE.GeocoderResponse>(this.$config.here.geocoderApi as string, {
      params: {
        app_id: this.$config.hereTokens.appId,
        app_code: this.$config.hereTokens.appCode,
        gen: 9,
        jsonattributes: 1,
        language: 'en',
        locationid: this.selectedOption!.locationId,
        additionaldata: this.usedForRegion ? 'IncludeShapeLevel,default' : '',
      },
    }).then((response) => {
      if (response.data.response.view.length === 0) {
        return this.getGeocodingByLabel()
      }
      this.processGeocodingResponse(response.data)
    })
  }

  private async getGeocodingByLabel() {
    return Axios.get<HERE.GeocoderResponse>(this.$config.here.geocoderApi as string, {
      params: {
        app_id: this.$config.hereTokens.appId,
        app_code: this.$config.hereTokens.appCode,
        gen: 9,
        jsonattributes: 1,
        language: 'en',
        searchtext: this.selectedOption!.label,
        additionaldata: this.usedForRegion ? 'IncludeShapeLevel,default' : '',
      },
    }).then((response) => {
      if (response.data.response.view.length === 0) {
        throw new Error('No results were found')
      }
      if (response.data.response.view.length > 1) {
        console.warn(
          'Geocoding was made by label and HERE API fetched more that one result! Only first one is selected!'
        )
      }
      this.processGeocodingResponse(response.data)
    })
  }

  private processGeocodingResponse(data: HERE.GeocoderResponse) {
    const result = data.response.view[0].result[0]
    const resultLocation = result.location
    const radiusNote = !this.usedForRegion ? '' : this.regionAsShape(result.matchLevel) ? '' : ' +100km'
    const internalLocation: LocationAutocompleteValue = {
      full_address: resultLocation.address.label + radiusNote,
      postal_code: resultLocation.address.postalCode || null,
      city: resultLocation.address.city || null,
      street: resultLocation.address.street || null,
      house_number: resultLocation.address.houseNumber || null,
      country: resultLocation.address.country || null,
      lat: resultLocation.displayPosition.latitude || null,
      long: resultLocation.displayPosition.longitude || null,
    }

    if (this.usedForRegion) {
      if (this.regionAsShape(result.matchLevel)) {
        internalLocation.shape = resultLocation.shape!.value
      }
    }

    this.sentValueToOutside = internalLocation
    this.$emit('input', internalLocation)
    this.isFetchingDetails = false
  }

  private displayError(err) {
    if (err) {
      console.error(err)
    }
    this.$bus.showErrorModal({
      errors: ['Whoops... HERE could not fetch result for your query...'],
      title: 'HERE API Error',
    })
    this.selectedOption = null
    this.isFetchingDetails = false
    this.sentValueToOutside = null
    this.$emit('input', null)
  }

  private regionAsShape(matchLevel: string) {
    return ['state', 'country', 'county'].includes(matchLevel)
  }

  private skipForRegion(suggestion: HERE.Suggestion) {
    return this.usedForRegion && ['district'].includes(suggestion.matchLevel)
  }
}
</script>

<style scoped lang="scss"></style>
