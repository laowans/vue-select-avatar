const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap:false,
  lintOnSave:false,
  pages: {
    index: {
      // 修改项目入口文件，用于测试
      entry: "examples/main.js",
      template: "examples/index.html",
      filename: "index.html",
    },
  },
})
