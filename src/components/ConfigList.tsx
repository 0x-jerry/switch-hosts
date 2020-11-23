import { defineComponent } from 'vue'
import { isNode, isSchema } from '../common/config'
import { ConfigHostItem } from '../define'
import { store } from '../store'
import { stop } from '../utils'

const hasCheck = (node: ConfigHostItem) => typeof node.checked === 'boolean'

export const ConfigList = defineComponent({
  setup() {
    const clickItem = (node: ConfigHostItem) => {
      if (isNode(node)) {
        store.selected = node.id
      }
    }

    const defaultSelected = store.selected

    return () => {
      const slots = {
        default({ node, data }: { node: any; data: ConfigHostItem }) {
          const isReadOnly = isNode(data) && data.readonly

          const singleModeIcon = isSchema(data) ? (
            <div
              class={['icon-dot', data.mode === 'single' ? '' : 'grey']}
              onClick={(e) => {
                e.stopPropagation()
                data.mode = data.mode === 'single' ? 'multi' : 'single'
              }}
            />
          ) : (
            <div class='noop' />
          )

          const readonlyIcon = isReadOnly ? (
            <el-tooltip content='readonly'>
              <el-icon class='item-icon el-icon-lock' />
            </el-tooltip>
          ) : (
            <div class='noop' />
          )

          const checkboxIcon = hasCheck(data) ? (
            <el-checkbox v-model={data.checked} class='item-icon' onClick={stop}></el-checkbox>
          ) : (
            <div class='noop' />
          )

          const icon = isNode(data) ? (
            <el-icon class='el-icon-document' />
          ) : (
            <el-icon class={node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'} />
          )

          return (
            <div class='config-item'>
              <span class='config-label'>
                <span style={{ marginRight: '5px' }}>{icon}</span>
                {node.label}
              </span>
              {readonlyIcon}
              {singleModeIcon}
              {checkboxIcon}
            </div>
          )
        }
      }

      const treeData = store.hosts.slice()

      console.log('re render')
      return (
        <el-tree
          data={treeData}
          node-key='id'
          highlight-current
          current-node-key={defaultSelected}
          onNodeClick={clickItem}
          v-slots={slots}
        ></el-tree>
      )
    }
  }
})
