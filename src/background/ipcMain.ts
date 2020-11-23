import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { getConfig, saveConfig } from './config'
import { Config } from '../define'
import { IPC_EVENTS } from '../const'
import { switchHosts } from './hosts'
import { visitConfigNode } from '../common/config'

const events: Record<string, (e: IpcMainInvokeEvent, ...args: any) => any> = {
  [IPC_EVENTS.SAVE_CONFIG](_, conf: Config) {
    return saveConfig(conf)
  },
  [IPC_EVENTS.GET_CONFIG]() {
    return getConfig()
  },
  async [IPC_EVENTS.SAVE_HOSTS](_, conf: Config) {
    await saveConfig(conf)

    const hosts: string[] = []

    visitConfigNode(conf, node => node.checked && hosts.push(node.source))

    await switchHosts(hosts.join('\n'))
  }
}

Object.keys(events).forEach(key => ipcMain.handle(key, events[key]))
