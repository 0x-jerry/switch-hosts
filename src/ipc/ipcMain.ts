import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { IPC_EVENTS } from './enum'
import { Config, getConfig, saveConfig } from '../config'

const events: Record<string, (e: IpcMainInvokeEvent, ...args: any) => any> = {
  [IPC_EVENTS.SAVE_CONFIG](_, conf: Config) {
    saveConfig(conf)
  },
  [IPC_EVENTS.GET_CONFIG]() {
    return getConfig()
  }
}

Object.keys(events).forEach(key => ipcMain.handle(key, events[key]))
