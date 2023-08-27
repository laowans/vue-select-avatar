<template>
	<div class="container">
		<div class="but-box">
			<button @click="base">基础</button>
			<button @click="dark">暗色</button>
			<button @click="largeImage">大图</button>
			<button @click="sizeLimit">限制大小</button>
			<button @click="beforeClose">beforeClose</button>
		</div>
		<div class="image-box">
			<img ref="img" :src="href" v-if="href" />
		</div>
	</div>
</template>

<script>
import { selectAvatar } from '../../lib';
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
					setTimeout(done, 1000);
				},
			}).then((res) => {
				console.log(res);
				this.href = res.base64;
			});
		},
	},
};
</script>
