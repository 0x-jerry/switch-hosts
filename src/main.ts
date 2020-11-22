import { createApp, watchEffect } from 'vue'
import { App } from './App'
import ElementUI from 'element-plus'
import './less/app.less'
import 'element-plus/lib/theme-chalk/index.css'
import { getConfig } from './ipc/ipcRenderer'
import { store } from './store'
import { title } from './const'

watchEffect(() => {
  document.title = store.saved ? title : title + ' *'
})

getConfig().then(conf => {
  Object.keys(conf).forEach(key => {
    // @ts-ignore
    store[key] = conf[key]
  })

  createApp(App)
    .use(ElementUI)
    .mount('#app')
})
