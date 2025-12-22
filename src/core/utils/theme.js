/**
 *
 * @param {string} theme
 * @param {string} lang
 * @return {Object}
 */

export const MainTheme = {
	dark: {
		mainBg: '#0d1726',
		secondaryBg: '#0f1c2e',
		primaryBg: '#0d1726',
		color: '#c3c5b7',
		secondary: '#eaecef',
		primary: 'white',
		hover: '#26282b70',
		active: '#4f31c5',
		exitRed: '#a12356',
		mainOrange: '#0773F1',
		mainRed: '#ff6666',
		mainGreen: '#1ce087',
		search: '#0d1726',
		input: '#2a2d35',
		textArea: '#44464c',
		dropdown: '#36383C',
		black: '#000000',
		tInputBg: '#2a2d35',
		profileTitle: '#4f31c5',
		headerBg: '#0C1B36',
		textColor: '#fafafa',
		main: '#4f31c5',
		tradeBg: '#0f1c2e',
		otcInput: '#0e111a',
		mChart: '#131722',
		orderHover: '#5e6673',
		inActive: '#72747830',
		kayaHover: '#ffffff10',
		colorHeaderIconHover: '#FFFFFF19',
		headerShadow: '#00000029',
		settingBg: 'rgb(43, 49, 57)',
		notification: '#ffc800',
		inputBorder: '#172B46',
		fieldBg: 'rgba(255, 255, 255, 0.05)',
		horizontalLine: '#00000020',
		wizardIconBg: '#172B46',
		contrastBorder: '#EFF3F8',
		sliderBg: "#E6F1FE",
		g1: '#485563',
		g2: '#29323c',
		portalTarget: '#ffffff80'
	},
	light: {
		mainBg: '#ffffff',
		secondaryBg: '#ffffff',
		primaryBg: '#ececec',
		color: '#0d1726',
		secondary: '#595e67',
		primary: '#595e67',
		hover: '#fafafa70',
		active: '#4f31c5',
		exitRed: '#a12356',
		mainOrange: '#0773F1',
		mainGreen: '#008e47',
		mainRed: '#d54a61',
		search: '#f0f1f2',
		input: '#ececec',
		textArea: '#f0f1f2',
		dropdown: '#f0f1f2',
		tradeBg: '#ffffff',
		otcInput: '#f0f1f2',
		black: '#000000',
		orderHover: '#5e6673',
		tInputBg: '#f0f1f2',
		profileTitle: '#50514c',
		headerBg: '#0a146e',
		headerShadow: '#ccc',
		textColor: '#061222',
		main: '#1099f9',
		mChart: 'wheat',
		inActive: '#72747830',
		kayaHover: '#00000010',
		colorHeaderIconHover: '#00000019',
		settingBg: '#fafafa',
		notification: '#ffc800',
		inputBorder: '#E7EBF0',
		fieldBg: '#EFF3F8',
		horizontalLine: '#00000020',
		wizardIconBg: '#E6F1FE',
		sliderBg: "#172B46",
		g1: '#d7dde8',
		g2: '#ffffff',
		portalTarget: '#00000060'
	},
}

const getMainTheme = (theme = 'dark', lang = 'en') => {
	const chosenTheme = { ...MainTheme[theme] }
	chosenTheme.english = lang === 'en'
	return chosenTheme
}

export { getMainTheme }
