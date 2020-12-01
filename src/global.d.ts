import { Config } from './define'

declare global {
  export const __static: string

  interface Window {
    __preload__: {
      store: Config
    }
  }
}
