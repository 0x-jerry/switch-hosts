import { ipcRenderer } from 'electron'
import { IPC_EVENTS } from './const'

async function getConfig() {
  return ipcRenderer.invoke(IPC_EVENTS.GET_CONFIG)
}

async function main() {
  const conf = await getConfig()

  window.__preload__ = {
    store: conf
  }
}

main()
