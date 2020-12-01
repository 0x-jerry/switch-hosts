import { v4 } from 'uuid'

export const stop = (e: Event) => e.stopPropagation()
export const prevent = (e: Event) => e.preventDefault()

export const uuid = v4
