import { log } from 'debug'
import fs from 'fs-extra'
import { confDir, confPath } from './const'

export interface ConfigItem {
  id: string
  label: string
  checked?: boolean
}

export interface ConfigNode extends ConfigItem {
  source: string
  readonly: boolean
}

export interface ConfigSchema extends ConfigItem {
  mode: 'single' | 'multi'
  children: ConfigNode[]
}

export type ConfigHostItem = ConfigSchema | ConfigNode

export interface Config {
  version: string
  selected: string
  hosts: ConfigHostItem[]
}

const defaultConfig: () => Config = () => {
  const hosts = fs.readFileSync('/etc/hosts', { encoding: 'utf-8' })

  const node: ConfigNode = {
    id: 'hosts',
    label: 'hosts',
    source: hosts,
    readonly: true
  }

  return {
    version: '1.0.0',
    selected: 'hosts',
    hosts: [node]
  }
}

export function isSchema(c: ConfigSchema | ConfigNode): c is ConfigSchema {
  return !!(c as ConfigSchema).mode
}

export function isNode(c: ConfigSchema | ConfigNode): c is ConfigNode {
  return !isSchema(c)
}

export async function saveConfig(conf: Config) {
  await fs.ensureDir(confDir)

  await fs.writeFile(confPath, JSON.stringify(conf, null, 2))

  log('Save config: \n%o', conf)
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
  const defaultConf = defaultConfig()

  if (!(await fs.pathExists(confPath))) {
    log('Config is not exist: \n%o', defaultConf)
    return defaultConf
  }

  try {
    const txt = await fs.readFile(confPath, { encoding: 'utf-8' })
    let conf: Config = JSON.parse(txt)

    if (typeof conf.version !== 'string') {
      throw new Error('Wrong config format')
    }

    conf = migrateConfig(conf)

    const idx = conf.hosts.findIndex(h => h.id === 'hosts')

    if (idx >= 0) {
      conf.hosts[idx] = defaultConf.hosts[0]
    }

    log('Config: \n%o', conf)
    return conf
  } catch (error) {
    log('Load config error: \n%o', error)

    saveConfig(defaultConf)

    return defaultConf
  }
}
