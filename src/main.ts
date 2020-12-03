import { createApp, watchEffect } from 'vue'
import { App } from './App'
import ElementUI from 'element-plus'
import './less/app.less'
import 'element-plus/lib/theme-chalk/index.css'
import { actions, store } from './store'
import { title } from './const'
import { sysHostsId, visitConfigNode } from './common'
import debounce from 'lodash/debounce'

const setTitle = debounce(
  (title: string) => {
    document.title = title
  },
  500,
  {
    leading: false,
    trailing: true
  }
)

watchEffect(() => {
  const node = actions.getSelectedNode()!

  // const saved = store.saved ? '' : ' *'
  const readonly = node.readonly ? '(#)' : ''
  const file = `${node.label}`

  const isApplied = detectApplied()

  const label = `${isApplied}${title}-${file}${readonly}`

  setTitle(label)
})

createApp(App)
  .use(ElementUI)
  .mount('#app')

function detectApplied() {
  const hosts: string[] = []
  visitConfigNode(store, (node) => node.checked && hosts.push(store.files[node.id]))

  const isApplied = hosts.join('\n').trim() === store.files[sysHostsId].trim() ? '' : '! '

  return isApplied
}
