import { defineComponent } from 'vue'
import { isDebug } from '../const'
import { useNewHostDialog } from '../dialogs/NewHostDialog'
import { actions } from '../store'
import { ConfigList } from './ConfigList'

export const Sidebar = defineComponent(() => {
  const { NewHostDialog, open } = useNewHostDialog()

  return () => {
    const clearIcon = (
      <el-link
        icon='toolbar-icon el-icon-delete'
        underline={false}
        href='#'
        onClick={() => actions.resetConfig()}
      />
    )

    return (
      <div>
        <ConfigList />
        <div class='border-t sidebar-toolbar'>
          <el-link icon='toolbar-icon el-icon-plus' underline={false} href='#' onClick={open} />
          <div class='align-end'>
            {isDebug && clearIcon}
            <el-link icon='toolbar-icon el-icon-info' underline={false} href='#' />
          </div>
        </div>
        <NewHostDialog />
      </div>
    )
  }
})
