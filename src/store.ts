import { ipcRenderer } from 'electron'
import { reactive, toRaw } from 'vue'
import { getSelectedNode } from './common/config'
import { Config } from './define'
import { IPC_EVENTS } from './const'

export const store = reactive<Config>(window.__preload__.store)

export const actions = {
  getSelectedNode() {
    return getSelectedNode(store)
  },
  saveConfig() {
    return ipcRenderer.invoke(IPC_EVENTS.SAVE_CONFIG, toRaw(store))
  },
  saveHosts() {
    return ipcRenderer.invoke(IPC_EVENTS.SAVE_HOSTS, toRaw(store))
  }
}
