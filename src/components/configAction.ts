/* eslint-disable camelcase */
import { createConfigNode } from '../common'
import { confStore, actions } from '../store'

interface SwitchHostsConfig {
  list: {
    id: string
    title: string
    content: string
    on: boolean
    folder_mode: 0 | 1
    url: string
    last_refresh: string
    refresh_interval: number
    include: SwitchHostsConfig[]
    children: SwitchHostsConfig[]
  }[]
  version: number[]
}

export function importConfig(txt: string) {
  const data = JSON.parse(txt)
  const isSwitchHostsData = (data: any): data is SwitchHostsConfig =>
    Array.isArray(data.list) && Array.isArray(data.version)

  if (isSwitchHostsData(data)) {
    data.list.forEach((node: any) => {
      const isGroup = !!node.folder_mode

      const cloneNode = createConfigNode(node.title, isGroup)
      if (isGroup) {
        confStore.hosts.push(cloneNode)
        node.children.forEach((subNode: any) => {
          const cloneSubNode = createConfigNode(subNode.title, false)
          // @ts-ignore
          cloneNode.children.push(cloneSubNode)
          confStore.files[cloneSubNode.id] = subNode.content
        })
      } else {
        actions.addConfigNode(node.title, false, node.content)
      }
    })
  } else {
    throw new Error('Unknown format.')
  }
}
