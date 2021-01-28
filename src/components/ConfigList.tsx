import { defineComponent, reactive, watchEffect, watch, nextTick } from 'vue'
import { getConfigItem, getGroup, isNode, isGroup, sysHostsId } from '../common/config'
import { ConfigHostItem, ConfigGroup, ConfigNode } from '../define'
import { actions, confStore } from '../store'
import cloneDeep from 'lodash/cloneDeep'
import { ElMessageBox } from 'element-plus'

function ConfigCheckbox(nodeData: ConfigNode, node: any) {
  return (
    <el-checkbox
      class='item-icon'
      v-model={nodeData.checked}
      onChange={() => {
        const isChildNode = node.parent.level === 1
        const parentNode: ConfigGroup = node.parent.data
        const isRadio = isChildNode && parentNode.mode === 'single'

        if (isRadio) {
          const parentData = getGroup(confStore, parentNode.id)!

          parentData.children.forEach((n) => {
            if (n.id !== nodeData.id && n.checked) {
              n.checked = false
            }
          })
        }

        actions.saveHosts()
      }}
    />
  )
}

function ConfigSingleModeIcon(nodeData: ConfigGroup) {
  const isSingle = nodeData.mode === 'single'
  return (
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
            if (n.readonly || !n.checked) {
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
}

function ConfigCopyIcon(nodeData: ConfigHostItem) {
  return (
    <el-link
      icon='config-icon el-icon-document-copy'
      title='Copy'
      underline={false}
      href='#'
      onClick={() => {
        actions.copyConfigNode(nodeData)
        actions.saveConfig()
      }}
    />
  )
}

function ConfigDeleteIcon(nodeData: ConfigHostItem) {
  return (
    <el-link
      icon='config-icon el-icon-delete'
      underline={false}
      title='Delete'
      href='#'
      onClick={async () => {
        await ElMessageBox.confirm('Are you sure to delete this schema ?', 'Delete Tip')

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
}

export const ConfigList = defineComponent({
  setup() {
    const defaultSelected = confStore.selected

    const thisData = reactive({
      expanded: [defaultSelected],
      tree: null as any,
      edit: {
        ref: null as any,
        id: '',
        content: ''
      }
    })

    watchEffect(() => {
      const key = confStore.selected

      thisData.tree && thisData.tree.setCurrentKey(key)
    })

    watch(
      () => thisData.edit.id,
      () => {
        nextTick(() => {
          thisData.edit.ref?.focus()
        })
      }
    )

    return () => {
      const treeData = cloneDeep(confStore.hosts)

      const slots = {
        default({ node, data }: any) {
          const nodeData = getConfigItem(confStore, data.id)!

          if (!nodeData) {
            return
          }

          const icons = []

          const copyIcon = ConfigCopyIcon(nodeData)
          const deleteIcon = ConfigDeleteIcon(nodeData)

          const readonlyIcon = (
            <el-icon class='item-icon el-icon-lock' style='cursor: not-allowed;' />
          )

          const isSystemHostNode = nodeData.id === sysHostsId

          if (isNode(nodeData)) {
            if (isSystemHostNode) {
              icons.push(copyIcon, readonlyIcon)
            } else {
              icons.push(deleteIcon, copyIcon)

              if (nodeData.readonly) {
                icons.push(readonlyIcon)
              }

              const checkboxIcon = ConfigCheckbox(nodeData, node)

              icons.push(checkboxIcon)
            }
          } else {
            const modeIcon = ConfigSingleModeIcon(nodeData)
            icons.push(deleteIcon, copyIcon, modeIcon)
          }

          const len = icons.length
          const max = 4
          for (let idx = 0; idx < max - len; idx++) {
            icons.unshift(<div class='noop' />)
          }

          const labelIcon = isNode(nodeData)
            ? (
            <el-icon class={isSystemHostNode ? 'el-icon-monitor' : 'el-icon-document'} />
              )
            : (
            <el-icon class={node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'} />
              )

          const labelComp =
            thisData.edit.id === nodeData.id
              ? (
              <input
                ref={(e) => (thisData.edit.ref = e)}
                class='item-label'
                v-model={thisData.edit.content}
                onBlur={() => {
                  thisData.edit.id = ''
                }}
                onKeydown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    thisData.edit.id = ''
                    nodeData.label = thisData.edit.content
                    actions.saveConfig()
                  } else if (e.key === 'Escape') {
                    thisData.edit.id = ''
                  }
                }}
              />
                )
              : (
              <span
                class='item-label'
                title={nodeData.label}
                onDblclick={() => {
                  if (isNode(nodeData) && nodeData.readonly) {
                    return
                  }

                  thisData.edit.id = nodeData.id
                  thisData.edit.content = nodeData.label
                }}
              >
                {nodeData.label} {isNode(nodeData) && !nodeData.saved ? '*' : ''}
              </span>
                )

          return (
            <div class='config-item'>
              <span class='config-label'>
                <span>{labelIcon}</span>
                {labelComp}
              </span>
              {...icons}
            </div>
          )
        }
      }

      return (
        <el-tree
          data={treeData}
          ref={(e: any) => (thisData.tree = e)}
          node-key='id'
          highlight-current
          draggable={true}
          allow-drop={(draggingNode: any, dropNode: any, type: string) =>
            type === 'inner' ? isGroup(dropNode.data) && !isGroup(draggingNode.data) : true
          }
          expand-on-click-node={false}
          default-expanded-keys={thisData.expanded}
          current-node-key={defaultSelected}
          onNodeClick={(node: ConfigHostItem) => {
            if (isNode(node)) {
              confStore.selected = node.id
            }
          }}
          onNodeDrop={() => {
            confStore.hosts = treeData
            actions.saveConfig()
          }}
          onNodeCollapse={(item: ConfigHostItem) => {
            const idx = thisData.expanded.findIndex((id) => id === item.id)
            if (idx >= 0) {
              thisData.expanded.splice(idx, 1)
            }
          }}
          onNodeExpand={(item: ConfigHostItem) => {
            thisData.expanded.push(item.id)
          }}
          v-slots={slots}
        ></el-tree>
      )
    }
  }
})
