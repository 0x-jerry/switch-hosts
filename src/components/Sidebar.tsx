import { defineComponent } from 'vue'
import { useNewHostDialog } from '../dialogs/Dialog'
import { ConfigList } from './ConfigList'

export const Sidebar = defineComponent(() => {
  const { NewHostDialog, open } = useNewHostDialog()

  return () => (
    <div>
      <ConfigList />
      <div class='border-t sidebar-toolbar'>
        <el-link icon='toolbar-icon el-icon-plus' underline={false} href='#' onClick={open} />
        <div class='align-end'>
          <el-link icon='toolbar-icon el-icon-info' underline={false} href='#' />
        </div>
      </div>
      <NewHostDialog />
    </div>
  )
})
