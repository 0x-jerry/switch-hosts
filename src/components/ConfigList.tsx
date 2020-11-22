import { getConfig } from '../ipc/ipcRenderer'
import { defineComponent, reactive } from 'vue'
import { Config, ConfigHostItem, isNode } from '../config'
import { store } from '@/store'

export const ConfigList = defineComponent({
  setup() {
    const hasCheck = (node: ConfigHostItem) => typeof node.checked === 'boolean'

    const clickItem = (node: ConfigHostItem) => {
      if (hasCheck(node)) {
        node.checked = !node.checked
      }

      if (isNode(node)) {
        store.selected = node.id
      }
    }

    return () => {
      const slots = {
        default({ node, data }: { node: any; data: ConfigHostItem }) {
          return (
            <div class='config-item'>
              <span class='config-left'>
                <span class='config-label'>{node.label}</span>
                {isNode(data) && data.readonly && (
                  <el-tooltip content='readonly'>
                    <el-icon class='el-icon-warning-outline' />
                  </el-tooltip>
                )}
              </span>
              {hasCheck(data) && (
                <el-checkbox v-model={data.checked} class='config-checkbox'></el-checkbox>
              )}
            </div>
          )
        }
      }

      return (
        <el-tree
          data={store.hosts}
          node-key='id'
          highlight-current
          current-node-key={store.selected}
          onNodeClick={clickItem}
          default-expand-all
          expand-on-click-node={false}
          v-slots={slots}
        ></el-tree>
      )
    }
  }
})
