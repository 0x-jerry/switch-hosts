import { defineComponent } from 'vue'
import { isNode } from '../config'
import { ConfigHostItem } from '../define'
import { store } from '../store'

const hasCheck = (node: ConfigHostItem) => typeof node.checked === 'boolean'

export const ConfigList = defineComponent({
  setup() {
    const clickItem = (node: ConfigHostItem) => {
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
