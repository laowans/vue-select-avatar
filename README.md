# 简介
这是一个基于 vue 选择头像的包

# 使用
```js
// 导入
import selectAvatars from '../vue-select-avatars'
export default {
  name: 'App',
  methods:{
    click(){
      selectAvatars({ // 配置项
        returnType = 'base64', // 返回的数据格式(base64 or file)
        nightMode = false, // 是否为夜间模式
        title = '选择头像', // 标题
        maskLayer = true, // 是否出现遮罩层
        beforeClose = null, // 点击遮罩层和右上角叉的回调函数，关闭前调用这个函数，并传入一个函数形参。需调用传入的函数才可关闭窗口
        cancelButtonText = '取消', // 确定按钮文本
        confirmButtonText = '确定', // 取消按钮文本
        zoomRatio = 6, // 最大放大倍数
        accept = ['jpg', 'jpeg', 'png'], // 文件格式
        maxKB = 2048, // 文件最大KB值
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