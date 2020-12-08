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
import { INotificationOptions } from 'element-plus/lib/el-notification/src/notification.type'

export const confStore = reactive<Config>(window.__preload__.store)

// @ts-ignore
window.__store = {
  confStore
}

export const actions = {
  getSelectedNode() {
    const node = getSelectedNode(confStore)

    if (!node) {
      confStore.selected = sysHostsId
      return getSelectedNode(confStore)
    }

    return node
  },
  removeConfigNode(id: string) {
    return deleteConfigNode(confStore, id)
  },
  addConfigNode(label: string, isGroup: boolean, source?: string) {
    if (isGroup) {
      confStore.hosts.push({
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

      confStore.hosts.push(node)

      confStore.files[node.id] = source || ''
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

      confStore.files[newNode.id] = confStore.files[node.id]

      const parent = getParentGroup(confStore, node)
      if (parent) {
        parent.children.push(newNode)
      } else {
        confStore.hosts.push(newNode)
      }
    } else {
      const newGroup: ConfigGroup = {
        ...node,
        id: uuid(),
        children: []
      }

      confStore.hosts.push(newGroup)
      newGroup.children.forEach((n) => {
        this.copyConfigNode(n)
      })
    }
  },
  saveConfig() {
    return ipcRenderer.invoke(IPC_EVENTS.SAVE_CONFIG, toRaw(confStore))
  },
  async resetConfig() {
    const conf = await ipcRenderer.invoke(IPC_EVENTS.RESET_CONFIG)
    for (const key in conf) {
      // @ts-ignore
      confStore[key] = conf[key]
    }
  },
  saveHosts() {
    return ipcRenderer.invoke(IPC_EVENTS.SAVE_HOSTS, toRaw(confStore))
  },
  setPassword(password: string) {
    return ipcRenderer.invoke(IPC_EVENTS.SET_PASSWORD, password)
  },
  notify(opt: INotificationOptions) {
    const option = Object.assign(
      {
        position: 'bottom-right',
        duration: 1500,
        showClose: true
      },
      opt
    )

    ElNotification(option)
  }
}

ipcRenderer.on(IPC_RENDER_EVENTS.UPDATE_CONFIG, (_, conf: Config) => {
  for (const key in conf) {
    // @ts-ignore
    confStore[key] = conf[key]
  }
})

ipcRenderer.on(IPC_RENDER_EVENTS.UPDATE_SOURCE, (_, id: string, source: string) => {
  confStore.files[id] = source
})

ipcRenderer.on(IPC_RENDER_EVENTS.NOTIFICATION, (_, opt: NotificationOption) => {
  console.log(opt)
  actions.notify(opt)
})
