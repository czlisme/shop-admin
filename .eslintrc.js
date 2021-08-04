module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'space-before-function-paren': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-blocks':0,
    'key-spacing':0,
    indent:0,
    'comma-dangle':0,
    'no-unreachable':0,
    'space-in-parens':0,
    'no-unused-expressions':0,
    'spaced-comment': 0,
    'no-useless-escape':0
  }
}
