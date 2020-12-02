import { log } from 'debug'
import fs from 'fs-extra'
import { Config, ConfigNode } from '../define'
import { confDir, confPath, platform } from '../const'
import { getConfigNode, getNode, sysHostsId } from '../common'
import { getHosts } from './utils'
import { uuid } from '../utils'

const defaultConfig: (hosts: string) => Config = (hosts) => {
  const node: ConfigNode = {
    id: sysHostsId,
    label: 'Hosts',
    source: hosts,
    readonly: true
  }

  return {
    env: {
      platform
    },
    version: '1.0.0',
    saved: true,
    selected: sysHostsId,
    hosts: [node]
  }
}

export async function saveConfig(conf: Config) {
  await fs.ensureDir(confDir)

  await fs.writeFile(confPath, JSON.stringify(conf, null, 2))

  log('Save config: \n%o', conf)
}

export async function resetConfig() {
  const defaultConf = defaultConfig(getHosts())

  const node = getConfigNode(defaultConf, sysHostsId)!

  defaultConf.hosts.push({
    ...node,
    id: uuid(),
    checked: true,
    readonly: false
  })

  await saveConfig(defaultConf)

  return defaultConf
}

const migrateStrategy: Record<string, (conf: Config) => Config> = {
  '1.0.0'(conf: Config) {
    return conf
  }
}

function migrateConfig(conf: Config): Config {
  Object.keys(migrateStrategy).reduce((config, version) => {
    if (config.version < version) {
      config = migrateStrategy[version](config)
    }

    return config
  }, conf)
  saveConfig(conf)

  return conf
}

export async function getConfig(): Promise<Config> {
  const hosts = getHosts()

  const defaultConf = defaultConfig(hosts)

  if (!(await fs.pathExists(confPath))) {
    log('Config is not exist: \n%o', defaultConf)
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

    const node = getNode(conf, 'hosts')

    node && (node.source = hosts)

    log('Config: \n%o', conf)
    return conf
  } catch (error) {
    log('Load config error: \n%o', error)

    saveConfig(defaultConf)

    return defaultConf
  }
}
