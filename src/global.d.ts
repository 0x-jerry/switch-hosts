import { Config } from './define'

declare global {
  interface Window {
    __preload__: {
      store: Config
    }
  }
}
