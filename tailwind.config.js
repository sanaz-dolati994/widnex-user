module.exports = {
	important: true,
	darkMode: 'class',
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontSize: {
				'2xs': '0.675rem'
			},
			colors: {
				primaryBg: '#0d1726',
				secondaryBg: '#0f1c2e',
				active: '#4f31c5',
				// primary: '#0d1726',

				black: '#000',
				'black-hover': '#101010',

				white: '#fff',
				'white-hover': '#dadada',
				'white-overlay': '#ececec',

				'dark-secondary': '#182333',
				'dark-secondary-hover': '#182333',

				'light-overlay': 'rgba(0,0,0,0.5)',
				'dark-overlay': 'rgba(255,255,255,0.2)',

				'light-hover': 'rgba(0,0,0,0.1)',
				'dark-hover': 'rgba(255,255,255,0.1)',

				'otc-dark': '#1e293b',
				'otc-light': '#d1d5db',

				info: '#1a4bff',
				'info-hover': '#1a4bff',

				// new themes
				body: '#F4F6F8',
				'body-dark': '#0F131E',

				pColor: '#D9D9D9',
				'pcolor-light': '#A6A9B9',
				primary: '#F4F6F8',
				'gray-light': '#E6F1FE',
				input: '#e6f1fe',
				borderPrimary: '#E5E7EB',
				'gray-secondary': '#EFF3F8',
				cBlue: '#0773F1',
				sidebar: '#151B2B',
				header: '#EFF3F8',
				dark: '#151B2B',
				'card-border': '#172B46',
				'light-border': '#E7EBF0',
				heading: '#2E3344',
				warn: '#F7931A',
				'warnBg-dark': '#30261A',
				warnBg: '#FFF1E1',
				'hintBg-dark': '#202438',
			},
		},
	},
	plugins: [],
}
