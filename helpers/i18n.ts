// simple i18n array in de
import {
  EmployeeBerufsausbildung,
  EmployeeBeschaeftigungsart,
  EmployeeSchulabschluss,
  EmployeeWoechentlicheArbeitszeit,
  Gender,
  WorkPlace,
  WorkTime,
} from '~/graphql/GQLTypes'

export const t_de = {
  Gender: {
    [Gender.Male]: 'Männlich',
    [Gender.Female]: 'Weiblich',
    [Gender.Diverse]: 'Divers',
  },
  EmployeeBeschaeftigungsart: {
    [EmployeeBeschaeftigungsart.Hauptbeschaeftigung]: 'Hauptbeschäftigung',
    [EmployeeBeschaeftigungsart.Nebenbeschaeftigung]: 'Nebenbeschäftigung',
  },
  EmployeeBerufsausbildung: {
    [EmployeeBerufsausbildung.Ohne]: 'Ohne beruflichen Ausbildungsabschluss',
    [EmployeeBerufsausbildung.Anerkannte]: 'Anerkannte Berufsausbildung',
    [EmployeeBerufsausbildung.MeisterTechnicker]: 'Meister/Technicker/gleichwertiger Fachschulabschluss',
    [EmployeeBerufsausbildung.Bachelor]: 'Bachelor',
    [EmployeeBerufsausbildung.DiplomMagisterMasterStaatsexamem]: 'Diplom/Magister/Master/Staatsexamen',
    [EmployeeBerufsausbildung.Promotion]: 'Promotion',
  },
  EmployeeSchulabschluss: {
    [EmployeeSchulabschluss.Ohne]: 'Ohne Schulabschluss',
    [EmployeeSchulabschluss.HauptVolks]: 'Haupt-/Volksschulabschluss',
    [EmployeeSchulabschluss.MittlereReife]: 'Mittlere Reife/gleichwertiger Abschluss',
    [EmployeeSchulabschluss.Abitur]: 'Abitur/Fachabitur',
  },
  EmployeeWoechentlicheArbeitszeit: {
    [EmployeeWoechentlicheArbeitszeit.Vollzeit]: 'Vollzeit',
    [EmployeeWoechentlicheArbeitszeit.Teilzeit]: 'Teilzeit',
  },
  WorkTime: {
    [WorkTime.Fulltime]: 'Vollzeit',
    [WorkTime.Parttime]: 'Teilzeit',
    [WorkTime.FulltimeAndParttime]: 'Vollzeit und Teilzeit',
  },
  WorkPlace: {
    [WorkPlace.Onsite]: 'Vor Ort',
    [WorkPlace.Remote]: 'Remote',
    [WorkPlace.RemoteAndOnsite]: 'Vor Ort und Remote',
  },
}
