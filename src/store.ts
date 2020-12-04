import { ipcRenderer } from 'electron'
import { reactive, toRaw } from 'vue'
import {
  deleteConfigNode,
  getParentGroup,
  getSelectedNode,
  isNode,
  sysHostsId
} from './common/config'
import { Config, ConfigGroup, ConfigHostItem, ConfigNode, NotificationOption } from './define'
import { IPC_EVENTS, IPC_RENDER_EVENTS } from './const'
import { ElNotification } from 'element-plus'
import { uuid } from './utils'

export const store = reactive<Config>(window.__preload__.store)

// @ts-ignore
window.__store = store

export const actions = {
  getSelectedNode() {
    const node = getSelectedNode(store)

    if (!node) {
      store.selected = sysHostsId
      return getSelectedNode(store)
    }

    return node
  },
  removeConfigNode(id: string) {
    return deleteConfigNode(store, id)
  },
  addConfigNode(label: string, isGroup: boolean, source?: string) {
    if (isGroup) {
      store.hosts.push({
        label,
        id: uuid(),
        mode: 'single',
        children: []
      })
    } else {
      const node = {
        label,
        id: uuid(),
        checked: false,
        readonly: false,
        saved: true
      }

      store.hosts.push(node)

      store.files[node.id] = source || ''
    }

    return actions.saveConfig()
  },
  copyConfigNode(node: ConfigHostItem) {
    if (isNode(node)) {
      const newNode: ConfigNode = {
        ...node,
        id: uuid(),
        checked: false
      }

      store.files[newNode.id] = store.files[node.id]

      const parent = getParentGroup(store, node)
      if (parent) {
        parent.children.push(newNode)
      } else {
        store.hosts.push(newNode)
      }
    } else {
      const newGroup: ConfigGroup = {
        ...node,
        id: uuid(),
        children: []
      }

      store.hosts.push(newGroup)
      newGroup.children.forEach((n) => {
        this.copyConfigNode(n)
      })
    }
  },
  saveConfig() {
    return ipcRenderer.invoke(IPC_EVENTS.SAVE_CONFIG, toRaw(store))
  },
  async resetConfig() {
    const conf = await ipcRenderer.invoke(IPC_EVENTS.RESET_CONFIG)
    for (const key in conf) {
      // @ts-ignore
      store[key] = conf[key]
    }
  },
  saveHosts() {
    return ipcRenderer.invoke(IPC_EVENTS.SAVE_HOSTS, toRaw(store))
  },
  setPassword(password: string) {
    return ipcRenderer.invoke(IPC_EVENTS.SET_PASSWORD, password)
  }
}

ipcRenderer.on(IPC_RENDER_EVENTS.UPDATE_CONFIG, (_, conf: Config) => {
  for (const key in conf) {
    // @ts-ignore
    store[key] = conf[key]
  }
})

ipcRenderer.on(IPC_RENDER_EVENTS.UPDATE_SOURCE, (_, id: string, source: string) => {
  store.files[id] = source
})

ipcRenderer.on(IPC_RENDER_EVENTS.NOTIFICATION, (_, opt: NotificationOption) => {
  console.log(opt)

  ElNotification({
    type: opt.type,
    title: opt.title,
    message: opt.content,
    position: 'bottom-right',
    duration: 1500,
    showClose: true
  })
})
