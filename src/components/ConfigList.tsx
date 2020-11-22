import { defineComponent, reactive } from 'vue'

const data1 = [
  {
    id: 1,
    label: '一级 1'
  },
  {
    id: 2,
    label: '一级 2',
    children: [
      {
        id: 5,
        label: '二级 2-1'
      },
      {
        id: 6,
        label: '二级 2-2'
      }
    ]
  },
  {
    id: 3,
    label: '一级 3',
    children: [
      {
        id: 7,
        label: '二级 3-1'
      },
      {
        id: 8,
        label: '二级 3-2'
      }
    ]
  }
]

export const ConfigList = defineComponent({
  setup() {
    const data = reactive(data1)

    const switchStatus = (node: any) => {
      node.check = !node.check
      console.log(data)
    }

    return () => {
      const slots = {
        default({ node, data }: any) {
          return (
            <div class='config-list'>
              <span class='config-label' onClick={e => switchStatus(data)}>
                {node.label}
              </span>
              <el-checkbox v-model={data.check} class='config-checkbox'></el-checkbox>
            </div>
          )
        }
      }

      return (
        <el-tree
          data={data}
          node-key='id'
          default-expand-all
          expand-on-click-node={false}
          v-slots={slots}
        ></el-tree>
      )
    }
  }
})
