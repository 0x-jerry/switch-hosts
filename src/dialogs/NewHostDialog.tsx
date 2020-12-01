import { defineComponent, reactive } from 'vue'
import { actions } from '../store'

export function useNewHostDialog() {
  const data = reactive({
    visible: false
  })

  const form = reactive({
    name: 'Test',
    isGroup: false
  })

  const resetForm = () => {
    form.name = 'Test'
    form.isGroup = false
  }

  const close = () => (data.visible = false)

  const open = () => (data.visible = true)

  const confirm = (e: Event) => {
    e.preventDefault()
    close()

    actions.addConfigNode(form.name, form.isGroup)

    resetForm()
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
          <el-form label-position='right' label-width='80px' onSubmit={confirm}>
            <el-form-item label='Name:' required>
              <el-input v-model={form.name} />
            </el-form-item>
            <el-form-item label='Schema:'>
              <el-radio-group v-model={form.isGroup}>
                <el-radio label={false}>Node</el-radio>
                <el-radio label={true}>Group</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <div class='align-end'>
                <el-button onClick={close}>Cancel</el-button>
                <el-button type='primary' onClick={confirm}>
                  Confirm
                </el-button>
              </div>
            </el-form-item>
          </el-form>
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
