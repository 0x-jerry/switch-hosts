import { defineComponent } from 'vue'
import { ConfigList } from './ConfigList'

export const Sidebar = defineComponent({
  setup() {
    return () => (
      <div>
        <ConfigList />
        <div class='border-t sidebar-toolbar'>
          <el-link icon='toolbar-icon el-icon-plus' underline={false} href='#' />
          <div class='align-end'>
            <el-link icon='toolbar-icon el-icon-info' underline={false} href='#' />
          </div>
        </div>
      </div>
    )
  }
})
