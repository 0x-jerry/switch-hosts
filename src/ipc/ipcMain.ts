import { ipcMain } from 'electron'
import { IPC_EVENTS } from './enum'
import { Config, getConfig, saveConfig } from '../config'

const events: Record<string, (...args: any) => any> = {
  [IPC_EVENTS.SAVE_CONFIG](conf: Config) {
    saveConfig(conf)
  },
  [IPC_EVENTS.GET_CONFIG]() {
    return getConfig()
  }
}

Object.keys(events).forEach(key => ipcMain.handle(key, events[key]))
