module.exports = {
  devServer: {
    // open: true,
    proxy: {
      '/api': {
        target: 'https://www.liulongbin.top:8888',
        /*目标调用的接口域名和端口号 */
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    },
  },
  publicPath: './',
  // 配置不同模式下打包的入口文件
  chainWebpack: config => {
    // 发布模式下
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
    })
    // 开发模式下
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
