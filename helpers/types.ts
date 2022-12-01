import { Vue } from 'vue-property-decorator'
import { CropPropsInput, GetCandidatesForAutocompleteQuery, ImageSizes, Maybe } from '@/graphql/GQLTypes'

// tslint:disable:no-namespace
export namespace HERE {
  export type MatchLevel =
    | 'houseNumber'
    | 'intersection'
    | 'street'
    | 'postalCode'
    | 'district'
    | 'city'
    | 'county'
    | 'state'
    | 'country'

  export type LocationType =
    | 'area'
    | 'address'
    | 'trail'
    | 'park'
    | 'lake'
    | 'mountainPeak'
    | 'volcano'
    | 'river'
    | 'golfCourse'
    | 'industrialComplex'
    | 'island'
    | 'woodland'
    | 'cemetery'
    | 'canalWaterChannel'
    | 'bayHarbor'
    | 'airport'
    | 'hospital'
    | 'sportsComplex'
    | 'shoppingCentre'
    | 'universityCollege'
    | 'nativeAmericanReservation'
    | 'railroad'
    | 'militaryBase'
    | 'parkingLot'
    | 'parkingGarage'
    | 'animalPark'
    | 'beach'
    | 'distanceMarker'

  interface SuggestionAddress {
    country?: string
    state?: string
    county?: string
    city?: string
    district?: string
    street?: string
    houseNumber?: string
    postalCode?: string
  }

  interface GeocoderLocationAddress extends SuggestionAddress {
    label?: string
  }

  export interface Suggestion {
    label: string
    language: string
    countryCode: string
    locationId: string
    address: SuggestionAddress
    distance?: number
    matchLevel: MatchLevel
  }

  export interface SuggestionResponse {
    suggestions: Suggestion[]
  }

  export interface GeocoderResponse {
    response: {
      metaInfo: {
        timestamp: string
      }
      view: Array<{
        result: Array<{
          relevance: number
          matchLevel: MatchLevel
          matchType: 'pointAddress' | 'interpolated'
          location: {
            locationId: string
            locationType: LocationType
            displayPosition: {
              latitude: number
              longitude: number
            }
            navigationPosition: [
              {
                latitude: number
                longitude: number
              }
            ]
            mapView: {
              topLeft: {
                latitude: number
                longitude: number
              }
              bottomRight: {
                latitude: number
                longitude: number
              }
            }
            address: GeocoderLocationAddress
            shape?: {
              value: string
            }
          }
        }>
        viewId: number
      }>
    }
  }

  export interface FLocationAutocompleteValue extends SuggestionAddress {
    latitude: number
    longitude: number
  }
}

export interface NoticePeriodValue {
  amount: Maybe<number>
  unit: string
  to: string
}

export interface IdWithTitle<T = number> {
  id: T
  title: string
}

export type SimpleMultiselectOption = IdWithTitle<string | number>

export type AddToBucketItemType = 'candidate' | 'client' | 'company' | 'project'

export type CandidateAutocompleteValue = NonNullable<GetCandidatesForAutocompleteQuery['candidates']>['data'][0]

export interface CropperInModalData {
  cropProps: Maybe<CropPropsInput>
  fullImage: Maybe<string>
  croppedImage: Maybe<string>
  file: Maybe<File>
  sizeName: Exclude<keyof ImageSizes, '__typename'>
  isDirty: boolean
}
