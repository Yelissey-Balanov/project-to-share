import { DateTime } from 'luxon'

export function parseDateFromISO(value: string | null | undefined) {
  return value ? DateTime.fromISO(value).toJSDate() : null
}

export function toISODate(value: Date | null | string) {
  if (!value) {
    return null
  }
  if (typeof value === 'string') {
    return DateTime.fromISO(value).toISODate()
  }
  return DateTime.fromJSDate(value).toISODate()
}
