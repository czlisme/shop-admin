# vue_shop
本电商后端项目基于vue和element-ui 开发
默认登录账号密码
username === admin
password === 123456
后端接口通过proxy代理配置,解决跨域
接口详情请看文档
api.md
## Project setup
```
npm install 安装所有依赖包
```

### Compiles and hot-reloads for development
```
npm run serve 开发环境下
```

### Compiles and minifies for production
```
npm run build 生产环境下
```

# 不同的环境下不同的入口文件 
```
dev 开发环境下 main-dev.js 
build 生产环境下 main-prod.js 通过cdn引入减少打包后的大小
```
### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
