import fs from 'fs-extra'
import { platform, sysHostsPath, tempHostsPath } from '../const'
import { log } from './utils'
import { exec } from 'child_process'
import { actions, globalStore } from './store'
import debounce from 'lodash/debounce'

async function changeSysHosts(hosts: string) {
  if (platform === 'win32') {
    await fs.writeFile(sysHostsPath, hosts, { encoding: 'utf-8' })
  } else {
    return new Promise((resolve, reject) => {
      exec(
        `echo '${globalStore.password}' | sudo -S mv ${tempHostsPath} ${sysHostsPath}`,
        (err, stdout, stderr) => {
          if (err) {
            reject(stderr)
          } else {
            resolve(stdout)
          }
        }
      )
    })
  }
}

export const switchHosts = debounce(
  async (hosts: string) => {
    await fs.writeFile(tempHostsPath, hosts)

    try {
      await changeSysHosts(hosts)
      log('Save hosts:\n %s', hosts)
      actions.notification('Switch hosts successful!')
    } catch (error) {
      log('Switch host error: \n%s', error)
      actions.notification('Switch hosts failed!', error)
    }
  },
  500,
  {
    leading: false,
    trailing: true
  }
)
