import { defineComponent, reactive, toRaw } from 'vue'
import { isNode, isSchema } from '../common/config'
import { ConfigHostItem } from '../define'
import { actions, store } from '../store'
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

    const data = reactive({
      expanded: [defaultSelected]
    })

    return () => {
      const treeData = store.hosts.map((n) => toRaw(n))

      const slots = {
        default({ node, data }: { node: any; data: ConfigHostItem }) {
          const isReadOnly = isNode(data) && data.readonly

          const deleteIcon = isReadOnly ? (
            <div class='noop'></div>
          ) : (
            <el-link
              icon='el-icon-delete'
              underline={false}
              href='#'
              onClick={() => {
                actions.removeConfigNode(data.id)
                actions.saveConfig()
              }}
            />
          )

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
              {deleteIcon}
              {readonlyIcon}
              {singleModeIcon}
              {checkboxIcon}
            </div>
          )
        }
      }

      return (
        <el-tree
          data={treeData}
          node-key='id'
          highlight-current
          draggable={true}
          allow-drop={(draggingNode: any, dropNode: any, type: string) =>
            type === 'inner' ? isSchema(dropNode.data) && !isSchema(draggingNode.data) : true
          }
          expand-on-click-node={false}
          default-expanded-keys={data.expanded}
          current-node-key={defaultSelected}
          onNodeClick={clickItem}
          onNodeDrop={() => {
            store.hosts = treeData
            actions.saveConfig()
          }}
          onNodeCollapse={(item: ConfigHostItem) => {
            const idx = data.expanded.findIndex((id) => id === item.id)
            if (idx >= 0) {
              data.expanded.splice(idx, 1)
            }
          }}
          onNodeExpand={(item: ConfigHostItem) => {
            // on node expand not working.
            console.log('on-node-expand')
            data.expanded.push(item.id)
          }}
          v-slots={slots}
        ></el-tree>
      )
    }
  }
})
