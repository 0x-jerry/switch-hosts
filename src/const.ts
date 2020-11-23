import path from 'path'
import os from 'os'

export const title = 'Switch Hosts'

export const confDir = path.join(os.homedir(), '.switch-hosts')

export const confPath = path.join(confDir, 'data.json')

export const tempHostsPath = path.join(confDir, 'temp.hosts')

export const hostsPath =
  os.platform() === 'win32'
    ? path.join(path.parse(os.homedir()).root, 'windows/system32/drivers/etc/hosts')
    : '/etc/hosts'

export enum IPC_EVENTS {
  SAVE_CONFIG = 'save-config',
  GET_CONFIG = 'get-config',
  SAVE_HOSTS = 'save-hosts'
}
