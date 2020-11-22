import fs from 'fs-extra'
import { confDir, confPath } from './const'

export interface ConfigNode {
  id: string
  label: string
  checked: boolean
  source: string
}

export interface ConfigSchema {
  mode: 'single' | 'multi'
  children: ConfigNode[]
}

export interface Config {
  version: string
  hosts: (ConfigSchema | ConfigNode)[]
}

const defaultConf: Config = {
  version: '1.0.0',
  hosts: []
}

export async function saveConfig(conf: Config) {
  await fs.ensureDir(confDir)

  return fs.writeFile(confPath, JSON.stringify(conf, null, 2))
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
  if (await fs.pathExists(confPath)) {
    return defaultConf
  }

  const txt = await fs.readFile(confPath, { encoding: 'utf-8' })

  try {
    const conf: Config = JSON.parse(txt)
    if (typeof conf.version !== 'string') {
      throw new Error('Wrong config format')
    }
    return migrateConfig(conf)
  } catch (error) {
    saveConfig(defaultConf)

    return defaultConf
  }
}
