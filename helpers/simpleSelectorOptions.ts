import {
  EmployeeBerufsausbildung,
  EmployeeBeschaeftigungsart,
  EmployeeSchulabschluss,
  EmployeeWoechentlicheArbeitszeit,
  Gender,
  WorkPlace,
  WorkTime,
} from '~/graphql/GQLTypes'
import { t_de } from '~/helpers/i18n'

const genderOptions = {}
Object.values(Gender).forEach((item) => {
  genderOptions[item] = t_de.Gender[item]
})

const employeeBeschaeftigungsartOptions = {}
Object.values(EmployeeBeschaeftigungsart).forEach((item) => {
  employeeBeschaeftigungsartOptions[item] = t_de.EmployeeBeschaeftigungsart[item]
})

const employeeBerufsausbildungOptions = {}
Object.values(EmployeeBerufsausbildung).forEach((item) => {
  employeeBerufsausbildungOptions[item] = t_de.EmployeeBerufsausbildung[item]
})

const employeeSchulabschlussOptions = {}
Object.values(EmployeeSchulabschluss).forEach((item) => {
  employeeSchulabschlussOptions[item] = t_de.EmployeeSchulabschluss[item]
})

const employeeWoechentlicheArbeitszeitOptions = {}
Object.values(EmployeeWoechentlicheArbeitszeit).forEach((item) => {
  employeeWoechentlicheArbeitszeitOptions[item] = t_de.EmployeeWoechentlicheArbeitszeit[item]
})

const workTimeOptions = {}
Object.values(WorkTime).forEach((item) => {
  workTimeOptions[item] = t_de.WorkTime[item]
})

const workPlaceOptions = {}
Object.values(WorkPlace).forEach((item) => {
  workPlaceOptions[item] = t_de.WorkPlace[item]
})

export {
  genderOptions,
  employeeBeschaeftigungsartOptions,
  employeeBerufsausbildungOptions,
  employeeSchulabschlussOptions,
  employeeWoechentlicheArbeitszeitOptions,
  workTimeOptions,
  workPlaceOptions,
}
