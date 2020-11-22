interface ConfigNode {
  id: string
  label: string
  checked: boolean
  source: string
}

interface ConfigSchema {
  mode: 'single' | 'multi'
  children: ConfigNode[]
}
