import { defineComponent } from 'vue'
import { Sidebar } from './components/Sidebar'
import { Editor } from './components/Editor'

export const App = defineComponent({
  setup() {
    return () => {
      return (
        <div class='app full'>
          <Sidebar class='app-sidebar' />
          <Editor class='app-main' />
        </div>
      )
    }
  }
})
