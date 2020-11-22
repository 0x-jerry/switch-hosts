import { createApp, watchEffect } from 'vue'
import { App } from './App'
import ElementUI from 'element-plus'
import './less/app.less'
import 'element-plus/lib/theme-chalk/index.css'
import { getConfig } from './ipc/ipcRenderer'
import { store } from './store'
import { title } from './const'

async function main() {
  const conf = await getConfig()

  Object.keys(conf).forEach(key => {
    // @ts-ignore
    store[key] = conf[key]
  })

  watchEffect(() => {
    document.title = store.saved ? title : title + ' *'
  })

  createApp(App)
    .use(ElementUI)
    .mount('#app')
}

main()
