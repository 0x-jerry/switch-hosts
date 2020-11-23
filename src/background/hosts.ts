import fs from 'fs-extra'
import { tempHostsPath } from '../const'
import { log } from './utils'

export async function switchHosts(hosts: string) {
  await fs.writeFile(tempHostsPath, hosts)

  log('Save hosts:\n %s', hosts)
}
