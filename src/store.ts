import { reactive } from 'vue'
import { Config, ConfigHostItem, ConfigNode, isNode } from './config'

export const store = reactive<Config>({} as any)

export const actions = {
  getSelectedNode() {
    const findNode = (nodes: ConfigHostItem[]) => {
      let selectedNode: ConfigNode | undefined

      for (const node of nodes) {
        if (isNode(node)) {
          if (node.id === store.selected) {
            selectedNode = node
            break
          }
        } else {
          const node = findNode(nodes)

          if (node) {
            selectedNode = node
            break
          }
        }
      }

      return selectedNode
    }

    return findNode(store.hosts)
  }
}
