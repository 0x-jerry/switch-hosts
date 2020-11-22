import { defineComponent } from 'vue'
import { ConfigList } from './components/ConfigList'
import { Editor } from './editor/Editor'

export const App = defineComponent({
  setup() {
    return () => {
      return (
        <el-container style={{ height: '100%' }}>
          <el-aside width='240px'>
            <el-container style={{ height: '100%' }}>
              <el-main style={{ padding: '0' }}>
                <ConfigList />
              </el-main>
              <el-footer height='25px'>Footer</el-footer>
            </el-container>
          </el-aside>
          <div class='full'>
            <Editor />
          </div>
        </el-container>
      )
    }
  }
})
