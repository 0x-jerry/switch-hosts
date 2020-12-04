import { defineComponent, reactive, watchEffect } from 'vue'
import { getConfigItem, getGroup, hasCheck, isNode, isGroup } from '../common/config'
import { ConfigHostItem, ConfigGroup, ConfigNode } from '../define'
import { actions, store } from '../store'
import cloneDeep from 'lodash/cloneDeep'

const ConfigMoreIcon = defineComponent({
  emits: ['rename'],
  setup(props, ctx) {
    return () => {
      const slots = {
        default() {
          return <el-link icon='el-icon-more-outline' title='More' underline={false} href='#' />
        },
        dropdown() {
          return (
            <el-dropdown-menu>
              <el-dropdown-item
                icon='el-icon-edit'
                onClick={() => {
                  ctx.emit('rename')
                }}
              >
                Rename
              </el-dropdown-item>
            </el-dropdown-menu>
          )
        }
      }
      return <el-dropdown size='small' class='item-icon' v-slots={slots}></el-dropdown>
    }
  }
})

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
}

function ConfigCopyIcon(nodeData: ConfigHostItem) {
  return (
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
}

function ConfigDeleteIcon(nodeData: ConfigHostItem) {
  return (
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
}

export const ConfigList = defineComponent({
  setup() {
    const defaultSelected = store.selected

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
      const key = store.selected

      thisData.tree && thisData.tree.setCurrentKey(key)
    })

    watchEffect(() => {
      thisData.edit.ref?.focus()
    })

    return () => {
      const treeData = cloneDeep(store.hosts)

      const slots = {
        default({ node, data }: any) {
          const nodeData = getConfigItem(store, data.id)!

          if (!nodeData) {
            return
          }

          const icons = []

          const copyIcon = ConfigCopyIcon(nodeData)
          const deleteIcon = ConfigDeleteIcon(nodeData)

          const readonlyIcon = (
            <el-icon class='item-icon el-icon-lock' style='cursor: not-allowed;' />
          )

          if (isNode(nodeData)) {
            const checkboxIcon = ConfigCheckbox(nodeData, node)
            const moreActionIcon = (
              <ConfigMoreIcon
                // @ts-ignore
                onRename={() => {
                  thisData.edit.id = nodeData.id
                  thisData.edit.content = nodeData.label
                }}
              />
            )

            if (nodeData.readonly) {
              icons.push(copyIcon, readonlyIcon)
            } else {
              icons.push(deleteIcon, checkboxIcon, moreActionIcon)
            }
          } else {
            const modeIcon = ConfigSingleModeIcon(nodeData)
            icons.push(deleteIcon, modeIcon)
          }

          const len = icons.length
          const max = 4
          for (let idx = 0; idx < max - len; idx++) {
            icons.unshift(<div class='noop' />)
          }

          const labelIcon = isNode(nodeData) ? (
            <el-icon class={nodeData.readonly ? 'el-icon-monitor' : 'el-icon-document'} />
          ) : (
            <el-icon class={node.expanded ? 'el-icon-folder-opened' : 'el-icon-folder'} />
          )

          const labelComp =
            thisData.edit.id === nodeData.id ? (
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
            ) : (
              <span
                class='item-label'
                title={nodeData.label}
                onDblclick={() => (thisData.edit.id = nodeData.id)}
              >
                {nodeData.label} {isNode(nodeData) && nodeData.saved ? '' : '*'}
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
              store.selected = node.id
            }
          }}
          onNodeDrop={() => {
            store.hosts = treeData
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
