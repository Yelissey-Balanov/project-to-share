export default function (value) {
  return (!/^(https?:\/\/|mailto:)/.test(value) ? 'https://' : '') + value
}
