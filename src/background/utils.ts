import debug from 'debug'
import fs from 'fs-extra'
import { sysHostsPath } from '../const'

export const log = debug('switch-hosts')

export const getHosts = () => {
  const source = fs.readFileSync(sysHostsPath, { encoding: 'utf-8' })
  log('System hosts: \n%s', source)
  return source
}
