import { defineComponent, reactive } from 'vue'
import { Sidebar } from './components/Sidebar'
import { Editor } from './components/Editor'
import { usePasswordDialog } from './dialogs/PromptDialog'

export const App = defineComponent({
  setup() {
    const { open, PasswordDialog } = usePasswordDialog()

    open()

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
