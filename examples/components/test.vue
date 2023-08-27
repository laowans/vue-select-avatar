<template>
	<div class="container">
		<div class="but-box">
			<button @click="base">基础</button>
			<button @click="dark">暗色</button>
			<button @click="largeImage">大图</button>
			<button @click="sizeLimit">限制返回大小512</button>
			<button @click="beforeClose">beforeClose</button>
			<button @click="t6">限制图片最小宽高500</button>
			<button @click="t7">更改区域数值1</button>
			<button @click="t8">更改区域数值2</button>
			<button @click="t9">更改区域数值3</button>
			<button @click="t10">调整缩放比</button>
			<button @click="t11">调整图片格式jpg</button>
		</div>
		<div class="image-box">
			<img ref="img" :src="href" v-if="href" />
		</div>
	</div>
</template>

<script>
import selectAvatar from '../../src';
// import { selectAvatar as selectAvatar2 } from '../lib';
export default {
	name: 'test',
	data() {
		return {
			href: '',
		};
	},
	methods: {
		// 基础
		base() {
			selectAvatar().then((res) => {
				console.log(res);
				this.href = res.base64;
			});
		},
		// 暗色
		dark() {
			selectAvatar({ dark: true }).then((res) => {
				console.log(res);
				this.href = res.base64;
			});
		},
		// 大图
		largeImage() {
			selectAvatar({ fileSizeLimit: 4096 }).then((res) => {
				console.log(res);
				this.href = res.base64;
			});
		},
		// 限制大小
		sizeLimit() {
			selectAvatar({ fileSizeLimit: 4096, maxAvatarSize: 512 }).then((res) => {
				console.log(res);
				this.href = res.base64;
			});
		},
		beforeClose() {
			selectAvatar({
				beforeClose(done) {
					if (confirm('确定关闭吗')) {
						done();
					}
				},
			}).then((res) => {
				console.log(res);
				this.href = res.base64;
			});
		},
		t6() {
			selectAvatar({
				minAvatarSize: 500,
			}).then((res) => {
				console.log(res);
				this.href = res.base64;
			});
		},
		t7() {
			selectAvatar({
				cropperSize: 0,
				workspaceSize: 400,
			}).then((res) => {
				console.log(res);
				this.href = res.base64;
			});
		},
		t8() {
			selectAvatar({
				cropperSize: 100,
				workspaceSize: 600,
			}).then((res) => {
				console.log(res);
				this.href = res.base64;
			});
		},
		t9() {
			selectAvatar({
				cropperSize: 200,
				workspaceSize: 100,
			}).then((res) => {
				console.log(res);
				this.href = res.base64;
			});
		},
		t10() {
			selectAvatar({
				maxZoomRatio: 100,
			}).then((res) => {
				console.log(res);
				this.href = res.base64;
			});
		},
		t11() {
			selectAvatar({
				ext: 'jpg',
			}).then((res) => {
				console.log(res);
				this.href = res.base64;
			});
		},
	},
};
</script>
