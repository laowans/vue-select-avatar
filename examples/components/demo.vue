<template>
	<div class="container">
		<div class="but-box">
			<button @click="select">选择头像</button>
		</div>
		<div class="image-box">
			<img ref="img" :src="href" v-if="href" />
		</div>
	</div>
</template>

<script>
import selectAvatar from '../../src';
export default {
	name: 'demo',
	data() {
		return {
			href: '',
		};
	},
	methods: {
		select() {
			selectAvatar();
		},
	},
};
</script>
