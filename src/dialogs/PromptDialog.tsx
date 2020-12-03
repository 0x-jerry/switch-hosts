import { defineComponent, reactive } from 'vue'
import { actions } from '../store'

export function usePasswordDialog() {
  const data = reactive({
    visible: false
  })

  const form = reactive({
    password: ''
  })

  const close = () => (data.visible = false)

  const open = () => (data.visible = true)

  const confirm = async (e: Event) => {
    e.preventDefault()
    await actions.setPassword(form.password)
    close()
  }

  const PasswordDialog = defineComponent(() => {
    return () => {
      return (
        <el-dialog title='Input Password' v-model={data.visible} width='50%' append-to-body={true}>
          <el-form label-position='right' label-width='120px' onSubmit={confirm}>
            <el-form-item label='Password:' required>
              <el-input v-model={form.password} type='password' />
            </el-form-item>
            <el-form-item>
              <div class='align-end'>
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
    PasswordDialog,
    open,
    close
  }
}
