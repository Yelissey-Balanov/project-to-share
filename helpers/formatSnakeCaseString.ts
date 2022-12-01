export default function (value) {
  if (typeof value !== 'string') {
    return value
  }
  const words = value.toLowerCase().split('_')
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ')
}
