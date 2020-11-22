import path from 'path'
import os from 'os'

export const confDir = path.join(os.homedir(), '.switch-hosts')

export const confPath = path.join(confDir, 'data.json')

export const tempHostsPath = path.join(confDir, 'temp.hosts')

export const title = 'Switch Hosts'
