<template>
	<div class="__select_avatar__container">
		<transition name="__select_avatar" @after-leave="afterLeave">
			<div
				class="__select_avatar"
				:style="cssvar"
				:class="{ __dark: options.dark, __top: options.top }"
				v-show="show">
				<!-- 头部 -->
				<div class="__select_avatar__header">
					<span class="__select_avatar__title">{{ options.title }}</span>
					<svg
						@click="beforeClose"
						title="关闭窗口"
						t="1693040404088"
						class="icon __select_avatar__close"
						viewBox="0 0 1024 1024"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						p-id="4015"
						width="16"
						height="16">
						<path d="M0 0h1024v1024H0z" fill-opacity="0" p-id="4016"></path>
						<path
							d="M240.448 168l2.346667 2.154667 289.92 289.941333 279.253333-279.253333a42.666667 42.666667 0 0 1 62.506667 58.026666l-2.133334 2.346667-279.296 279.210667 279.274667 279.253333a42.666667 42.666667 0 0 1-58.005333 62.528l-2.346667-2.176-279.253333-279.253333-289.92 289.962666a42.666667 42.666667 0 0 1-62.506667-58.005333l2.154667-2.346667 289.941333-289.962666-289.92-289.92a42.666667 42.666667 0 0 1 57.984-62.506667z"
							p-id="4017"></path>
					</svg>
				</div>
				<!-- 操作区 -->
				<div
					class="__select_avatar__body"
					:class="{ __edgeLine: options.edgeLine, __grid_background: options.gridBackground }">
					<!-- 遮挡层 -->
					<template v-if="options.cropperSize > 0">
						<div class="__select_avatar__cropper top"></div>
						<div class="__select_avatar__cropper right"></div>
						<div class="__select_avatar__cropper bottom"></div>
						<div class="__select_avatar__cropper left"></div>
					</template>
					<!-- 图片 -->
					<img
						:src="base64URL"
						@mousedown="onMousedown"
						@wheel="wheelCallback"
						class="__select_avatar__img"
						:class="{ __drag: drag }"
						ref="img"
						:style="`width: ${width}px; height: ${height}px; top: ${y}px; left: ${x}px;`" />
				</div>
				<!-- 底部 -->
				<div class="__select_avatar__footer">
					<button class="__select_avatar__but" @click="close" :title="options.cancelButtonText">
						{{ options.cancelButtonText }}
					</button>
					<button class="__select_avatar__but __primary" @click="confirm" :title="options.confirmButtonText">
						{{ options.confirmButtonText }}
					</button>
				</div>
			</div>
		</transition>
		<!-- 遮罩层 -->
		<div class="__select_avatar__overlay" v-if="options.overlay" @click="overlayClick"></div>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { UnionOptions } from './type';
import type { SelectAvatarResult } from '../lib';

export default Vue.extend({
	name: 'select-avatar',
	data() {
		return {
			// css变量
			cssvar: '',
			// 图片是否处于移动中
			drag: false,
			// 图片缩放比例
			zoomRatio: 0,
			// 图片位置
			x: 0,
			y: 0,
			// 图片宽高
			w: 0,
			h: 0,

			// 缩放偏移量
			scaleOffset: 0.05,

			// 滚动是否高频触发
			wheelHighFrequency: false,

			// 是否展示
			show: false,

			// 定时器存储
			correctTimer: -1,
			transitionTimer: -1,
			wheelTimer: -1,
		};
	},
	props: {
		resolve: {
			type: Function as PropType<(data: SelectAvatarResult) => void>,
			required: true,
		},
		reject: {
			type: Function,
			required: true,
		},
		// 配置
		options: {
			type: Object as PropType<UnionOptions>,
			required: true,
		},
		// 主题色
		RGB: {
			type: Array as PropType<number[]>,
			required: true,
		},
		// 图片原始宽度
		originalWidth: {
			type: Number,
			required: true,
		},
		// 图片原始高度
		originalHeight: {
			type: Number,
			required: true,
		},
		base64URL: {
			type: String,
			required: true,
		},
	},
	created() {
		this.generateCSSVar();

		this.computeInitPosition();
	},
	mounted() {
		if (this.options.closeOnPressEscape) {
			window.addEventListener('keyup', this.onPressEscape);
		}

		this.show = true;
	},
	beforeDestroy() {
		if (this.options.closeOnPressEscape) {
			window.removeEventListener('keyup', this.onPressEscape);
		}
	},
	methods: {
		// 生成css变量
		generateCSSVar() {
			this.cssvar = ''; // 置空

			const rgbStr = `${this.RGB[0]}, ${this.RGB[1]}, ${this.RGB[2]}`;

			// 主题色
			this.cssvar += `--theme-color: rgb(${rgbStr});`;
			this.cssvar += [90, 75, 50, 20, 10].map((a) => `--theme-color-${a}: rgba(${rgbStr}, ${a}% );`).join('');

			// 工作区宽高
			this.cssvar += `--box-width: ${this.options.workspaceSize + this.options.cropperSize * 2}px;`;

			if (this.options.top) {
				// 窗口顶部距离
				this.cssvar += `--box-top: ${this.options.top};`;
			}

			// 遮挡区宽度
			this.cssvar += `--cropper-size: ${this.options.cropperSize}px;`;
			// 操作区宽度
			this.cssvar += `--workspace-size: ${this.options.workspaceSize}px;`;
		},
		// 计算初始位置
		computeInitPosition() {
			// 小的值对象
			const minObj = {
				value: 0,
				name: '',
			};

			// 大的值对象
			const maxObj = {
				value: 0,
				name: '',
			};

			// 找出宽高的大值和小值
			if (this.originalWidth > this.originalHeight) {
				minObj.value = this.originalHeight;
				minObj.name = 'h';

				maxObj.value = this.originalWidth;
				maxObj.name = 'w';
			} else {
				minObj.value = this.originalWidth;
				minObj.name = 'w';

				maxObj.value = this.originalHeight;
				maxObj.name = 'h';
			}

			// 计算缩放比
			const proportion = this.options.workspaceSize / minObj.value;

			// 初始宽高赋值
			// @ts-ignore
			this[minObj.name] = this.options.workspaceSize;
			// @ts-ignore
			this[maxObj.name] = Math.floor(maxObj.value * proportion); // 根据缩放比计算宽高之间大的值的长度

			const s = this.options.workspaceSize + this.options.cropperSize * 2;

			// 计算图片初始 x，y 轴
			if (minObj.name === 'h') {
				this.x = (s - this.w) / 2;
				this.y = this.options.cropperSize;
			} else {
				this.x = this.options.cropperSize;
				this.y = (s - this.h) / 2;
			}
		},
		// 销毁
		destroy() {
			this.$destroy(); // 销毁组件
			this.$el.parentNode?.removeChild(this.$el); // 从页面删除组件
		},
		// 关闭
		close() {
			this.show = false;
		},
		// 退出过度结束
		afterLeave() {
			this.destroy();
		},
		// 鼠标按下
		onMousedown(event: MouseEvent) {
			event.preventDefault();
			// 按下的不是左键则不动作
			if (event.button !== 0) return;

			this.drag = true;

			// @ts-ignore
			this.$refs.img.classList.remove('__transition');

			// 存储移动前的鼠标和图片的 x，y 轴数据
			const startX = event.clientX;
			const startY = event.clientY;
			// @ts-ignore
			const x = this.$refs.img.offsetLeft;
			// @ts-ignore
			const y = this.$refs.img.offsetTop;

			const move = (event: MouseEvent) => {
				this.x = event.clientX - startX + x;
				this.y = event.clientY - startY + y;
			};

			window.addEventListener('mousemove', move);

			const mouseup = () => {
				// 鼠标抬起移除事件
				window.removeEventListener('mousemove', move);
				window.removeEventListener('mouseup', mouseup);

				this.drag = false;

				this.correctPosition();
			};
			window.addEventListener('mouseup', mouseup);
		},
		// 鼠标滚动
		wheelCallback(event: WheelEvent) {
			event.preventDefault();
			clearTimeout(this.wheelTimer);

			let exceeded = false;

			// 存储原始宽高
			const width = this.width;
			const height = this.height;

			// 如果滚动频率处于高的状态，则放大缩放比例
			const offset = this.wheelHighFrequency ? this.scaleOffset * 4 : this.scaleOffset;

			if (event.deltaY < 0) {
				this.zoomRatio += offset; // 放大
			} else {
				this.zoomRatio -= offset; // 缩小
			}

			// 防止过度缩放
			if (this.zoomRatio < 0) {
				this.zoomRatio = 0;
				exceeded = true;
			} else if (this.zoomRatio > this.options.maxZoomRatio) {
				this.zoomRatio = this.options.maxZoomRatio;
				exceeded = true;
			}

			// 确保图片以鼠标缩放
			if (!exceeded) {
				// 获取鼠标位于图片的位置
				const offsetX = event.offsetX;
				const offsetY = event.offsetY;

				// 计算偏移量
				let x = (this.width - width) * (offsetX / width);
				let y = (this.height - height) * (offsetY / height);

				// 减去并存储偏移量
				this.x -= Math.round(x * 10) / 10;
				this.y -= Math.round(y * 10) / 10;
			}

			// 调用矫正函数
			this.correctPosition();

			this.wheelHighFrequency = true;
			this.wheelTimer = setTimeout(() => {
				this.wheelHighFrequency = false;
			}, 50);
		},
		// 矫正位置
		correctPosition() {
			// 防抖
			clearTimeout(this.correctTimer);
			clearTimeout(this.transitionTimer);

			if (this.drag) return;
			this.correctTimer = setTimeout(() => {
				// 是否需要添加过度类名
				let t = false;

				// 上
				if (this.x > this.options.cropperSize) {
					this.x = this.options.cropperSize;
					t = true;
				}
				// 左
				if (this.y > this.options.cropperSize) {
					this.y = this.options.cropperSize;
					t = true;
				}

				const s = this.options.workspaceSize + this.options.cropperSize;

				// 右
				if (this.width + this.x < s) {
					this.x = this.x + (s - (this.width + this.x));
					t = true;
				}
				// 下
				if (this.height + this.y < s) {
					this.y = this.y + (s - (this.height + this.y));
					t = true;
				}

				if (t) {
					// @ts-ignore
					this.$refs.img.classList.add('__transition');
					this.transitionTimer = setTimeout(() => {
						// @ts-ignore
						this.$refs.img.classList.remove('__transition');
					}, 100);
				}
			}, 100);
		},
		// 截取
		capture() {
			let x, // 截取坐标 x 轴
				y, // 截取坐标 y 轴
				l, // 截取的宽高
				n, // 实际绘制的宽高
				zoomRatio = this.width / this.originalWidth; // 实际缩放比例

			x = Math.abs(Math.abs(this.options.cropperSize - this.x) / zoomRatio); // 获取 x 轴的截取坐标
			y = Math.abs(Math.abs(this.options.cropperSize - this.y) / zoomRatio); // 获取 y 轴的截取坐标
			l = Math.abs(Math.floor(this.options.workspaceSize / zoomRatio)); // 获取截取的宽高
			n = l;

			// 判断是否需要根据 maxAvatarSize 设置实际绘制的宽高
			if (this.options.maxAvatarSize > 0 && n > this.options.maxAvatarSize) {
				n = this.options.maxAvatarSize;
			}

			// 创建 canvas
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			// 设置画板大小
			canvas.width = n;
			canvas.height = n;

			// 在canvas绘制图片
			ctx?.drawImage(this.$refs.img as HTMLImageElement, x, y, l, l, 0, 0, n, n);

			// 文件名
			const filename = (this.options.filename || 'avatar') + '.' + this.options.ext;
			// 文件类型
			const type = 'image/' + this.options.ext;

			// 转 Blob，再转 File
			canvas.toBlob((blob) => {
				if (!blob) return;
				const file = new File([blob], filename, {
					type,
				});

				// 判断是否需要 获取 base64
				if (this.options.dataType === 'all' || this.options.dataType === 'base64') {
					const reader = new FileReader(); // 创建读取器
					reader.onload = () => {
						const base64URL = reader.result as string;

						if (this.options.dataType === 'all') {
							this.resolve({
								base64: base64URL,
								file,
							});
						} else {
							this.resolve(base64URL);
						}

						this.close();
					};

					reader.readAsDataURL(file); // 读取 data url
				} else if (this.options.dataType === 'file') {
					this.resolve(file);
					this.close();
				}
			}, type);
		},
		// 确定按钮回调
		confirm() {
			this.capture();
		},
		// 关闭前回调，点击关闭按钮、遮罩层按下 ESC 时会调用这个方法
		beforeClose() {
			if (this.options.beforeClose) {
				this.options.beforeClose(this.close.bind(this));
			} else {
				this.close();
			}
		},
		// 遮罩层点击事件
		overlayClick() {
			if (this.options.closeOnClickOverlay) {
				this.beforeClose();
			}
		},
		// 按下esc事件回调
		onPressEscape(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				this.beforeClose();
			}
		},
	},
	computed: {
		// 图片宽度
		width(): number {
			return Math.floor(this.w * (this.zoomRatio + 1));
		},
		// 图片高度
		height(): number {
			return Math.floor(this.h * (this.zoomRatio + 1));
		},
	},
});
</script>
