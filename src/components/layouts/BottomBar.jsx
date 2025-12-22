import styled from 'styled-components'
import { FaWallet, FaExchangeAlt, FaChartLine, FaColumns } from 'react-icons/fa'
import Text from '../../core/utils/Text'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HOME } from '../../core/constants/urls'
import { useMainContext } from '../../core/contexts/main'

const BottomBar = () => {
	const {
		main: { theme, lang },
	} = useMainContext()

	const [active, setActive] = useState(-1)
	const navigate = useNavigate()

	useEffect(() => {
		const pathname = window.location.pathname
		if (pathname.includes('wallets')) {
			setActive(3)
		} else if (pathname.includes('user')) {
			// setActive(0)
		}
	}, [])

	const onTabClicked = (idx) => {
		setActive(idx)

		if (idx === 0) window.location.href = HOME + lang
		else if (idx === 1) window.location.href = HOME + lang + '/market'
		else if (idx === 2) window.location.href = HOME + lang + '/otc2/form'
		else if (idx === 3) navigate('/wallets')
	}

	return (
		<Body>
			<BottomBarWrapper>
				{tabs.map((tab, idx) => (
					<TabItem onClick={() => onTabClicked(idx)}>
						<tab.icon size={18} active={idx === active} />
						<DText color={active === idx && '#4f31c5'}>
							<Text tid={tab.name} />
						</DText>
					</TabItem>
				))}
			</BottomBarWrapper>
		</Body>
	)
}

const DashboardIcon = styled(FaColumns)`
	color: ${(props) => (props.active ? props.theme.mainOrange : props.theme.color)};
`
const MarketsIcon = styled(FaChartLine)`
	color: ${(props) => (props.active ? props.theme.mainOrange : props.theme.color)};
`
const OtcIcon = styled(FaExchangeAlt)`
	color: ${(props) => (props.active ? props.theme.mainOrange : props.theme.color)};
`
const WalletIcon = styled(FaWallet)`
	color: ${(props) => (props.active ? props.theme.mainOrange : props.theme.color)};
`

const tabs = [
	{ name: 'main', icon: DashboardIcon },
	{ name: 'markets', icon: MarketsIcon },
	{ name: 'otc', icon: OtcIcon },
	{ name: 'wallet', icon: WalletIcon },
]

const Body = styled.div`
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 60px;
	direction: ${(props) => (props.theme.english ? 'ltr' : 'rtl')};
	background-color: ${(props) => props.theme.secondaryBg};
	box-shadow: -2px 0 4px ${(props) => props.theme.mainBg};
	padding: 10px 30px;
	z-index: 1001;
`

const BottomBarWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: ${(props) => (props.active ? props.theme.mainOrange : props.theme.color)};
`

const DText = styled.div`
	font-size: 0.8rem;
`

const TabItem = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	height: 40px;
`

export default BottomBar
