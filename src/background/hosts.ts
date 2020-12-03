import fs from 'fs-extra'
import { platform, sysHostsPath, tempHostsPath } from '../const'
import { log } from './utils'
import { exec } from 'child_process'
import { actions, globalStore } from './store'

async function changeSysHosts(hosts: string) {
  if (platform === 'win32') {
    await fs.writeFile(sysHostsPath, hosts, { encoding: 'utf-8' })
  } else {
    return new Promise((resolve, reject) => {
      exec(
        `echo '${globalStore.password}' | sudo -S cp ${tempHostsPath} ${sysHostsPath}`,
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

/**
 * @returns 是否切换成功
 */
export async function switchHosts(hosts: string): Promise<boolean> {
  await fs.writeFile(tempHostsPath, hosts)

  try {
    await changeSysHosts(hosts)
    log('Save hosts:\n %s', hosts)
    actions.notification({
      type: 'success',
      title: 'Switch hosts successful!'
    })

    return true
  } catch (error) {
    log('Switch host error: \n%s', error)
    actions.notification({
      type: 'error',
      title: 'Switch hosts failed!',
      content: error,
      data: {
        hosts
      }
    })

    return false
  }
}
