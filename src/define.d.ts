export interface ConfigItem {
  id: string
  label: string
  checked?: boolean
}

export interface ConfigNode extends ConfigItem {
  source: string
  readonly?: boolean
}

export interface ConfigSchema extends ConfigItem {
  mode: 'single' | 'multi'
  children: ConfigNode[]
}

export type ConfigHostItem = ConfigSchema | ConfigNode

export interface Config {
  version: string
  selected: string
  saved: boolean
  hosts: ConfigHostItem[]
}
