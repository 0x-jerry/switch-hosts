import { ipcMain } from 'electron'
import { getConfig, resetConfig, saveConfig } from './config'
import { Config } from '../define'
import { IPC_EVENTS } from '../const'
import { switchHosts } from './hosts'
import { sysHostsId, visitConfigNode } from '../common/config'
import { actions, globalStore } from './store'
import { eventBus, EVENTS } from './eventBus'
import { getHosts } from './utils'

export const ipcActions = {
  async [IPC_EVENTS.SAVE_CONFIG](conf: Config) {
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

    eventBus.emit(EVENTS.UPDATE_TRAY_MENU)

    return conf
  },
  async [IPC_EVENTS.SAVE_HOSTS](conf: Config): Promise<boolean> {
    const hosts: string[] = []
    visitConfigNode(conf, (node) => node.checked && hosts.push(conf.files[node.id]))
    conf.files[sysHostsId] = hosts.join('\n')

    await ipcActions[IPC_EVENTS.SAVE_CONFIG](conf)

    const newHostSource = globalStore.conf.files[sysHostsId]
    const oldHostSource = getHosts()

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
  [IPC_EVENTS.SET_PASSWORD](password: string) {
    globalStore.password = password
  }
}

Object.keys(ipcActions).forEach((key) =>
  ipcMain.handle(
    key,
    // @ts-ignore
    (_, ...args) => ipcActions[key](...args)
  )
)
