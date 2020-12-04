import { defineComponent, onMounted, reactive, watch } from 'vue'
import { editor, IRange } from 'monaco-editor'
import './lang-hosts'
import { actions, confStore } from '../store'

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

function initSearchAction(ed: editor.IStandaloneCodeEditor) {
  // https://github.com/Microsoft/monaco-editor/issues/808#issuecomment-380151046
  const findCtr = ed.getContribution('editor.contrib.findController') as any

  findCtr._register(
    findCtr._state.onFindReplaceStateChange((e: any) => {
      // https://github.com/microsoft/vscode/blob/f2edfdc20b43602df8bbb155c988f50c0cd5ba5a/src/vs/editor/contrib/find/findController.ts#L67
      const visible = findCtr._findWidgetVisible.get()
      const searchString = findCtr._state._searchString

      if (visible) {
        console.log(searchString)
      }
    })
  )
}

function useEditor() {
  const el = document.createElement('div')
  el.classList.add('full')

  const ed = editor.create(el, {
    language: 'hosts',
    theme: 'hosts',
    automaticLayout: true,
    selectOnLineNumbers: false
  })

  initSearchAction(ed)

  // @ts-ignore
  window.__editor = ed

  ed.onMouseDown((e) => {
    const range = e.target.range

    if (isClickLineNumber(e) && range) {
      toggleLineComment(range, ed)
    }
  })

  ed.onKeyDown(async (e) => {
    if (e.browserEvent.key === 's' && e.metaKey) {
      const selectedNode = actions.getSelectedNode()
      if (!selectedNode) {
        return
      }

      confStore.files[selectedNode.id] = ed.getValue()
      selectedNode.saved = true

      if (selectedNode.checked) {
        await actions.saveHosts()
      } else {
        await actions.saveConfig()
      }
    }
  })

  ed.onDidChangeModelContent(() => {
    const selectedNode = actions.getSelectedNode()

    if (selectedNode) {
      const changed = confStore.files[selectedNode.id] !== ed.getValue()
      selectedNode.saved = selectedNode.saved && !changed
    }
  })

  return {
    el: el,
    editor: ed
  }
}

export const Editor = defineComponent({
  setup() {
    const data = reactive({
      el: {} as HTMLElement
    })

    const { el, editor } = useEditor()

    function updateSource() {
      const selectedNode = actions.getSelectedNode()

      if (!selectedNode) {
        return
      }

      selectedNode.saved = true

      if (confStore.files[selectedNode.id] !== editor.getValue()) {
        editor.setValue(confStore.files[selectedNode.id] || '')
      }

      editor.updateOptions({
        readOnly: selectedNode.readonly
      })

      editor.setScrollTop(0)
    }

    updateSource()

    onMounted(() => data.el.append(el))

    watch(
      () => confStore.selected,
      () => {
        updateSource()
      }
    )

    return () => {
      return <div class='editor' ref={(el) => (data.el = el as HTMLElement)}></div>
    }
  }
})
