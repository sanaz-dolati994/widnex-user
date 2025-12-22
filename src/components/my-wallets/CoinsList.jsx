import { useEffect, useState } from 'react'
import CardLayout from '../layouts/CardLayout'
import { FlexCenter } from '../../styles/CommonStyles'
import {
	BtnText,
	SearchInput,
	CloseSearchIcon,
	SearchIcon,
	SearchBar,
	SearchContainer,
	TabContainer,
	TabContent,
	CoinWrapper,
	CoinRow,
	CoinName,
	PortLogo,
	BanksWrapper,
} from '../../styles/CoinOperationStyles'
import { ButtonContainer } from '../../styles/SymbolOverviewStyles'
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from 'react-icons/fa'
import { useWalletContext } from '../../core/contexts/wallet'
import { useMarketQuery } from '../../core/services/react-query/useMarketQuery'
import Text from '../../core/utils/Text'
import { useMainContext } from '../../core/contexts/main'
import { SOCKET_URL } from '../../core/constants/urls'
import { formatNumber } from '../../core/utils/common'
import { useBankPortContext } from '../../core/contexts/bankPort'
import useAvailableBanks from '../../core/hooks/useAvailableBanks'

const CoinsList = () => {
	const { wallet, coin, setWallet, setCoin } = useWalletContext()
	const {
		main: { lang },
	} = useMainContext()
	const { port, setPort } = useBankPortContext()

	const { data: market } = useMarketQuery()
	const { availableBanks } = useAvailableBanks()

	const [searchValue, setSearchValue] = useState('')
	const [coins, setCoins] = useState([])

	useEffect(() => {
		setCoins(market)
	}, [market])

	const onInputValueChange = (e) => {
		const val = e?.target?.value
		setSearchValue(val)

		if (val.length) {
			const filtered = coins.filter((c) => c.fa.includes(val) || c.name.toLowerCase().includes(val))
			setCoins(filtered)
		} else {
			setCoins(market)
		}
	}

	const onCloseSearchClicked = () => {
		setSearchValue('')
		setCoins(market)
	}

	// types: coin , tooman
	const changeTab = (type) => {
		if (type === 'tooman') {
			setCoin(null)
		}
		if (wallet.type !== type) {
			setWallet((state) => ({ ...state, type }))
		}
	}

	// operations: deposit, withdraw
	const onSelectedType = (op) => {
		if (wallet.op !== op) {
			setWallet((state) => ({ ...state, op }))
		}
	}

	return (
		<CardLayout width='30%' title='myWallets'>
			<FlexCenter className={'gap-3'} style={{ width: '100%' }}>
				<ButtonContainer
					height='38px'
					onClick={() => onSelectedType('deposit')}
					color={`${wallet.op === 'deposit' ? '#1ce087' : '#c3c5b7'}`}
				>
					<FaArrowAltCircleUp color='#00002d' size={25} style={{ margin: '0 10px' }} />
					<BtnText>
						<Text tid='deposit' />
					</BtnText>
				</ButtonContainer>
				<ButtonContainer
					height='38px'
					onClick={() => onSelectedType('withdraw')}
					color={`${wallet.op === 'withdraw' ? '#ce1440' : '#c3c5b7'}`}
				>
					<FaArrowAltCircleDown color='#00002d' size={25} style={{ margin: '0 10px' }} />
					<BtnText>
						<Text tid='withdraw' />
					</BtnText>
				</ButtonContainer>
			</FlexCenter>
			<SearchBar>
				<SearchContainer>
					<SearchInput
						placeholder={lang === 'en' ? 'Search' : 'جست و جو رمزارز ...'}
						value={searchValue}
						onChange={onInputValueChange}
						disabled={wallet.type === 'tooman'}
					/>
					{searchValue !== '' ? <CloseSearchIcon onClick={onCloseSearchClicked} /> : <SearchIcon />}
				</SearchContainer>
			</SearchBar>
			<TabContainer>
				<TabContent isActive={wallet.type === 'coin'} onClick={() => changeTab('coin')}>
					<Text tid={wallet.op === 'deposit' ? 'depositCoin' : 'withdrawCoin'} />
				</TabContent>
				<TabContent isActive={wallet.type === 'tooman'} onClick={() => changeTab('tooman')}>
					<Text tid={wallet.op === 'deposit' ? 'depositIrt' : 'withdrawIrt'} />
				</TabContent>
			</TabContainer>
			<CoinWrapper>
				{wallet.type === 'coin' &&
					coins?.map((item) => (
						<CoinRow active={coin === item.coin} onClick={() => setCoin(item.coin)}>
							<img
								width='32px'
								height='32px'
								src={SOCKET_URL + `assets/icon/${item?.coin?.toLowerCase()}.png`}
								alt={`${item.coin?.toLowerCase()}.png`}
							/>
							<CoinName>{lang === 'en' ? item.name : item.fa}</CoinName>
							<CoinName number>{formatNumber(item.buy)}</CoinName>
						</CoinRow>
					))}
				{wallet.op === 'deposit' && wallet.type === 'tooman' && (
					<BanksWrapper>
						{availableBanks?.data?.banks?.map((bankGate) => {
							if (!bankGate.isActive) {
								return null
							}
							return (
								<PortLogo active={port === bankGate.id} onClick={() => setPort(bankGate.id)}>
									{bankLogos[bankGate.id] && (
										<img src={bankLogos[bankGate.id]} alt=' ' width='75%' />
									)}
								</PortLogo>
							)
						})}
					</BanksWrapper>
				)}
			</CoinWrapper>
		</CardLayout>
	)
}

const bankLogos = {
	zibal: require('../../assets/images/zibal-logo.png'),
	nextPay: require('../../assets/images/nextpay-logo.png'),
	vandar: require('../../assets/images/vandar-logo.png'),
	payStar: require('../../assets/images/payStar.png'),
}

export default CoinsList
