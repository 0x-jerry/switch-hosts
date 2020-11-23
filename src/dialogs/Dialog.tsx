import { defineComponent, reactive } from 'vue'
import { store } from '../store'

export function useNewHostDialog() {
  const data = reactive({
    visible: false
  })

  const form = reactive({
    name: '',
    isSchema: false
  })

  const close = () => (data.visible = false)

  const open = () => (data.visible = true)

  const confirm = () => {
    close()
    if (form.isSchema) {
      store.hosts.push({
        id: Math.random().toString(),
        label: form.name,
        mode: 'single',
        children: [
          {
            id: Math.random().toString(),
            label: form.name,
            source: ''
          }
        ]
      })
    } else {
      store.hosts.push({
        id: Math.random().toString(),
        label: form.name,
        source: ''
      })
    }
  }

  const NewHostDialog = defineComponent((_, ctx) => {
    return () => {
      return (
        <el-dialog
          title='Create New Host Schema'
          v-model={data.visible}
          width='80%'
          append-to-body={true}
        >
          <el-input v-model={form.name} />
          <el-radio-group v-model={form.isSchema}>
            <el-radio-button label={false}>Node</el-radio-button>
            <el-radio-button label={true}>Schema</el-radio-button>
          </el-radio-group>

          <div class='align-end'>
            <el-button onClick={close}>Cancel</el-button>
            <el-button type='primary' onClick={confirm}>
              Confirm
            </el-button>
          </div>
        </el-dialog>
      )
    }
  })

  return {
    data,
    NewHostDialog,
    open,
    close
  }
}
