import { defineComponent } from 'vue'
import { ConfigList } from './ConfigList'

export const Sidebar = defineComponent({
  setup() {
    return () => (
      <div>
        <div class='border-b'></div>
        <ConfigList />
        <div class='border-t'></div>
      </div>
    )
  }
})
