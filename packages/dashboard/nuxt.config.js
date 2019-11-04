const { ConfigParser } = require('@codes/config');

const parser = new ConfigParser();
parser.init();
const config = parser.config;

module.exports = {
	mode: 'spa',
	head: {
		title: config.dashboard.brand,
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: 'Codes website for multipurpose functions' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
		]
	},
	server: {
		port: config.dashboard.port,
		host: config.dashboard.host
	},
	srcDir: `src`,
	loading: { color: '#00f' },
	modules: [
		// Doc: https://bootstrap-vue.js.org
		'bootstrap-vue/nuxt',
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios'
	],
	/*
	** Axios module configuration
	** See https://axios.nuxtjs.org/options
	*/
	axios: {
		baseURL: '/',
		progress: true
	},
};
