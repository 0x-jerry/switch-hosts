import { defineComponent, onMounted, reactive } from 'vue'
import { editor, IRange } from 'monaco-editor'
import './lang-hosts'

function getCodes() {
  return `# local_dev
127.0.0.1 p99999.kuaidizs.cn # tb
127.0.0.1 p88888.kuaidizs.cn # tb
127.0.0.1 p51.kuaidizs.cn # tb

127.0.0.1 pddtest1.kuaidizs.cn # pdd

127.0.0.1 ksshop.kuaidizs.cn # kssd
127.0.0.1 jyd.kuaidizs.cn

127.0.0.1 handorder.kuaidizs.cn
127.0.0.1 handpddg.kuaidizs.cn
127.0.0.1 pddhandorder.kuaidizs.cn

127.0.0.1 mt.kuaidizs.cn
127.0.0.1 alin.kuaidizs.cn
127.0.0.1 zz.kuaidizs.cn
127.0.0.1 jdn.kuaidizs.cn
127.0.0.1 vdiantest.kuaidizs.cn
127.0.0.1 yz.kuaidizs.cn
127.0.0.1 fxg.kuaidizs.cn
127.0.0.1 mgj1.kuaidizs.cn
127.0.0.1 vdiantest.kuaidizs.cn
127.0.0.1 ktt1.kuaidizs.cn

127.0.0.1 online.qnfh.superboss.cc
127.0.0.1 online.speedprint.superboss.cc
127.0.0.1 test.speedprint.superboss.cc
`
}

function isClickLineNumber(e: editor.IEditorMouseEvent) {
  return e.target.element?.classList.contains('line-numbers')
}

function toggleLineComment(range: IRange, editor: editor.IStandaloneCodeEditor) {
  const source = editor.getValue()

  const code = source.split(/\n/g)[range.startLineNumber - 1]

  if (!code.trim().length) {
    return
  }

  const hasHash = code.trim().startsWith('#')

  const editAction: editor.IIdentifiedSingleEditOperation = {
    range: {
      startLineNumber: range.startLineNumber,
      startColumn: 1,
      endLineNumber: range.startLineNumber,
      endColumn: hasHash ? code.match(/^ *# */)![0].length + 1 : 1
    },
    text: hasHash ? '' : '# '
  }

  editor.executeEdits(code, [editAction])
}

export const Editor = defineComponent({
  setup() {
    const data = reactive({
      el: null as any
    })

    onMounted(() => {
      const ed = editor.create(data.el, {
        language: 'hosts',
        theme: 'hosts',
        selectOnLineNumbers: false
      })

      ed.setValue(getCodes())

      ed.onMouseDown(e => {
        const range = e.target.range

        if (isClickLineNumber(e) && range) {
          toggleLineComment(range, ed)
        }
      })
    })

    return () => {
      return <div class='editor' ref={el => (data.el = el)}></div>
    }
  }
})
