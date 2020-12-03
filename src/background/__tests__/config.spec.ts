import { sysHostsId } from '../../common'
import { migrateConfig } from '../config'

describe('config migrate', () => {
  it('1.0.0 to 1.0.1', () => {
    const conf = {
      version: '1.0.0',
      env: {
        platform: process.platform
      },
      selected: sysHostsId,
      saved: true,
      hosts: [
        {
          id: sysHostsId,
          label: 'Hosts',
          readonly: true,
          source: 'test'
        }
      ]
    }

    const newConfig = migrateConfig(conf as any)

    expect(newConfig).toEqual({
      version: '1.1.0',
      env: {
        platform: process.platform
      },
      selected: sysHostsId,
      hosts: [
        {
          id: sysHostsId,
          label: 'Hosts',
          readonly: true,
          saved: true
        }
      ],
      files: {
        [sysHostsId]: 'test'
      }
    })
  })
})
