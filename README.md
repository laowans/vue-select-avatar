# 简介
这是一个基于 vue 选择头像的包，可自定义主题色、图片格式、图片文件大小等，支持返回 base64 和 file 格式的“PNG”图片，同时还适配了移动端。

# 效果展示
PC端：![pc](../../1.gif)

移动端：![app](../../2.gif)

# 使用

```js
// 导入
import selectAvatars from 'vue-select-avatars'
export default {
  name: 'App',
  methods:{
    click(){
      selectAvatars({ // 配置项
        returnType = 'base64', // 返回的数据格式(base64 | file)
        nightMode = false, // 是否为夜间模式
        title = '选择头像', // 标题
        maskLayer = true, // 是否出现遮罩层
        beforeClose = null, // 点击遮罩层和右上角叉的回调函数，关闭前调用这个函数，并传入一个函数形参。需调用传入的函数才可关闭窗口
        cancelButtonText = '取消', // 确定按钮文本
        confirmButtonText = '确定', // 取消按钮文本
        zoomRatio = 6, // 最大放大倍数
        accept = ['jpg', 'jpeg', 'png'], // 文件格式
        maxKB = 2048, // 文件最大KB值
        edgeLine = true, // 是否展示边缘线
        edgeLineOpacity = 0.8, // 边缘线透明度
        themeColor = '#409EFF', // 主题色(16进制颜色代码)
      }).then(data=>{
        console.log('数据：', data)
      }).catch(err=>{ // 错误处理
        if(err.message === 'Picture format error'){
            console.log('图片格式错误')
        }else if(err.message === 'Picture is too large'){
            console.log('图片过大')
        }
      })
    }
  },
}
```