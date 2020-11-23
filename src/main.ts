import { createApp, watchEffect } from 'vue'
import { App } from './App'
import ElementUI from 'element-plus'
import './less/app.less'
import 'element-plus/lib/theme-chalk/index.css'
import { store } from './store'
import { title } from './const'

watchEffect(() => {
  document.title = store.saved ? title : title + ' *'
})

createApp(App)
  .use(ElementUI)
  .mount('#app')
