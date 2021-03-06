const path = require('path')
const projectPath = __dirname
const distPath = path.resolve(projectPath, 'dist')
const publicPath = './'

module.exports = {
  publicPath,
  distPath,
  entry: {
    index: path.join(projectPath, './vue/index.js')
  },
  html: {
    appMountId: 'app',
    appMountHtmlSnippet: '<router-view><div><i class="fa fa-spinner fa-spin fa-5x" aria-hidden="true"></i></div></router-view>',
    lang: 'en-US',
    title: '',
    meta: [{
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
    }, {
      name: 'robots',
      content: 'noindex, nofollow'
    }],
    links: [],
    scripts: []
  }
}
