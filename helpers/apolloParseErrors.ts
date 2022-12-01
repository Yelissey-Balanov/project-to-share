export function apolloParseErrors(err): string[] {
  const errors: string[] = []
  if (err.graphQLErrors) {
    err.graphQLErrors.forEach((gqlError) => {
      if (gqlError.extensions && gqlError.extensions.validation) {
        // we got a validation error from graphql transformer
        Object.values<string[]>(gqlError.extensions.validation).forEach((validationErrors) => {
          errors.push(...validationErrors)
        })
      } else {
        // we got a simple graphql error
        errors.push(gqlError.message)
      }
    })
  }
  if (err.networkError && err.networkError.result && err.networkError.result.errors) {
    err.networkError.result.errors.forEach((error) => {
      if (error.message) {
        try {
          const parsedErrors = JSON.parse(error.message)
          Object.values(parsedErrors).forEach((errorText) => {
            if (Array.isArray(errorText)) {
              errors.push(...errorText)
            } else {
              // this will probably never occur...
              errors.push(errorText as string)
            }
          })
        } catch (e) {
          errors.push(error.message)
        }
      }
    })
  }
  if (errors.length === 0 && err instanceof Error) {
    // console.error(err)
    errors.push(err.message)
  }
  return errors
}
