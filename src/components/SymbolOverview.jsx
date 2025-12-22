import { useRef } from 'react'
import CardLayout from './layouts/CardLayout'
import { FlexCenter } from '../styles/CommonStyles'
import {
	FaExchangeAlt,
	FaArrowAltCircleUp,
	FaArrowAltCircleDown,
	FaChevronDown,
} from 'react-icons/fa'
import { AnimatePresence } from 'framer-motion'
import useClickOutside from '../core/hooks/useClickOutside'
import {
	variants,
	PriceContainer,
	PriceDesc,
	Price,
	ModalDismissBtn,
	SymbolContainer,
	ChangeBadge,
	Image,
	Dropdown,
	DropdownImage,
	Header,
	DropdownContainer,
	DropdownItem,
	BtnText,
	ButtonContainer,
} from '../styles/SymbolOverviewStyles'
import useSymbolHook from '../core/hooks/useSymbolHook'
import SearchBox from './SearchBox'
import Text from '../core/utils/Text'
import { useNavigate } from 'react-router-dom'
import { useWalletContext } from '../core/contexts/wallet'
import { useMainContext } from '../core/contexts/main'
import { formatNumber } from '../core/utils/common'
import { HOME, SOCKET_URL } from '../core/constants/urls'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../core/constants/common'

const SymbolOverview = () => {
	const { setWallet, setCoin } = useWalletContext()
	const {
		main: { lang },
	} = useMainContext()
	const { width } = useWindowSize()

	const modalRef = useRef()
	const onOutSideClicked = () => {
		onModalStateChange(false)
	}
	useClickOutside(modalRef, onOutSideClicked)

	const [
		coins,
		selectedCoin,
		modalOpen,
		searchValue,
		onModalStateChange,
		onCoinChanged,
		onCloseSearchClicked,
		onInputValueChange,
	] = useSymbolHook()

	const navigate = useNavigate()
	const goToTrade = () => {
		window.location.replace(HOME + `trade/${selectedCoin.coin}_irt`)
	}
	const goToMyWallets = (type) => {
		setWallet(type)
		setCoin(selectedCoin.id)
		navigate('/wallets')
	}

	return (
		<CardLayout
			width={'100%'}
			title=' '
			icon={
				<FaChevronDown
					style={{ cursor: 'pointer' }}
					size={20}
					color='#4f31c5'
					onClick={() => onModalStateChange(true)}
				/>
			}
		>
			<SymbolContainer>
				<Image src={SOCKET_URL + `assets/icon/${selectedCoin?.id}.png`} alt=' ' />
			</SymbolContainer>
			<FlexCenter className={'sm:gap-[15px] gap-0'} style={{ marginTop: '50px' }}>
				<PriceContainer>
					<Price color='#02cb70'>{formatNumber(selectedCoin?.value)}</Price>
					<ChangeBadge
						bgColor={
							selectedCoin?.changes['24h'].changePresent &&
							selectedCoin?.changes['24h'].changePresent < 0
								? '#ce1440'
								: '#1ce087'
						}
					>
						{formatNumber(selectedCoin?.changes['24h'].changePresent)}%
					</ChangeBadge>
				</PriceContainer>

				<PriceContainer>
					<Price>{formatNumber(selectedCoin?.buy)}</Price>
					<PriceDesc>
						<Text tid='buyPrice' />
					</PriceDesc>
				</PriceContainer>

				<PriceContainer lastItem={true}>
					<Price>{formatNumber(selectedCoin?.sell)}</Price>
					<PriceDesc>
						<Text tid='sellPrice' />
					</PriceDesc>
				</PriceContainer>
			</FlexCenter>

			<FlexCenter className={'gap-[15px]'} style={{ marginTop: '40px', paddingBottom: '10px' }}>
				<ButtonContainer
					onClick={() => goToMyWallets({ op: 'deposit', type: 'coin' })}
					color='#1ce087'
					shadow='#1ce087'
				>
					<FaArrowAltCircleUp
						color='#00002d'
						size={width > TABLET_SIZE ? 28 : 20}
						// style={{ margin: width > TABLET_SIZE ? '0 15px' : '0 10px' }}
					/>
					<BtnText>
						<Text tid='deposit' />
					</BtnText>
				</ButtonContainer>
				<ButtonContainer
					onClick={() => goToMyWallets({ op: 'withdraw', type: 'coin' })}
					color='#ce1440'
					shadow='#e9106c'
				>
					<FaArrowAltCircleDown
						color='#00002d'
						size={width > TABLET_SIZE ? 28 : 20}
						// style={{ margin: width > TABLET_SIZE ? '0 15px' : '0 10px' }}
					/>
					<BtnText>
						<Text tid='withdraw' />
					</BtnText>
				</ButtonContainer>
				<ButtonContainer onClick={goToTrade} color='#4f31c5' shadow='#4f31c5'>
					<FaExchangeAlt
						color='#00002d'
						size={width > TABLET_SIZE ? 28 : 20}
						// style={{ margin: width > TABLET_SIZE ? '0 15px' : '0 10px' }}
					/>
					<BtnText>
						<Text tid='trade' />
					</BtnText>
				</ButtonContainer>
			</FlexCenter>
			<AnimatePresence exitBeforeEnter>
				{modalOpen && (
					<>
						<Dropdown ref={modalRef} initial='in' animate='out' exit='in' variants={variants}>
							<ModalDismissBtn onClick={() => onModalStateChange(false)} />
							<SearchBox
								searchValue={searchValue}
								onCloseSearchClicked={onCloseSearchClicked}
								onInputValueChange={onInputValueChange}
							/>
							<DropdownContainer>
								<DropdownItem>
									<Header width={lang === 'en' ? '10%' : '5%'}></Header>
									<Header width='20%'>
										<Text tid='tetherPrice' />
									</Header>
									<Header width='30%'>
										<Text tid='buyPrice' />
									</Header>
									<Header width='30%'>
										<Text tid='sellPrice' />
									</Header>
								</DropdownItem>
								{coins?.map((coin, idx) => (
									<DropdownItem key={coin.id} onClick={() => onCoinChanged(coin)}>
										<DropdownImage
											src={SOCKET_URL + `assets/icon/${coin.id}.png`}
											alt={coin.id.toUpperCase()}
										/>
										<Price width='20%'>{formatNumber(coin.value)}</Price>
										<Price width='30%'>{formatNumber(coin.buy)}</Price>
										<Price width='30%'>{formatNumber(coin.sell)}</Price>
									</DropdownItem>
								))}
							</DropdownContainer>
						</Dropdown>
					</>
				)}
			</AnimatePresence>
		</CardLayout>
	)
}

export default SymbolOverview
