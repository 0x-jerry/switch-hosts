import { ipcRenderer } from 'electron'
import { IPC_EVENTS } from './enum'

export function saveConfig() {
  return ipcRenderer.invoke(IPC_EVENTS.SAVE_CONFIG)
}
