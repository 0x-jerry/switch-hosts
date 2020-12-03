/* eslint-disable */
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
const config = {
  configureWebpack: {
    devtool: 'source-map'
  },
  chainWebpack(ctx) {
    ctx.plugin('monaco-editor').use(MonacoWebpackPlugin)
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.ts',
      nodeIntegration: true,
      mainProcessWatch: ['src/background'],
      builderOptions: {
        artifactName: '${name}-v${version}.${ext}'
      }
    }
  }
}

module.exports = config
