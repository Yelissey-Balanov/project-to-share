import { extend } from 'vee-validate'
import { required, email, min_value, max_value, numeric, confirmed } from 'vee-validate/dist/rules'
import en from 'vee-validate/dist/locale/en.json'
import { DateTime } from 'luxon'

extend('required', {
  ...required,
  message: en.messages.required,
})

extend('confirmed', {
  ...confirmed,
  message: en.messages.confirmed,
})

extend('email', {
  ...email,
  message: en.messages.email,
})

extend('min_value', {
  ...min_value,
  message: en.messages.min_value,
})

extend('max_value', {
  ...max_value,
  message: en.messages.max_value,
})

extend('numeric', {
  ...numeric,
  message: en.messages.numeric,
})

const currencyRegex = /[\d\.]+/
extend('currency', {
  validate: (value) => currencyRegex.test(value),
  message: en.messages.numeric,
})

extend('isChecked', {
  validate: (value) => value === true,
  message: 'The {_field_} must be selected',
})

extend('date_format', {
  params: ['format'],
  // @ts-ignore
  validate: (value, { format }) => {
    const parsedDate = DateTime.fromFormat(value, format)
    return parsedDate.isValid
    // DateTime.fromFormat(value, format)
  },
  message: 'The {_field_} must be a valid date',
})

extend('time', {
  validate: (value) => /^(([01][0-9])|(2[0-3])):[0-5][0-9]$/.test(value),
  message: 'The {_field_} must be a valid time',
})

const urlRegex = /^(?:(?:(?:https?|ftp):)\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i
extend('url', {
  validate: (value) => urlRegex.test(value),
  message: 'The {_field_} must be a valid URL',
})
