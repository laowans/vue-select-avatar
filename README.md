# vue-select-avatar

这是一个基于 vue 选择头像的包，可以用简单的鼠标操作对图片实现缩放、移动的效果，从而得到一张符合用户预期的头像。

### 说明

2 版本相比 1 版本取消支持了移动端，2 版本使用 ts + vue2 + sass 进行了重构

> 将推出的 3 版本，将采用 ts + vite + vue3 + sass 进行开发

### 演示地址

[演示地址](https://laowans.gitee.io/vue-select-avatar/demo/v2/)

### 安装

```
npm i vue-select-avatar
```

> 注意：vue2 的项目请安装 "2.x.x" 版本，vue3 的项目暂时还不支持

### 使用

```js
// 导入
import selectAvatar from 'vue-select-avatar';

selectAvatars({
	// 配置项……
})
	.then((data) => {
		console.log('返回数据：', data);
	})
	.catch((err) => {
		// 错误处理
		switch (err.code) {
			case 0:
				console.log('图片格式错误');
				break;
			case 1:
				console.log('图片文件过大');
				break;
			case 2:
				console.log('图片尺寸过小');
				break;
		}
	});
```

### options

| 参数                | 类型                     | 可选值                    | 默认值     | 说明                                                                                                                            |
| ------------------- | ------------------------ | ------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| title               | string                   |                           | '选择头像' | 标题                                                                                                                            |
| confirmButtonText   | string                   |                           | '确定'     | 确定按钮文本                                                                                                                    |
| cancelButtonText    | string                   |                           | '取消'     | 取消按钮文本                                                                                                                    |
| themeColor          | string                   |                           | '\#409EFF' | 主题色('\#409EFF' / '64, 158, 255')                                                                                             |
| edgeLine            | boolean                  |                           | true       | 是否展示边缘线                                                                                                                  |
| overlay             | boolean                  |                           | true       | 是否展示遮罩层                                                                                                                  |
| top                 | string                   |                           |            | 对话框距离顶部的距离，接受 css 长度值(10px, 10vh)，不传就是垂直居中                                                             |
| dark                | boolean                  |                           | false      | 是否为暗色模式                                                                                                                  |
| gridBackground      | boolean                  |                           | true       | 是否使用网格背景                                                                                                                |
| dataType            | string                   | 'base64' / 'file' / 'all' | 'all'      | 返回数据格式                                                                                                                    |
| ext                 | string                   | 'png' / 'jpg'             | 'png'      | 返回图片格式                                                                                                                    |
| filename            | string                   |                           |            | 返回图片格式为 file 的文件名，默认为选择图片的文件名（注意不要加扩展名）                                                        |
| maxZoomRatio        | number                   |                           | 6          | 最大缩放比（需要大于 0）                                                                                                        |
| viewportSize        | number                   |                           | 300        | 取景器/视口 大小                                                                                                                |
| fileSizeLimit       | number                   |                           | 2048       | 选择图片文件的大小限制，单位：KB                                                                                                |
| maxAvatarSize       | number                   |                           | 0          | 返回头像最大值，当选择区域的头像大小(宽高)超过这个值时，则按照设置的宽高值返回（大于 0 生效）                                   |
| minAvatarSize       | number                   |                           | 0          | 选择的图片宽高的最小值（当用户选择的图片小于设置的值，则进入错误处理）（大于 0 生效）                                           |
| minAvatarSizeLimit  | boolean                  |                           | false      | 当这个为 true 且设置了 minAvatarSize 时，图片放大时宽高的最小值就不能超过 minAvatarSize                                         |
| cropperSize         | number                   |                           | 60         | 遮挡区宽度                                                                                                                      |
| closeOnClickOverlay | boolean                  |                           | true       | 是否可以通过点击遮罩层关闭                                                                                                      |
| closeOnPressEscape  | boolean                  |                           | true       | 是否可以通过按下 ESC 关闭                                                                                                       |
| beforeClose         | (done: Function) => void |                           |            | 关闭前的回调，回调函数内执行 done 参数方法的时候才是真正关闭的时候（当用户通过点击遮罩层、按下 ESC 键、点击关闭按钮的时候触发） |
| arrowKeys           | boolean                  |                           | true       | 是否可以通过方向键和 w、a、s、d 键调整位置                                                                                      |

### result

根据 dataType 的值返回不同的结果

| base64 | file | all                             |
| ------ | ---- | ------------------------------- |
| string | File | { base64: string, file: File; } |

### error

| 错误类型                | name                    | code | 说明                                                    |
| ----------------------- | ----------------------- | ---- | ------------------------------------------------------- |
| ImageTypeError          | ImageTypeError          | 0    | "vue-select-avatar"几乎支持所有常见图片类型（除了 gif） |
| TmageFileTooLarge       | TmageFileTooLarge       | 1    | 图片文件过大                                            |
| ImageDimensionsTooSmall | ImageDimensionsTooSmall | 2    | 图片尺寸过小                                            |

### 支持选择的图片类型

-   jpg
-   jpeg
-   png
-   svg
-   svgz
-   webp
-   ico
-   xbm
-   tif
-   jfif
-   tiff
-   bmp
-   pjp
-   apng
-   pjpeg
-   avif
