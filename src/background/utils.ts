import debug from 'debug'
import fs from 'fs-extra'
import { sysHostsPath } from '../const'

export const log = debug('switch-hosts')

export const getHosts = () => fs.readFileSync(sysHostsPath, { encoding: 'utf-8' })
