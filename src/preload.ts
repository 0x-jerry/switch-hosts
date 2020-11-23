import { getConfig } from './ipc/ipcRenderer'

async function main() {
  const conf = await getConfig()

  window.__preload__ = {
    store: conf
  }
}

main()
