export default function (label?: string): string {
  let slug = ''
  if (label) {
    slug = label.toLowerCase().replace(/[^a-zöäüß]/g, '-')
  }
  return slug + '_' + Math.random().toString(36).substr(2)
}
