import path from 'path'
import os from 'os'
import pkg from '../package.json'

export const title = 'Switch Hosts'

export const confDir = path.join(os.homedir(), '.switch-hosts')

export const confPath = path.join(confDir, 'data.json')

export const tempHostsPath = path.join(confDir, 'temp.hosts')

export const platform = os.platform()

export const sysHostsPath =
  platform === 'win32'
    ? path.join(path.parse(os.homedir()).root, 'windows/system32/drivers/etc/hosts')
    : '/etc/hosts'

export enum IPC_EVENTS {
  SAVE_CONFIG = 'save-config',
  GET_CONFIG = 'get-config',
  RESET_CONFIG = 'reset-config',
  SAVE_HOSTS = 'save-hosts',
  SET_PASSWORD = 'set-password'
}

export enum IPC_RENDER_EVENTS {
  UPDATE_CONFIG = 'update-config',
  UPDATE_SOURCE = 'update-source',
  NOTIFICATION = 'notification',
  NEED_PASSWORD = 'need-password'
}

export const isDebug = process.env.NODE_ENV === 'development'

export const version = pkg.version
