import { defineComponent } from 'vue'
import { Sidebar } from './components/Sidebar'
import { Editor } from './components/Editor'
import { usePasswordDialog } from './dialogs/PromptDialog'
import { ipcRenderer } from 'electron'
import { IPC_RENDER_EVENTS } from './const'

export const App = defineComponent({
  setup() {
    const { open, PasswordDialog } = usePasswordDialog()

    ipcRenderer.on(IPC_RENDER_EVENTS.NEED_PASSWORD, () => {
      open()
    })

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
