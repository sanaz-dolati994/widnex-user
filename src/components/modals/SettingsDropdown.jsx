import { forwardRef, useState } from 'react'
import {
	DropBody,
	SettingWrapper,
	SettingItem,
	UpCaret,
	DownCaret,
	SettingSub,
	SettingCheckBox,
} from '../../styles/layout-styles/HeaderStyles'
import Text from '../../core/utils/Text'
import { useMainContext } from '../../core/contexts/main'
import { Flex } from '../../styles/CommonStyles'

const SettingsDropdown = forwardRef((props, ref) => {
	const {
		main: { lang, setLang, theme, setTheme },
	} = useMainContext()

	const [themeOpen, setThemeOpen] = useState(false)
	const [langOpen, setLangOpen] = useState(false)

	const onThemeChange = (item) => {
		setTheme(item)
	}

	const onLangChange = (item) => {
		setLang(item === 'english' ? 'en' : 'fa')
	}

	return (
		<DropBody ref={ref} minWidth='120px'>
			<SettingWrapper active={themeOpen} onClick={() => setThemeOpen((state) => !state)}>
				<SettingItem>
					<Text tid='theme' />
				</SettingItem>
				{themeOpen ? <UpCaret size={18} /> : <DownCaret size={18} />}
			</SettingWrapper>
			{themeOpen &&
				themes.map((item) => (
					<SettingSub style={{ margin: '4px 8px' }} onClick={() => onThemeChange(item)}>
						<Flex style={{ alignItems: 'center' }}>
							<SettingCheckBox active={theme === item} />
							<Text tid={item} />
						</Flex>
					</SettingSub>
				))}
			<SettingWrapper active={langOpen} onClick={() => setLangOpen((state) => !state)}>
				<SettingItem>
					<Text tid='lang' />
				</SettingItem>
				{langOpen ? <UpCaret size={18} /> : <DownCaret size={18} />}
			</SettingWrapper>
			{langOpen &&
				langs.map((item) => (
					<SettingSub style={{ margin: '4px 8px' }} onClick={() => onLangChange(item)}>
						<Flex style={{ alignItems: 'center' }}>
							<SettingCheckBox
								active={
									(item === 'english' && lang === 'en') || (item === 'persian' && lang === 'fa')
								}
							/>
							<Text tid={item} />
						</Flex>
					</SettingSub>
				))}
		</DropBody>
	)
})

const langs = ['english', 'persian']
const themes = ['dark', 'light']

export default SettingsDropdown
