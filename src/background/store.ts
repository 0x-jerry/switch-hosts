import { BrowserWindow } from 'electron'
import { IPC_RENDER_EVENTS } from '../const'
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
  updateConfig() {
    sendMsg(IPC_RENDER_EVENTS.UPDATE_CONFIG, globalStore.conf)
  }
}
