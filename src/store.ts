import { ipcRenderer } from 'electron'
import { reactive, toRaw } from 'vue'
import { deleteConfigNode, getSelectedNode } from './common/config'
import { Config } from './define'
import { IPC_EVENTS } from './const'

export const store = reactive<Config>(window.__preload__.store)

// @ts-ignore
window.__store = store

export const actions = {
  getSelectedNode() {
    return getSelectedNode(store)
  },
  removeConfigNode(id: string) {
    return deleteConfigNode(store, id)
  },
  saveConfig() {
    return ipcRenderer.invoke(IPC_EVENTS.SAVE_CONFIG, toRaw(store))
  },
  saveHosts() {
    return ipcRenderer.invoke(IPC_EVENTS.SAVE_HOSTS, toRaw(store))
  },
  setPassword(password: string) {
    return ipcRenderer.invoke(IPC_EVENTS.SET_PASSWORD, password)
  }
}
