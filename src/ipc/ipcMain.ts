import { ipcMain } from 'electron'
import { IPC_EVENTS } from './enum'

ipcMain.handle(IPC_EVENTS.SAVE_CONFIG, () => {
  console.log('save')
})
