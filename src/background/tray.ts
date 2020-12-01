import { app, Menu, MenuItem, MenuItemConstructorOptions, Tray } from 'electron'
import path from 'path'
import { hasCheck, isNode } from '../common'
import { ConfigNode } from '../define'
import { eventBus, EVENTS } from './eventBus'
import { globalStore } from './store'
import { log } from './utils'

app.whenReady().then(() => {
  const tray = new Tray(path.join(__static, 'icon.png'))
  globalStore.tray = tray

  eventBus.addListener(EVENTS.UPDATE_TRAY_MENU, () => updateTray())

  updateTray()

  function updateTray() {
    const menus: (MenuItemConstructorOptions | MenuItem)[] = []
    menus.push(
      {
        label: 'switch-hosts'
      },
      {
        label: 'v1.0.0',
        enabled: false
      },
      {
        type: 'separator'
      }
    )

    function nodeToMenuItem(node: ConfigNode, mode?: string): MenuItemConstructorOptions {
      return {
        label: node.label,
        type: mode === 'single' ? 'radio' : 'checkbox',
        enabled: !node.readonly && hasCheck(node),
        checked: node.checked
      }
    }

    const hostsMenus: (MenuItemConstructorOptions | MenuItem)[] = globalStore.conf.hosts.map(
      (node) => {
        if (isNode(node)) {
          return nodeToMenuItem(node)
        } else {
          return {
            label: node.label,
            type: 'submenu',
            submenu: node.children.map((n) => nodeToMenuItem(n))
          }
        }
      }
    )

    menus.push(...hostsMenus)

    const contextMenu = Menu.buildFromTemplate(menus)

    tray.setContextMenu(contextMenu)
  }
})
