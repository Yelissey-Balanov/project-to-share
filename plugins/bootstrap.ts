import { Plugin } from '@nuxt/types'

const plugin: Plugin = ({ req, $config }) => {
  let host = ''
  if (process.server) {
    // grab domain name from request
    host = req.headers.host!
  } else {
    // grab domain name from location
    host = location.host
  }
  let hostWithoutPort = host

  if (host.indexOf('localhost') !== 0) {
    // update config depending on host
    $config.baseClientUrl = `https://${host}`
    $config.baseServerUrl = `https://${host}`
    $config.publicUrl = `https://${host}/storage/`
    $config.graphqlEndpoint = `https://${host}/graphql`
    $config.wsHost = hostWithoutPort
  } else {
    hostWithoutPort = 'localhost'
  }

  if (process.server) {
    $config.wsKey = Buffer.from(hostWithoutPort).toString('base64')
  } else {
    $config.wsKey = btoa(hostWithoutPort)
  }
}
export default plugin
