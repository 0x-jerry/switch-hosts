import { BrowserWindow, ipcMain } from 'electron'
import { IPC_EVENTS, IPC_RENDER_EVENTS } from '../const'
import { Config } from '../define'

export const globalStore = {
  password: '',
  tray: undefined as any,
  conf: {} as Config,
  win: null as BrowserWindow | null,
  shouldClose: false
}

function sendMsg(channel: string, ...args: any) {
  if (!globalStore.win) {
    return
  }

  globalStore.win.webContents.send(channel, ...args)
}

export const actions = {
  saveHosts(conf: Config) {
    ipcMain.emit(IPC_EVENTS.SAVE_HOSTS, conf)
  },
  updateConfig() {
    sendMsg(IPC_RENDER_EVENTS.UPDATE_CONFIG, globalStore.conf)
    actions.saveHosts(globalStore.conf)
  }
}
