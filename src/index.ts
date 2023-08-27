import type { SelectAvatarOptions, SelectAvatarResult } from '../lib/index';
import { ImageTypeError, TmageFileTooLarge, ImageDimensionsTooSmall } from './error';
import { DefaultOptionsType, UnionOptions } from './type';
import component from './index.vue';
import Vue from 'vue';
import './style.css';
import { parseColor } from './utils';

// 创建构造组件实例
const componentConstructor = Vue.extend(component);

// 可以选择的图片类型
const accept = [
	'jpg',
	'jpeg',
	'png',
	'svg',
	'svgz',
	'webp',
	'ico',
	'xbm',
	'tif',
	'jfif',
	'tiff',
	'bmp',
	'pjp',
	'apng',
	'pjpeg',
	'avif',
];

// 默认配置
const defaultOptions: DefaultOptionsType = {
	title: '选择头像',
	confirmButtonText: '确定',
	cancelButtonText: '取消',
	themeColor: '#409EFF',
	edgeLine: true,
	overlay: true,
	dark: false,
	gridBackground: true,
	dataType: 'all',
	ext: 'png',
	maxZoomRatio: 6,
	viewportSize: 300,
	fileSizeLimit: 2048,
	maxAvatarSize: 0,
	minAvatarSize: 0,
	minAvatarSizeLimit: false,
	cropperSize: 60,
	closeOnClickOverlay: true,
	closeOnPressEscape: true,
};

const selectAvatar = (_options?: SelectAvatarOptions) => {
	return new Promise<SelectAvatarResult>((resolve, reject) => {
		const options = (_options ? { ...defaultOptions, ..._options } : defaultOptions) as UnionOptions;

		const FileInputDom = document.createElement('input'); // 创建input元素
		FileInputDom.type = 'file'; // 设置元素的类型
		FileInputDom.accept = accept.map((a) => '.' + a).join(', ');
		FileInputDom.onchange = (event) => {
			const fileList = (event.target as HTMLInputElement)?.files;
			if (!fileList) return;

			const file = fileList[0];

			const ext = file.type.split('/')[1];

			// 验证选择的图片的类型
			if (!accept.includes(ext)) {
				reject(new ImageTypeError(ext, accept));
				return;
			}

			// 验证图片大小
			const size = Math.floor(file.size / 1024);
			if (size > options.fileSizeLimit) {
				reject(new TmageFileTooLarge(size, options.fileSizeLimit));
				return;
			}

			const reader = new FileReader();
			reader.onload = () => {
				const base64URL = reader.result as string;

				try {
					const img = new Image();
					img.onload = () => {
						const min = Math.min(img.width, img.height);

						if (options.minAvatarSize > 0 && min < options.minAvatarSize) {
							// 图片宽高过小
							reject(new ImageDimensionsTooSmall(img.width, img.height, options.minAvatarSize));
							return;
						}

						// 获取主题色
						const RGB = parseColor(options.themeColor, defaultOptions.themeColor);

						// 创建组件实例
						const instance = new componentConstructor({
							propsData: {
								resolve,
								reject,
								RGB,
								options,
								base64URL,
								originalWidth: img.width,
								originalHeight: img.height,
							},
						});

						document.body.appendChild(instance.$mount().$el); // 挂载并添加到页面上
					};
					img.src = base64URL;
				} catch (error) {
					reject(error);
				}
			};
			// 读取文件信息
			reader.readAsDataURL(file);
		};
		FileInputDom.click();
	});
};

export default selectAvatar;
