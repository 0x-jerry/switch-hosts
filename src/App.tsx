import { defineComponent } from 'vue'
import { Sidebar } from './components/Sidebar'
import { Editor } from './components/Editor'
import { usePasswordDialog } from './dialogs/PromptDialog'
import { store } from './store'

export const App = defineComponent({
  setup() {
    const { open, PasswordDialog } = usePasswordDialog()

    if (store.env.platform !== 'win32') {
      open()
    }

    return () => {
      return (
        <div class='app full'>
          <Sidebar class='app-sidebar' />
          <Editor class='app-main' />
          <PasswordDialog />
        </div>
      )
    }
  }
})
