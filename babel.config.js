const removeConsole = []
if (process.env.NODE_ENV === 'production`') {
  removeConsole.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk',
        ...removeConsole
      }
    ]
  ]
}
