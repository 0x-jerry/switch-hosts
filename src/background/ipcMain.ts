import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { getConfig, resetConfig, saveConfig } from './config'
import { Config } from '../define'
import { IPC_EVENTS } from '../const'
import { switchHosts } from './hosts'
import { sysHostsId } from '../common/config'
import { actions, globalStore } from './store'
import { eventBus, EVENTS } from './eventBus'

const events: Record<string, (e: IpcMainInvokeEvent, ...args: any) => any> = {
  async [IPC_EVENTS.SAVE_CONFIG](_, conf: Config) {
    globalStore.conf = conf
    eventBus.emit(EVENTS.UPDATE_TRAY_MENU)
    return saveConfig(conf)
  },
  async [IPC_EVENTS.GET_CONFIG]() {
    const conf = await getConfig()
    globalStore.conf = conf

    eventBus.emit(EVENTS.UPDATE_TRAY_MENU)
    return conf
  },
  async [IPC_EVENTS.RESET_CONFIG]() {
    const conf = await resetConfig()

    globalStore.conf = conf

    return conf
  },
  async [IPC_EVENTS.SAVE_HOSTS](_, conf: Config): Promise<boolean> {
    const oldHostSource = globalStore.conf.files[sysHostsId]

    globalStore.conf = conf
    eventBus.emit(EVENTS.UPDATE_TRAY_MENU)

    await saveConfig(conf)

    const newHostSource = conf.files[sysHostsId]

    if (newHostSource.trim() === oldHostSource.trim()) {
      actions.notification({
        type: 'success',
        title: 'Switch hosts successful!'
      })
      return true
    }

    const result = await switchHosts(newHostSource)

    if (!result) {
      conf.files[sysHostsId] = oldHostSource
    }

    return result
  },
  [IPC_EVENTS.SET_PASSWORD](_, password: string) {
    globalStore.password = password
  }
}

Object.keys(events).forEach((key) => ipcMain.handle(key, events[key]))
