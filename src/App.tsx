import { defineComponent } from 'vue'
import { ConfigList } from './components/ConfigList'

export const App = defineComponent({
  setup() {
    return () => {
      return (
        <el-container style={{ height: '100%' }}>
          <el-aside width='240px'>
            <el-container style={{ height: '100%' }}>
              <el-main>
                <ConfigList />
              </el-main>
              <el-footer height='25px'>Footer</el-footer>
            </el-container>
          </el-aside>
          <el-main>Main</el-main>
        </el-container>
      )
    }
  }
})
