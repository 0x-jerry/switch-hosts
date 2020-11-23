import debug from 'debug'
import fs from 'fs-extra'
import { hostsPath } from '../const'

export const log = debug('switch-hosts')

export const getHosts = () => fs.readFileSync(hostsPath, { encoding: 'utf-8' })
