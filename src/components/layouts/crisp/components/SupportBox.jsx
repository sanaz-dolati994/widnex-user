import { SupportBoxWrapper, CloseBtn, SupportBoxBody, CrispNav, BackBtn } from '../utils/Styles'
import { DText, FlexCenter, FlexColumn } from '../../../../styles/CommonStyles'
import Text from '../../../../core/utils/Text'
import { FcOnlineSupport, FcIdea } from 'react-icons/fc'
import { FiChevronLeft } from 'react-icons/fi'
import { useState } from 'react'
import NewUsers from './NewUsers'
import { AnimatePresence } from 'framer-motion'
import { ReactComponent as Header } from '../assets/crisp-head.svg'

const SupportBox = ({ onClose }) => {
	/**
	 * tabs => 0) main - 1) new users - 2) crisp chat
	 */
	const [activeTab, setActiveTab] = useState(0)

	const onCrispNavClicked = (tab) => {
		switch (tab) {
			case 1:
				setActiveTab(tab)
				break
			case 2:
				window.$crisp.push(['do', 'chat:open'])
				setTimeout(() => {
					window.$crisp.push(['do', 'chat:show'])
				}, 500)
				break
			default:
				break
		}
	}

	const onBackClicked = () => setActiveTab(0)

	return (
		<SupportBoxWrapper variants={boxVariants} initial={'out'} exit={'out'} animate={'in'}>
			<Header style={{ position: 'absolute', top: '-40px', zIndex: 10, width: '105%' }} />

			{activeTab !== 0 ? (
				<BackBtn onClick={onBackClicked} size={20} />
			) : (
				<CloseBtn onClick={onClose} size={24} />
			)}
			<SupportBoxBody>
				<FlexColumn style={{ marginBottom: '40px' }}>
					<DText fontSize={'1.1rem'} color={'black'}>
						<Text tid={'dear-user'} />
					</DText>
					<DText fontSize={'0.9rem'} color={'black'}>
						<Text tid={'crisp-desc'} />
					</DText>
				</FlexColumn>
				{navs.map((nav, idx) => (
					<CrispNav onClick={() => onCrispNavClicked(idx + 1)}>
						<FlexCenter>
							<nav.icon size={24} />
							<div style={{ margin: '0 8px' }}>
								<Text tid={nav.text} />
							</div>
						</FlexCenter>
						<FiChevronLeft color={'#00000080'} size={24} />
					</CrispNav>
				))}
				<AnimatePresence exitBeforeEnter>{activeTab === 1 && <NewUsers />}</AnimatePresence>
			</SupportBoxBody>
		</SupportBoxWrapper>
	)
}

const boxVariants = {
	in: {
		y: 0,
		transition: { duration: 0.225, type: 'ease-in-out' },
	},
	out: {
		y: '100%',
		transition: { duration: 0.225 },
	},
}

const navs = [
	{ icon: FcIdea, text: 'new-users' },
	{ icon: FcOnlineSupport, text: 'contact-support' },
]

export default SupportBox
