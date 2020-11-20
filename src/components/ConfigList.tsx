import { defineComponent, reactive } from 'vue'

const data1 = [
  {
    id: 1,
    label: '一级 1',
    mode: 'single',
    children: [
      {
        id: 4,
        label: '二级 1-1',
        children: [
          {
            id: 9,
            label: '三级 1-1-1'
          },
          {
            id: 10,
            label: '三级 1-1-2'
          }
        ]
      }
    ]
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

    const log = console.log

    return () => {
      const slots = {
        default({ node, data }: any) {
          return (
            <span class='custom-tree-node'>
              <span onClick={e => log(node, data)}>{node.label}</span>
              <el-checkbox></el-checkbox>
            </span>
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
