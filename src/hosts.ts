import fs from 'fs-extra'
import { tempHostsPath } from './const'

export async function switchHosts(hosts: string) {
  await fs.writeFile(tempHostsPath, hosts)
}
