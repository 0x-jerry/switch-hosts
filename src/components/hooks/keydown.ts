import { onUnmounted } from 'vue'

type KeyboardEventListener = (e: KeyboardEvent) => void

const keydownListeners = new Set<KeyboardEventListener>()

window.addEventListener('keydown', (e) => {
  for (const listener of keydownListeners) {
    listener(e)
  }
})

export function useKeydownRaw(listener: KeyboardEventListener) {
  keydownListeners.add(listener)

  return {
    destroy() {
      keydownListeners.delete(listener)
    }
  }
}

export function useKeydown(listener: KeyboardEventListener) {
  const { destroy } = useKeydownRaw(listener)

  onUnmounted(destroy)
}
