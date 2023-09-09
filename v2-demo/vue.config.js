const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
	transpileDependencies: true,
	productionSourceMap: false,
	lintOnSave: false,
	outputDir: path.join(__dirname, '../page/demo/v2'), // 输出目录
	publicPath: './',
});
