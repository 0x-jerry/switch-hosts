/* eslint-disable */

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
const config = {
  chainWebpack(ctx) {
    ctx.plugin('monaco-editor').use(MonacoWebpackPlugin)
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  }
}

module.exports = config
