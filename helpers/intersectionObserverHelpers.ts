import { throttle } from 'lodash'

export const isIntersectionObserverSupported =
  process.client &&
  'IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window &&
  'intersectionRatio' in window.IntersectionObserverEntry.prototype &&
  'isIntersecting' in window.IntersectionObserverEntry.prototype

export const lazyIntersectionObserver = isIntersectionObserverSupported && initLazyIntersectionObserver()

function observeNewLazyImages() {
  if (!lazyIntersectionObserver) {
    return
  }
  const selector = '.l-img__img.lazy:not([data-lazy=observed])'
  const images = Array.prototype.slice.call(document.querySelectorAll(selector))
  // console.log('observeNewLazyImages', images.length)
  images.forEach(function (image: HTMLImageElement) {
    lazyIntersectionObserver.observe(image)
    image.setAttribute('data-lazy', 'observed')
  })
}

function initLazyIntersectionObserver() {
  return new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        revealImage(entry.target)
        observer.unobserve(entry.target)
        entry.target.setAttribute('data-lazy', 'loaded')
      }
    })
  })
}

const throttledObserveNewLazyImages = throttle(observeNewLazyImages, 1000)

/**
 * should be called after dom is loaded
 */
export function initLazyMutationObserver() {
  if (!lazyIntersectionObserver) {
    return
  }
  const mutationObserver = new MutationObserver(function (mutationsList, observer) {
    throttledObserveNewLazyImages()
  })
  mutationObserver.observe(document, {
    characterData: false,
    childList: true,
    subtree: true,
  })
}

export function revealImage(img) {
  img.src = img.dataset.src!
  img.srcset = img.dataset.srcset!
  img.classList.remove('lazy')
}
