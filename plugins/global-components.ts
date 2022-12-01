import Vue from 'vue'
import { DateTime } from 'luxon'
import { Gender, Maybe } from '@/graphql/GQLTypes'
import Multiselect from 'vue-multiselect'
import FInput from '@/components/globals/form/FInput.vue'
import FLocationAutocomplete from '@/components/globals/form/FLocationAutocomplete.vue'
import FSelectIndustries from '~/components/globals/form/FSelectIndustries.vue'
import FSelectCertifications from '~/components/globals/form/FSelectCertifications.vue'
import FSelectInstitutions from '~/components/globals/form/FSelectInstitutions.vue'
import FSelectSkills from '~/components/globals/form/FSelectSkills.vue'
import FSelectSimple from '@/components/globals/form/FSelectSimple.vue'
import FMultiselect from '@/components/globals/form/FMultiselect.vue'
import FTextarea from '@/components/globals/form/FTextarea.vue'
import IPencil from '@/components/globals/icons/IPencil.vue'
import IDownload from '@/components/globals/icons/IDownload.vue'
import IInfo from '@/components/globals/icons/IInfo.vue'
import IMinus from '@/components/globals/icons/IMinus.vue'
import IPlus from '@/components/globals/icons/IPlus.vue'
import IFilePDF from '@/components/globals/icons/IFilePDF.vue'
import IFileDOC from '@/components/globals/icons/IFileDOC.vue'
import IFileZIP from '@/components/globals/icons/IFileZIP.vue'
import IFileUnknown from '@/components/globals/icons/IFileUnknown.vue'
import IEye from '@/components/globals/icons/IEye.vue'
import IMoneyBag from '@/components/globals/icons/IMoneyBag.vue'
import IWarning from '@/components/globals/icons/IWarning.vue'
import IShare from '~/components/globals/icons/IShare.vue'
import FSelectLanguage from '~/components/globals/form/FSelectLanguage.vue'
import FCheckbox from '~/components/globals/form/FCheckbox.vue'
import FSelectDocumentTags from '~/components/globals/form/FSelectDocumentTags.vue'
import FSelectItSkills from '@/components/globals/form/FSelectItSkills.vue'
import FDatePicker from '~/components/globals/form/FDatePicker.vue'
import formatSnakeCaseString from '~/helpers/formatSnakeCaseString'
import VueCurrencyFilter from 'vue-currency-filter'
import { NoticePeriodValue } from '~/helpers/types'
import VTooltip from 'v-tooltip'
import replaceUnderscoreWithSpace from '~/helpers/replaceUnderscoreWithSpace'
import LImg from '~/components/LImg.vue'

// region register all components from globals folder
// as long PHPStorm can't recognize dynamically included global components, they are included manually...
// const globalComponents = require['context'](
//     // The relative path of the components folder
//     './components/globals',
//     // Whether or not to look in subfolders
//     true,
//     // The regular expression used to match base component filenames
//     /\w+\.vue$/
// );
//
// globalComponents.keys().forEach(fileName => {
//     // Get component config
//     const componentConfig = globalComponents(fileName);
//
//     // Get PascalCase name of component
//     const splittedFileName = (<string>fileName).split('/');
//     const componentName = splittedFileName[splittedFileName.length - 1].replace('.vue', '');
//
//     // Register component globally
//     Vue.component(
//         componentName,
//         // Look for the component options on `.default`, which will
//         // exist if the component was exported with `export default`,
//         // otherwise fall back to module's root.
//         componentConfig.default || componentConfig
//     );
// });
// manual including of components
Vue.component('LImg', LImg)
// forms
Vue.component('FInput', FInput)
Vue.component('FCheckbox', FCheckbox)
Vue.component('FLocationAutocomplete', FLocationAutocomplete)
Vue.component('FSelectIndustries', FSelectIndustries)
Vue.component('FSelectDocumentTags', FSelectDocumentTags)
Vue.component('FSelectCertifications', FSelectCertifications)
Vue.component('FSelectInstitutions', FSelectInstitutions)
Vue.component('FSelectItSkills', FSelectItSkills)
Vue.component('FSelectSkills', FSelectSkills)
Vue.component('FSelectLanguage', FSelectLanguage)
Vue.component('FSelectSimple', FSelectSimple)
Vue.component('FMultiselect', FMultiselect)
Vue.component('FTextarea', FTextarea)
Vue.component('FDatePicker', FDatePicker)
// icons
Vue.component('IPencil', IPencil)
Vue.component('IMinus', IMinus)
Vue.component('IPlus', IPlus)
Vue.component('IDownload', IDownload)
Vue.component('IInfo', IInfo)
Vue.component('IFilePDF', IFilePDF)
Vue.component('IFileDOC', IFileDOC)
Vue.component('IFileZIP', IFileZIP)
Vue.component('IFileUnknown', IFileUnknown)
Vue.component('IEye', IEye)
Vue.component('IMoneyBag', IMoneyBag)
Vue.component('IWarning', IWarning)
Vue.component('IShare', IShare)
// endregion

// register v-tooltop directive and component
Vue.use(VTooltip)

// register multiselect
Vue.component('multiselect', Multiselect)

// add filters
Vue.use(VueCurrencyFilter, {
  symbol: '€',
  thousandsSeparator: '.',
  fractionCount: 2,
  fractionSeparator: ',',
  symbolPosition: 'front',
  symbolSpacing: true,
})

Vue.filter('gender', (value) => {
  if (value === Gender.Male) {
    return 'Male'
  } else if (value === Gender.Female) {
    return 'Female'
  }
})

Vue.filter('wordForMonth', (value) => {
  return {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  }[value]
})

const dateFilter = (value, isUTC = false) => {
  if (value) {
    let dt = DateTime.fromISO(value)
    if (!dt.isValid) {
      // as fallback try to parse from Date
      dt = DateTime.fromJSDate(value)
      if (!dt.isValid) {
        return value
      }
    }
    if (isUTC) {
      dt = dt.toUTC()
    }
    return dt.toLocaleString({
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
  return null
}

Vue.filter('date', dateFilter)
Vue.filter('dateRange', (value) => {
  if (!Array.isArray(value)) {
    return null
  }
  if (value[0] && !value[1]) {
    return `From ${dateFilter(value[0], true)}`
  } else if (value[0] && value[1]) {
    return `${dateFilter(value[0], true)} - ${dateFilter(value[1], true)}`
  } else if (!value[0] && value[1]) {
    return `Till ${dateFilter(value[1], true)}`
  }
  return null
})
Vue.filter('time', (value) => {
  if (value) {
    const dt = DateTime.fromISO(value)
    if (!dt.isValid) {
      return value
    }
    return dt.toLocaleString({
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return null
})

Vue.filter('datetime', (value, isUTC = false) => {
  if (value) {
    let dt = DateTime.fromISO(value)
    if (!dt.isValid) {
      // as fallback try to parse from Date
      dt = DateTime.fromJSDate(value)
      if (!dt.isValid) {
        return value
      }
    }
    if (isUTC) {
      dt = dt.toUTC()
    }
    return dt.toLocaleString({
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return null
})

Vue.filter('prettyJson', (value) => {
  return JSON.stringify(value, null, 2)
})

Vue.filter('noticePeriod', (value: Maybe<NoticePeriodValue>) => {
  if (!value) {
    return null
  }
  const translateUnit = {
    d: 'day',
    w: 'week',
    m: 'month',
  }

  const translateTo = {
    eom: 'to the end of month',
    mom: 'to the middle of month',
    eoq: 'to the end of quarter',
    moy: 'to the middle of year',
    eoy: 'to the end of year',
  }

  let formattedString = `${value.amount} ${translateUnit[value.unit]}`
  if (value.amount !== 1) {
    formattedString += 's'
  }

  if (value.to) {
    formattedString += ` ${translateTo[value.to]}`
  }

  return formattedString
})

Vue.filter('formatSnakeCaseString', formatSnakeCaseString)
Vue.filter('replaceUnderscoreWithSpace', replaceUnderscoreWithSpace)

Vue.filter('timeDuration', (seconds: number) => {
  const hours = Math.floor(seconds / (60 * 60))
  seconds = seconds - hours * 60 * 60
  const minutes = Math.floor(seconds / 60)
  return (hours ? `${hours} h. ` : '') + `${minutes} min.`
})

Vue.filter('shortTextFromHtml', (html: string) => {
  if (!process.client) {
    return ''
  }
  html = html.replace(/<\/p>/g, '$& ')
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
})

Vue.filter('maxLength', (text: string, maxLength: number = 200) => {
  return text ? (text.length > maxLength ? text.substr(0, maxLength) + '...' : text) : null
})
