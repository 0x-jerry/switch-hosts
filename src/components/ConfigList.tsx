import { defineComponent } from 'vue'
import { isNode } from '../common/config'
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
          const isReadOnly = isNode(data) && data.readonly

          const readonlyIcon = isReadOnly ? (
            <el-tooltip content='readonly'>
              <el-icon class='item-icon el-icon-lock' />
            </el-tooltip>
          ) : (
            <div class='noop' />
          )

          const checkbox = hasCheck(data) ? (
            <el-checkbox v-model={data.checked} class='item-icon'></el-checkbox>
          ) : (
            <div class='noop' />
          )

          return (
            <div class='config-item'>
              <span class='config-label'>{node.label}</span>
              <div class='noop' />
              {readonlyIcon}
              {checkbox}
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
