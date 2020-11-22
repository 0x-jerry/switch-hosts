import * as monaco from 'monaco-editor'

// Register a new language
monaco.languages.register({ id: 'hosts' })

// Register a tokens provider for the language
monaco.languages.setMonarchTokensProvider('hosts', {
  tokenizer: {
    root: [
      [/#.*/, 'comment'],
      [/([0-9]{1,3}\.){3}[0-9]{1,3}(?=\s+)/, 'ip'],
      [/(::\d)(?=\s+)/, 'ip'],
      [/(?!\s+)(\w|\.)+/, 'host']
    ]
  }
})

// Define a new theme that contains only rules that match this language
monaco.editor.defineTheme('hosts', {
  base: 'vs',
  inherit: true,
  colors: {},
  rules: [
    { token: 'host', foreground: '880000' },
    { token: 'comment', foreground: '808080' },
    { token: 'ip', foreground: '008800' }
  ]
})
