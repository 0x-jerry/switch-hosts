import fs from 'fs-extra'
import { platform, sysHostsPath, tempHostsPath } from '../const'
import { log } from './utils'
import { exec } from 'child_process'
import { globalStore } from './store'
// @ts-ignore
import CDP from 'chrome-remote-interface'

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

async function flushChromeDNSCache() {
  try {
    const client = await CDP()
    const { Runtime } = client
    await Runtime.enable()

    let r = await Runtime.evaluate({ expression: 'chrome.benchmarking.clearHostResolverCache();' })
    log('clearHostResolverCache result: %o', r)
    r = await Runtime.evaluate({ expression: 'chrome.benchmarking.clearCache();' })
    log('clearCache result: %o', r)
    r = await Runtime.evaluate({ expression: 'chrome.benchmarking.closeConnections();' })
    log('closeConnections result: %o', r)

    await Runtime.disable()

    log('Clear chrome DNS cache.')
  } catch (error) {
    log('Clear chrome DNS error: %s', error)
  }
}

export async function switchHosts(hosts: string) {
  await fs.writeFile(tempHostsPath, hosts)

  try {
    await changeSysHosts(hosts)
    await flushChromeDNSCache()
    log('Save hosts:\n %s', hosts)
  } catch (error) {
    log('Switch host error: \n%s', error)
  }
}
