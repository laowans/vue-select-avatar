<template>
	<div id="app">
		<div class="but-box">
			<button type="button" class="my-but" @click="select">选择头像</button>
		</div>
		<VariableOptions v-model="options" :options="variableOptions" dark />
		<div class="image-box">
			<img :src="src" alt="" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { selectAvatar, SelectAvatarOptions } from 'vue-select-avatar';
import VariableOptions, { OPTIONS } from 'vue-variable-options';

export default Vue.extend({
	name: 'App',
	components: { VariableOptions },
	data() {
		return {
			options: {} as SelectAvatarOptions,
			src: '',
			variableOptions: {
				title: {
					label: '标题',
					type: 'string',
					default: '选择头像',
				},
				confirmButtonText: {
					label: '确定按钮文本',
					type: 'string',
					default: '确定',
				},
				cancelButtonText: {
					label: '取消按钮文本',
					type: 'string',
					default: '取消',
				},
				themeColor: {
					label: "主题色(格式：'#409EFF' \/ '0, 0, 0')",
					type: 'color',
					default: '#409EFF',
				},
				edgeLine: {
					label: '是否展示边缘线',
					type: 'boolean',
					default: true,
				},
				overlay: {
					label: '是否展示遮罩层',
					type: 'boolean',
					default: true,
				},
				top: {
					label: '对话框距离顶部的距离，接受css长度值(10px, 10vh)，不传就是垂直居中',
					type: 'options',
					options: [undefined, '15vh', '30vh'],
					deleteIfUndefined: true,
				},
				dark: {
					label: '是否为暗色模式',
					type: 'boolean',
					default: false,
				},
				gridBackground: {
					label: '是否使用网格背景',
					type: 'boolean',
					default: true,
				},
				dataType: {
					label: '返回数据格式',
					type: 'options',
					options: ['base64', 'file', 'all'],
					default: 'all',
				},
				ext: {
					label: '返回图片格式',
					type: 'options',
					options: ['png', 'jpg'],
					default: 'png',
				},
				filename: {
					label: '返回图片格式为 file 的文件名，默认为选择图片的文件名（注意不要加扩展名）',
					type: 'options',
					options: [undefined, 'avatar1', 'avatar2'],
					deleteIfUndefined: true,
				},
				maxZoomRatio: {
					label: '最大缩放比（需要大于 0）',
					type: 'number',
					default: 6,
				},
				viewportSize: {
					label: '取景器/视口大小',
					type: 'number',
					default: 300,
				},
				fileSizeLimit: {
					label: '选择图片文件的大小限制，单位：KB',
					type: 'number',
					default: 2048,
				},
				maxAvatarSize: {
					label: '返回头像最大值，当选择区域的头像大小(宽高)超过这个值时，则按照这个值返回（大于0生效）',
					type: 'number',
					default: 0,
				},
				minAvatarSize: {
					label: '选择的图片宽高的最小值',
					type: 'number',
					default: 0,
				},
				minAvatarSizeLimit: {
					label: '当这个为 true 且设置了 minAvatarSize 时，图片放大时宽高的最小值就不能超过 minAvatarSize',
					type: 'boolean',
					default: false,
				},
				cropperSize: {
					label: '遮挡区宽度',
					type: 'number',
					default: 60,
				},
				closeOnClickOverlay: {
					label: '是否可以通过点击遮罩层关闭',
					type: 'boolean',
					default: true,
				},
				closeOnPressEscape: {
					label: '是否可以通过按下 ESC 关闭',
					type: 'boolean',
					default: true,
				},
				beforeClose: {
					label: '关闭前的回调，回调函数内执行 done 参数方法的时候才是真正关闭的时候',
					type: 'options',
					options: [
						undefined,
						(n: Function) => {
							setTimeout(n, 1000);
						},
					],
					deleteIfUndefined: true,
				},
				arrowKeys: {
					label: '是否可以通过方向键和w、a、s、d键调整位置',
					type: 'boolean',
					default: true,
				},
			} as OPTIONS,
		};
	},
	methods: {
		select() {
			selectAvatar(this.options).then(
				(res) => {
					console.log('返回结果：', res);

					if (typeof res === 'string') {
						this.src = res;
					} else if (res instanceof File) {
						const reader = new FileReader();
						reader.onload = () => {
							this.src = reader.result as string;
						};
						reader.readAsDataURL(res);
					} else {
						this.src = res.base64;
					}
				},
				(err: Error) => {
					console.log('错误：');
					console.error(err);

					setTimeout(() => alert(err.message), 10);
				}
			);
		},
	},
});
</script>

<style scoped></style>
