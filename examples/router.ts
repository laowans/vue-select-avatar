import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter);

export default new VueRouter({
	routes: [
		{
			path: '/',
			redirect: '/test',
		},
		{
			path: '/test',
			component: () => import('./components/test.vue'),
		},
		{
			path: '/build',
			component: () => import('./components/build.vue'),
		},
	],
});
