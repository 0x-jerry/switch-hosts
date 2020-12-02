import { defineComponent, nextTick, reactive } from 'vue'
import { getConfigNode, getNode, getSchema, hasCheck, isNode, isSchema } from '../common/config'
import { ConfigHostItem, ConfigSchema } from '../define'
import { actions, store } from '../store'

const clone = (obj: any) => JSON.parse(JSON.stringify(obj))

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
      const treeData = clone(store.hosts)

      const slots = {
        default({ node, data }: any) {
          const nodeData = getConfigNode(store, data.id)!

          const isReadOnly = isNode(nodeData) && nodeData.readonly

          const icons = []

          if (!isReadOnly) {
            const deleteIcon = (
              <el-link
                icon='el-icon-delete'
                underline={false}
                href='#'
                onClick={() => {
                  actions.removeConfigNode(nodeData.id)
                  actions.saveHosts()
                }}
              />
            )

            icons.push(deleteIcon)
          }

          if (isSchema(nodeData)) {
            const isSingle = nodeData.mode === 'single'
            const singleModeIcon = (
              <div
                class={['icon-dot', 'item-icon', isSingle ? '' : 'grey']}
                onClick={() => {
                  nodeData.mode = isSingle ? 'multi' : 'single'

                  // 保证单选的时候只选择一个
                  if (nodeData.mode === 'single') {
                    let checked = false
                    nodeData.children.forEach((n) => {
                      if (!hasCheck(n) || !n.checked) {
                        return
                      }

                      if (!checked) {
                        checked = true
                      } else {
                        n.checked = false
                      }
                    })
                  }

                  actions.saveHosts()
                }}
              />
            )

            icons.push(singleModeIcon)
          }

          if (isReadOnly) {
            const readonlyIcon = (
              <el-tooltip content='readonly'>
                <el-icon class='item-icon el-icon-lock' />
              </el-tooltip>
            )

            icons.push(readonlyIcon)
          }

          if (hasCheck(nodeData) && isNode(nodeData)) {
            const checkboxIcon = (
              <el-checkbox
                class='item-icon'
                v-model={nodeData.checked}
                onClick={() => {
                  const isChildNode = node.parent.level === 1
                  const parentNode: ConfigSchema = node.parent.data
                  const isRadio = isChildNode && parentNode.mode === 'single'

                  if (isRadio) {
                    const parentData = getSchema(store, parentNode.id)!

                    parentData.children.forEach((n) => {
                      if (hasCheck(n) && n.id !== nodeData.id) {
                        n.checked = false
                      }
                    })
                  }

                  setTimeout(() => {
                    actions.saveHosts()
                  }, 1)
                }}
              />
            )

            icons.push(checkboxIcon)
          }

          const nodes = [...icons]

          for (let idx = 0; idx < 4 - icons.length; idx++) {
            nodes.unshift(<div class='noop' />)
          }

          const icon = isNode(nodeData) ? (
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
              {...nodes}
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
            data.expanded.push(item.id)
          }}
          v-slots={slots}
        ></el-tree>
      )
    }
  }
})
