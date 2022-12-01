import { CreateLocationInput, CreatePhonenumberInput, Maybe } from '~/graphql/GQLTypes'
// @ts-ignore
import { LocationAutocompleteValue } from '~/components/globals/form/FLocationAutocomplete.vue'

interface IFormLocation extends IFormSingleLocation {
  itemIndex: number
}

interface IFormSingleLocation {
  id?: number
  autocompleteValue: Maybe<LocationAutocompleteValue>
  label: Maybe<string>
}

function generateLocationInput(formLocation: IFormLocation | IFormSingleLocation): CreateLocationInput {
  if (!formLocation.autocompleteValue) {
    throw new Error('autocompleteValue of given object is empty, not able to execute generateLocationInput()')
  }
  return {
    city: formLocation.autocompleteValue.city,
    country: formLocation.autocompleteValue.country,
    full_address: formLocation.autocompleteValue.full_address,
    house_number: formLocation.autocompleteValue.house_number,
    lat: formLocation.autocompleteValue.lat,
    long: formLocation.autocompleteValue.long,
    postal_code: formLocation.autocompleteValue.postal_code,
    street: formLocation.autocompleteValue.street,
    label: formLocation.label,
  }
}

export { IFormLocation, IFormSingleLocation, generateLocationInput }
