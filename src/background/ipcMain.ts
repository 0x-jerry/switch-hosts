import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { getConfig, resetConfig, saveConfig } from './config'
import { Config } from '../define'
import { IPC_EVENTS } from '../const'
import { switchHosts } from './hosts'
import { getNode, sysHostsId } from '../common/config'
import { globalStore } from './store'

const events: Record<string, (e: IpcMainInvokeEvent, ...args: any) => any> = {
  [IPC_EVENTS.SAVE_CONFIG](_, conf: Config) {
    return saveConfig(conf)
  },
  [IPC_EVENTS.GET_CONFIG]() {
    return getConfig()
  },
  [IPC_EVENTS.RESET_CONFIG]() {
    return resetConfig()
  },
  async [IPC_EVENTS.SAVE_HOSTS](_, conf: Config) {
    await saveConfig(conf)

    const node = getNode(conf, sysHostsId)

    if (node) {
      await switchHosts(node.source)
    }
  },
  [IPC_EVENTS.SET_PASSWORD](_, password: string) {
    globalStore.password = password
  }
}

Object.keys(events).forEach((key) => ipcMain.handle(key, events[key]))
