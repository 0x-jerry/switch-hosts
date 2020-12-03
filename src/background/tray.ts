import { app, Menu, MenuItem, MenuItemConstructorOptions, Tray } from 'electron'
import path from 'path'
import { hasCheck, isNode } from '../common'
import { version } from '../const'
import { ConfigNode, ConfigGroup } from '../define'
import { eventBus, EVENTS } from './eventBus'
import { actions, globalStore } from './store'

app.whenReady().then(() => {
  const tray = new Tray(path.join(__static, 'icon.png'))
  globalStore.tray = tray

  eventBus.addListener(EVENTS.UPDATE_TRAY_MENU, () => updateTray())

  updateTray()

  function updateTray() {
    const menus: (MenuItemConstructorOptions | MenuItem)[] = []
    menus.push(
      {
        label: `Switch Hosts (v${version})`,
        click() {
          eventBus.emit(EVENTS.SHOW_WINDOW)
        }
      },
      {
        type: 'separator'
      }
    )

    function nodeToMenuItem(node: ConfigNode, parent?: ConfigGroup): MenuItemConstructorOptions {
      const isSingle = parent && parent.mode === 'single'

      return {
        label: node.label,
        type: isSingle ? 'radio' : 'checkbox',
        enabled: !node.readonly && hasCheck(node),
        checked: node.checked,
        click() {
          if (isSingle && parent) {
            parent.children.forEach((n) => {
              hasCheck(n) && (n.checked = false)
            })

            node.checked = true
          } else {
            node.checked = !node.checked
          }
          actions.updateConfig()
        }
      }
    }

    const hostsMenus: (MenuItemConstructorOptions | MenuItem)[] = globalStore.conf.hosts
      .map((node) => {
        if (isNode(node)) {
          if (node.readonly) {
            return null
          }
          return nodeToMenuItem(node)
        } else {
          return {
            label: node.label,
            type: 'submenu',
            submenu: node.children.map((n) => nodeToMenuItem(n, node))
          }
        }
      })
      .filter((n) => !!n) as any

    menus.push(...hostsMenus)
    menus.push(
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit()
        }
      }
    )

    const contextMenu = Menu.buildFromTemplate(menus)

    tray.setContextMenu(contextMenu)
  }
})
