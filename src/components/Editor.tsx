import { defineComponent, onMounted, reactive, watch } from 'vue'
import { editor, IRange } from 'monaco-editor'
import './lang-hosts'
import { actions, store } from '../store'

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
      el: {} as HTMLElement
    })

    let ed: editor.IStandaloneCodeEditor

    function updateSource() {
      const selectedNode = actions.getSelectedNode()

      if (selectedNode && ed) {
        if (selectedNode.source !== ed.getValue()) {
          ed.setValue(selectedNode.source)
        }

        ed.updateOptions({
          readOnly: selectedNode.readonly
        })

        ed.setScrollTop(0)
      }
    }

    onMounted(() => {
      ed = editor.create(data.el, {
        language: 'hosts',
        theme: 'hosts',
        selectOnLineNumbers: false
      })

      updateSource()

      ed.onMouseDown((e) => {
        const range = e.target.range

        if (isClickLineNumber(e) && range) {
          toggleLineComment(range, ed)
        }
      })

      ed.onKeyDown(async (e) => {
        if (e.browserEvent.key === 's' && e.metaKey) {
          const selectedNode = actions.getSelectedNode()
          if (selectedNode) {
            selectedNode.source = ed.getValue()
          }

          store.saved = true
          await actions.saveConfig()
        }
      })

      ed.onDidChangeModelContent(() => {
        const selectedNode = actions.getSelectedNode()

        if (selectedNode) {
          const changed = selectedNode.source !== ed.getValue()
          store.saved = store.saved && !changed
        }
      })
    })

    watch(
      () => store.selected,
      () => {
        updateSource()
      }
    )

    return () => {
      return <div class='editor' ref={(el) => (data.el = el)}></div>
    }
  }
})
