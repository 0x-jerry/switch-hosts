import { defineComponent } from 'vue'
import { useNewHostDialog } from '../dialogs/NewHostDialog'
import { actions } from '../store'
import { importConfig } from './configAction'
import { ConfigList } from './ConfigList'
import { useFileBox } from './hooks/filebox'

export const Sidebar = defineComponent(() => {
  const { NewHostDialog, open } = useNewHostDialog()

  const fileBox = useFileBox()

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

    const configFolderIcon = (
      <el-link
        icon='toolbar-icon el-icon-setting'
        title='Open hosts config folder'
        underline={false}
        href='#'
        onClick={() => actions.openConfigFolder()}
      />
    )

    const importIcon = (
      <el-link
        icon='toolbar-icon el-icon-upload2'
        title='Import config'
        underline={false}
        href='#'
        onClick={async () => {
          try {
            const txt = await fileBox.open()
            importConfig(txt)
            actions.notify({
              type: 'success',
              title: 'Import config',
              message: 'Import successful!'
            })
          } catch (error) {
            actions.notify({
              type: 'error',
              title: 'Import config error',
              message: String(error)
            })
          }
        }}
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
            {importIcon}
            {configFolderIcon}
            {resetIcon}
            <el-link icon='toolbar-icon el-icon-info' title='About' underline={false} href='#' />
          </div>
        </div>
        <NewHostDialog />
      </div>
    )
  }
})
