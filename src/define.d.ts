export interface ConfigItem {
  id: string
  label: string
}

export interface ConfigNode extends ConfigItem {
  checked: boolean
  saved: boolean
  readonly: boolean
}

export interface ConfigGroup extends ConfigItem {
  mode: 'single' | 'multi'
  children: ConfigNode[]
}

export type ConfigHostItem = ConfigGroup | ConfigNode

export interface ConfigV100 {
  env: {
    platform: string
  }
  version: string
  selected: string
  saved: boolean
  hosts: ConfigHostItem[]
}

export interface ConfigV101 {
  env: {
    platform: string
  }
  version: string
  selected: string
  hosts: ConfigHostItem[]
  /**
   * id => source
   */
  files: Record<string, string>
}

export type Config = ConfigV101

export interface NotificationOption {
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  content: string
  data?: any
}
