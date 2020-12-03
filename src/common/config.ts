import { Config, ConfigHostItem, ConfigNode, ConfigGroup } from '../define'

export const sysHostsId = 'sys-hosts'
export function isGroup(c: ConfigGroup | ConfigNode): c is ConfigGroup {
  return !!(c as ConfigGroup).mode
}

export function isNode(c: ConfigGroup | ConfigNode): c is ConfigNode {
  return !isGroup(c)
}

export const hasCheck = (node: ConfigHostItem) => typeof node.checked === 'boolean'

/**
 *
 * @param visit 返回 true，跳出循环
 */
export function visitConfigItem(conf: Config, visit: (item: ConfigHostItem) => boolean | void) {
  for (const node of conf.hosts) {
    visit(node)

    if (isGroup(node)) {
      for (const item of node.children) {
        visit(item)
      }
    }
  }
}

export function visitConfigNode(conf: Config, visit: (node: ConfigNode) => void) {
  visitConfigItem(conf, (item) => {
    isNode(item) && visit(item)
  })
}

export function getConfigItem(conf: Config, id: string) {
  let node: ConfigHostItem | undefined

  visitConfigItem(conf, (item) => {
    if (item.id === id) {
      node = item
      return true
    }
  })

  return node
}

export function getGroup(conf: Config, id: string) {
  let node: ConfigGroup | undefined

  visitConfigItem(conf, (item) => {
    if (isGroup(item) && item.id === id) {
      node = item
      return true
    }
  })

  return node
}

export function getNode(conf: Config, id: string) {
  let node: ConfigNode | undefined

  visitConfigItem(conf, (item) => {
    if (isNode(item) && item.id === id) {
      node = item
      return true
    }
  })

  return node
}

export function getSelectedNode(conf: Config) {
  return getNode(conf, conf.selected)
}

export function deleteConfigNode(conf: Config, id: string) {
  let idx = 0
  for (const file of conf.hosts) {
    if (file.id === id) {
      conf.hosts.splice(idx, 1)
      break
    }

    if (isGroup(file)) {
      let subIdx = 0
      for (const node of file.children) {
        if (node.id === id) {
          file.children.splice(subIdx)
          break
        }

        subIdx++
      }
    }

    idx++
  }
}

export function getCombineSource(conf: Config) {
  const hosts: string[] = []
  visitConfigNode(conf, (node) => node.checked && hosts.push(conf.files[node.id]))

  return hosts.join('\n')
}
