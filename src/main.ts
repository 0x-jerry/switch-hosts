import { createApp, watchEffect } from 'vue'
import { App } from './App'
import ElementUI from 'element-plus'
import './less/app.less'
import 'element-plus/lib/theme-chalk/index.css'
import { actions, confStore } from './store'
import { title } from './const'
import { sysHostsId, visitConfigNode } from './common'

watchEffect(() => {
  const node = actions.getSelectedNode()!

  const readonly = node.readonly ? '(#)' : ''
  const file = `${node.label}`

  const isApplied = detectApplied()

  const label = `${isApplied}${title}-${file}${readonly}`

  document.title = label
})

createApp(App)
  .use(ElementUI)
  .mount('#app')

function detectApplied() {
  const hosts: string[] = []
  visitConfigNode(confStore, (node) => node.checked && hosts.push(confStore.files[node.id]))

  const isApplied = hosts.join('\n').trim() === confStore.files[sysHostsId].trim() ? '' : '! '

  return isApplied
}
