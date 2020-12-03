import fs from 'fs-extra'
import { Config, ConfigNode, ConfigV100, ConfigV101 } from '../define'
import { confDir, confPath, platform } from '../const'
import { getConfigItem, sysHostsId, visitConfigNode } from '../common'
import { getHosts, log } from './utils'
import { uuid } from '../utils'
import cloneDeep from 'lodash/cloneDeep'

const defaultConfig: (hosts: string) => Config = (hosts) => {
  const node: ConfigNode = {
    id: sysHostsId,
    label: 'Hosts',
    saved: true,
    readonly: true
  }

  return {
    env: {
      platform
    },
    version: '1.0.0',
    saved: true,
    selected: sysHostsId,
    hosts: [node],
    files: {
      [sysHostsId]: hosts
    }
  }
}

export async function saveConfig(conf: Config) {
  await fs.ensureDir(confDir)

  await fs.writeFile(confPath, JSON.stringify(conf, null, 2))

  log('Save config: \n%O', conf)
}

export async function resetConfig() {
  const defaultConf = defaultConfig(getHosts())

  const node = getConfigItem(defaultConf, sysHostsId)!

  const newNode = {
    ...node,
    id: uuid(),
    checked: true,
    readonly: false
  }

  defaultConf.files[newNode.id] = defaultConf.files[sysHostsId]

  defaultConf.hosts.push(newNode)

  await saveConfig(defaultConf)

  return defaultConf
}

const migrateStrategy: Record<string, (conf: any) => any> = {
  '1.0.0'(conf: ConfigV100): ConfigV100 {
    return conf
  },
  '1.1.0'(conf: ConfigV100): ConfigV101 {
    const files: Record<string, string> = {}

    visitConfigNode(conf as any, (node: any) => {
      files[node.id] = node.source
      node.saved = true
      delete node.source
    })

    // @ts-ignore
    delete conf.saved

    return {
      ...conf,
      files
    }
  }
}

export function migrateConfig(conf: any): Config {
  const newConf = Object.keys(migrateStrategy).reduce((config, version) => {
    log(config.version, version, config.version < version)

    if (config.version < version) {
      const newConfig = migrateStrategy[version](cloneDeep(config))
      newConfig.version = version

      log('Migrate config from %O to %O', config, newConfig)

      config = newConfig
    }

    return config
  }, conf)

  return newConf
}

export async function getConfig(): Promise<Config> {
  const hosts = getHosts()

  const defaultConf = defaultConfig(hosts)

  if (!(await fs.pathExists(confPath))) {
    log('Config is not exist: \n%O', defaultConf)
    return defaultConf
  }

  try {
    const txt = await fs.readFile(confPath, { encoding: 'utf-8' })
    let conf: Config = JSON.parse(txt)

    conf = Object.assign(defaultConf, conf)

    if (typeof conf.version !== 'string') {
      throw new Error('Wrong config format')
    }

    conf = migrateConfig(conf)

    conf.files[sysHostsId] = hosts
    saveConfig(conf)

    log('Config: \n%O', conf)
    return conf
  } catch (error) {
    log('Load config error: %s', error)

    saveConfig(defaultConf)

    return defaultConf
  }
}
