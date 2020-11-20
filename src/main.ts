import { createApp } from 'vue'
import { App } from './App'
import ElementUI from 'element-plus'
import './less/app.less'
import 'element-plus/lib/theme-chalk/index.css'

createApp(App)
  .use(ElementUI)
  .mount('#app')
