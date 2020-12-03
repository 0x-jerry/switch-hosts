import { defineComponent, reactive, watchEffect } from 'vue'
import { getConfigItem, getGroup, hasCheck, isNode, isGroup } from '../common/config'
import { ConfigHostItem, ConfigGroup } from '../define'
import { actions, store } from '../store'
import cloneDeep from 'lodash/cloneDeep'

export const ConfigList = defineComponent({
  setup() {
    const defaultSelected = store.selected

    const data = reactive({
      expanded: [defaultSelected],
      tree: null as any
    })

    watchEffect(() => {
      const key = store.selected

      data.tree && data.tree.setCurrentKey(key)
    })

    return () => {
      const treeData = cloneDeep(store.hosts)

      const slots = {
        default({ node, data }: any) {
          const nodeData = getConfigItem(store, data.id)!

          if (!nodeData) {
            return
          }

          const isReadOnly = isNode(nodeData) && nodeData.readonly

          const icons = []

          if (!isReadOnly) {
            const deleteIcon = (
              <el-link
                icon='el-icon-delete'
                underline={false}
                title='Delete'
                href='#'
                onClick={() => {
                  actions.removeConfigNode(nodeData.id)

                  const needSwitchHosts = isNode(nodeData)
                    ? nodeData.checked
                    : nodeData.children.find((n) => n.checked)

                  if (needSwitchHosts) {
                    actions.saveHosts()
                  } else {
                    actions.saveConfig()
                  }
                }}
              />
            )

            icons.push(deleteIcon)
          } else {
            const copyIcon = (
              <el-link
                icon='el-icon-document-copy'
                title='Copy'
                underline={false}
                href='#'
                onClick={() => {
                  if (isNode(nodeData)) {
                    actions.addConfigNode(nodeData.label, false, store.files[nodeData.id])
                  }
                }}
              />
            )

            icons.push(copyIcon)
          }

          if (isGroup(nodeData)) {
            const isSingle = nodeData.mode === 'single'
            const singleModeIcon = (
              <div
                class={['icon-dot', 'item-icon', isSingle ? '' : 'grey']}
                title='Is single mode'
                onClick={() => {
                  nodeData.mode = isSingle ? 'multi' : 'single'

                  let needSwitchHosts = false

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
                        needSwitchHosts = true
                        n.checked = false
                      }
                    })
                  }

                  if (needSwitchHosts) {
                    actions.saveHosts()
                  } else {
                    actions.saveConfig()
                  }
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
                onChange={() => {
                  const isChildNode = node.parent.level === 1
                  const parentNode: ConfigGroup = node.parent.data
                  const isRadio = isChildNode && parentNode.mode === 'single'

                  if (isRadio) {
                    const parentData = getGroup(store, parentNode.id)!

                    parentData.children.forEach((n) => {
                      if (hasCheck(n) && n.id !== nodeData.id) {
                        n.checked = false
                      }
                    })
                  }

                  actions.saveHosts()
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
            <el-icon class={nodeData.readonly ? 'el-icon-monitor' : 'el-icon-document'} />
          ) : (
            <el-icon class={node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'} />
          )

          return (
            <div class='config-item'>
              <span class='config-label'>
                <span style={{ marginRight: '5px' }}>{icon}</span>
                {nodeData.label} {isNode(nodeData) && nodeData.saved ? '' : '*'}
              </span>
              {...nodes}
            </div>
          )
        }
      }

      return (
        <el-tree
          data={treeData}
          ref={(e: any) => (data.tree = e)}
          node-key='id'
          highlight-current
          draggable={true}
          allow-drop={(draggingNode: any, dropNode: any, type: string) =>
            type === 'inner' ? isGroup(dropNode.data) && !isGroup(draggingNode.data) : true
          }
          expand-on-click-node={false}
          default-expanded-keys={data.expanded}
          current-node-key={defaultSelected}
          onNodeClick={(node: ConfigHostItem) => {
            if (isNode(node)) {
              store.selected = node.id
            }
          }}
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
