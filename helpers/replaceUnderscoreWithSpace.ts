export default function (value) {
  if (typeof value !== 'string') {
    return value
  }
  return value.replace(/_/g, ' ')
}
