import { BrowserWindow } from 'electron'
import { IPC_EVENTS, IPC_RENDER_EVENTS } from '../const'
import { Config, NotificationOption } from '../define'
import { ipcActions } from './ipcMain'

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
    ipcActions[IPC_EVENTS.SAVE_HOSTS](conf)
  },
  updateSource(id: string, source: string) {
    sendMsg(IPC_RENDER_EVENTS.UPDATE_SOURCE, id, source)
  },
  updateConfig() {
    sendMsg(IPC_RENDER_EVENTS.UPDATE_CONFIG, globalStore.conf)
    actions.saveHosts(globalStore.conf)
  },
  showPasswordDialog() {
    sendMsg(IPC_RENDER_EVENTS.NEED_PASSWORD)
  },
  notification(opt: Partial<NotificationOption>) {
    const option: NotificationOption = {
      type: 'info',
      title: '',
      content: ''
    }

    if (typeof opt === 'string') {
      option.content = opt
    } else {
      Object.assign(option, opt)
    }

    sendMsg(IPC_RENDER_EVENTS.NOTIFICATION, option)
  }
}
