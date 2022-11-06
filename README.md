# 注意
>此包未经过严格的BUG审查，请勿用于重要的项目。
>
>项目地址：https://gitee.com/laowans/vue-select-avatar
>



# 简介
这是一个基于 vue 选择头像的包，可自定义主题色、图片文件大小等，支持自动矫正图片位置，可使用鼠标或手指移动图片，使用滚轮可缩放图片（移动端采用按钮缩放，考虑到手指缩放极易触发浏览器原生的缩放事件），返回 base64 和 file 格式的“PNG”图片，同时还适配了移动端。

# 效果展示

## 不同设备：

PC端：![pc](https://gitee.com/laowans/vue-select-avatar/raw/1edbdeceebe2a7c6503f7edfa26f1f2441fcdb71/static/1.gif)



移动端：![app](https://gitee.com/laowans/vue-select-avatar/raw/1edbdeceebe2a7c6503f7edfa26f1f2441fcdb71/static/2.gif)



## 日夜间模式：

日：![](https://gitee.com/laowans/vue-select-avatar/raw/1edbdeceebe2a7c6503f7edfa26f1f2441fcdb71/static/1.png)

夜：![](https://gitee.com/laowans/vue-select-avatar/raw/1edbdeceebe2a7c6503f7edfa26f1f2441fcdb71/static/2.png)

## 不同主题色：

![1](https://gitee.com/laowans/vue-select-avatar/raw/1edbdeceebe2a7c6503f7edfa26f1f2441fcdb71/static/1.png)

![](https://gitee.com/laowans/vue-select-avatar/raw/1edbdeceebe2a7c6503f7edfa26f1f2441fcdb71/static/3.png)

![](https://gitee.com/laowans/vue-select-avatar/raw/1edbdeceebe2a7c6503f7edfa26f1f2441fcdb71/static/4.png)

# 使用

此包为函数式引用后，需传入一个配置对象，此包为 Promise 风格，通过.then 获取处理后的数据

例：

```js
// 导入
import selectAvatars from 'vue-select-avatars' 
export default {
    name: 'App',
    methods:{
        click(){
            selectAvatars({ // 配置项
                nightMode: true, // 是否为夜间模式
            }).then(data=>{
                console.log('数据：', data)

            }).catch(err=>{ // 错误处理
                switch(err.code){
                    case 0 :
                        console.log('图片格式错误')
                        break;
                    case 1 :
                        console.log('图片过大')
                        break;
                }
            })
        }
    },
}
```

## 不同项目导入方式：

### vue项目

vue 项目可直接通过包名导入

```js
import selectAvatars from 'vue-select-avatars' 
```

### 其他框架项目

其他框架项目需导入 lib 文件夹下打包好的文件

```js
import selectAvatars from 'vue-select-avatars/lib' 
```



## 配置项：

| 参数              | 说明                                                         | 类型           | 可选值        | 默认值   |
| ----------------- | ------------------------------------------------------------ | -------------- | ------------- | -------- |
| returnType        | 返回的数据格式                                               | string         | base64 / file | base64   |
| nightMode         | 是否为夜间模式                                               | boolean        |               | false    |
| title             | 标题                                                         | string         |               | 选择头像 |
| maskLayer         | 是否出现遮罩层                                               | boolean        |               | true     |
| beforeClose       | 点击遮罩层和右上角叉的回调函数，关闭前调用这个函数，并传入一个函数形参。需调用传入的函数才可关闭窗口 | function       |               | 无       |
| cancelButtonText  | 取消按钮文本                                                 | string         |               | 取消     |
| confirmButtonText | 确定按钮文本                                                 | string         |               | 确定     |
| zoomRatio         | 最大放大倍数                                                 | number         |               | 6        |
| accept            | 选择的文件格式，数组：['png', 'jpeg']、通配符："*"           | array / string |               | *        |
| maxKB             | 文件最大KB值                                                 | number         |               | 2048     |
| edgeLine          | 是否展示边缘线                                               | boolean        |               | true     |
| edgeLineOpacity   | 边缘线透明度（0.0 - 1.0）                                    | number         |               | 0.8      |
| themeColor        | 主题色(16进制颜色代码)                                       | string         |               | \#409EFF |



## 错误代码

1.1.0 版本之后采用错误代码，判断是那种错误

通过错误对象的 code 属性获取

例：

```js
selectAvatars({
    nightMode: true,
}).then(data=>{
    console.log('数据：', data)

}).catch(err=>{
    switch(err.code){ // 错误代码
        case 0 :
            console.log('图片格式错误')
            break;
        case 1 :
            console.log('图片过大')
            break;
    }
})
```

码表：

| 错误代码值 | 说明         |
| ---------- | ------------ |
| 0          | 图片格式错误 |
| 1          | 图片过大     |



# 注意

在移动端使用时需开启“移动端理想视口”，否则弹出的对话框的比例将过小

在 head 标签内添加如下代码即可开启

```html
<meta name="viewport" content="width=device-width,initial-scale=1.0">
```

