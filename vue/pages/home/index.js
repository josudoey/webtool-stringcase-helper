import template from './template.pug'
import camelCase from 'camelcase'
import { snakeCase } from 'snake-case'
import pick from 'lodash/pick'
const persistKey = 'state'
const persistProps = ['sample', 'result']
export default {
  template,
  data: () => {
    return {
      sample: 'hello world',
      result: ''
    }
  },
  mounted () {
    this.load()
    this.translate()
  },
  updated () {
    this.save()
  },
  methods: {
    save: function () {
      const persisValue = JSON.stringify(pick(this.$data, persistProps))
      window.sessionStorage.setItem(persistKey, persisValue)
    },
    load () {
      const state = window.sessionStorage.getItem(persistKey)
      if (!state) {
        return
      }
      const persistState = pick(JSON.parse(state), persistProps)
      Object.assign(this.$data, persistState)
    },
    translate () {
      const lines = this.sample.split(/\s+/)
      const items = Array.from(new Set(lines))
      for (let i = 0; i < items.length; i++) {
        const name = items[i]
        const goName = camelCase(name, { pascalCase: true })
          .replace(/Id$/, 'ID')
          .replace(/Url$/, 'URL')
        const jsonName = camelCase(name, { pascalCase: false })
        const fieldName = snakeCase(name)
        items[i] = `${fieldName}\n${goName}\n${jsonName}\n`
      }
      this.result = items.join('\n')
    }
  }
}
