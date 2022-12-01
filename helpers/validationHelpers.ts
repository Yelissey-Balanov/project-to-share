import { ValidationObserver, ValidationProvider } from '~/node_modules/vee-validate'
import smoothScroll from '~/helpers/smooth-scroll'

async function validateObserver(validationObserver: InstanceType<typeof ValidationObserver>, displayErrors = true) {
  // validate all providers within observer
  if (!(await validationObserver.validate())) {
    // iterate over all validationProviders, mark as touched and collect errors
    Object.values(validationObserver.refs).forEach((validationProvider: typeof ValidationProvider) => {
      validationProvider.setFlags({
        touched: true,
        untouched: false,
      })
    })

    if (displayErrors) {
      const errors: string[] = []
      Object.values(validationObserver.refs).forEach((validationProvider: typeof ValidationProvider) => {
        errors.push(...validationProvider.errors)
      })
      validationObserver.$bus.showErrorModal({ errors })
    }
    return false
  }
  return true
}

function scrollToFirstInvalidElement(validationObserver: InstanceType<typeof ValidationObserver>) {
  // validate all providers within observer
  const validationProviders: Array<typeof ValidationProvider> = Object.values(validationObserver.refs)
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < validationProviders.length; i++) {
    if (validationProviders[i].errors.length > 0) {
      smoothScroll(validationProviders[i].$el, {
        offset: -80,
        duration: 700,
      })
      return validationProviders[i].$el
    }
  }
  return null
}

function syncValidateObserverValues(validationObserver: InstanceType<typeof ValidationObserver>, displayErrors = true) {
  // iterate over all validationProviders, revalidate if value is different
  Object.values(validationObserver.refs).forEach(async (validationProvider: typeof ValidationProvider) => {
    const validationProviderValue = (validationProvider as any).value
    const inputValue = (validationProvider.$parent as any).value
    if (validationProviderValue !== inputValue) {
      validationProvider.syncValue((validationProvider.$parent as any).value)
      await validationProvider.validateSilent()
    }
  })
}

export { validateObserver, scrollToFirstInvalidElement, syncValidateObserverValues }
