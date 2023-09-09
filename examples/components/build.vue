<template>
	<div class="container">
		<div class="but-box">
			<button @click="select">选择头像(build)</button>
		</div>
		<VariableOptions v-model="options" :options="variableOptions" dark />
		<div class="image-box">
			<img ref="img" :src="src" v-if="src" />
		</div>
	</div>
</template>
<script lang="ts">
import Vue from 'vue';
import { selectAvatar, SelectAvatarOptions } from '../../lib';
import variableOptions from '../variableOptions';
import VariableOptions from 'vue-variable-options';

export default Vue.extend({
	name: 'build',
	components: { VariableOptions },
	data() {
		return {
			src: '',
			options: {} as SelectAvatarOptions,
			variableOptions,
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
