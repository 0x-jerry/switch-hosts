import { defineComponent } from 'vue'
import { isDebug } from '../const'
import { useNewHostDialog } from '../dialogs/NewHostDialog'
import { actions } from '../store'
import { ConfigList } from './ConfigList'

export const Sidebar = defineComponent(() => {
  const { NewHostDialog, open } = useNewHostDialog()

  return () => {
    const resetIcon = (
      <el-link
        icon='toolbar-icon el-icon-refresh'
        title='Reset hosts config'
        underline={false}
        href='#'
        onClick={() => actions.resetConfig()}
      />
    )

    return (
      <div>
        <ConfigList />
        <div class='border-t sidebar-toolbar'>
          <el-link
            icon='toolbar-icon el-icon-plus'
            title='New host'
            underline={false}
            href='#'
            onClick={open}
          />
          <div class='align-end'>
            {isDebug && resetIcon}
            <el-link icon='toolbar-icon el-icon-info' title='About' underline={false} href='#' />
          </div>
        </div>
        <NewHostDialog />
      </div>
    )
  }
})
