declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module '*.gql' {
  import { DocumentNode } from 'graphql'

  const value: DocumentNode
  export default value
}
