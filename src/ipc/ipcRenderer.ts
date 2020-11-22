import { Config } from '../config'
import { ipcRenderer } from 'electron'
import { IPC_EVENTS } from './enum'

export function saveConfig(conf: Config) {
  return ipcRenderer.invoke(IPC_EVENTS.SAVE_CONFIG, conf)
}

export function getConfig(): Promise<Config> {
  return ipcRenderer.invoke(IPC_EVENTS.GET_CONFIG)
}
