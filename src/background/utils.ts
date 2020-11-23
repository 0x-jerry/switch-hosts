import debug from 'debug'
import fs from 'fs-extra'

export const log = debug('switch-hosts')

export const getHosts = () => fs.readFileSync('/etc/hosts', { encoding: 'utf-8' })
