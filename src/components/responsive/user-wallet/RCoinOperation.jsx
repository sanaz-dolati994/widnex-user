import { useWalletContext } from '../../../core/contexts/wallet'
import {
	useDepositOperations,
	useFees,
	useWithdrawOperations,
} from '../../../core/hooks/useWalletOperations'
import CardLayout from '../../layouts/CardLayout'
import { AmountInput, CFlexCenter, CFlexStart, FlexCenter } from '../../../styles/CommonStyles'
import { RButton, RText } from '../../../styles/responsive/Common'
import Text from '../../../core/utils/Text'
import {
	AddressBox,
	AddressText,
	CoinNameWrapper,
	CurrentAmount,
	IconWrapper,
	Label,
	NameCoin,
	NetWorkItem,
	NetworkOptionsPopUp,
	NetworkOptionsPopUpContent,
	NetworkOptionsPopUpHint,
	NetworkOptionsWrapper,
	RNetWorkItem,
	RNetworkOptionsWrapper,
	WalletAddressesTabItem,
	WalletAddressesTabsContainer,
	WithdrawInput,
} from '../../../styles/CoinOperationStyles'
import FilterDropdown, { Option } from '../../modals/FilterDropdown'
import { useMarketQuery } from '../../../core/services/react-query/useMarketQuery'
import React, { useEffect, useRef, useState } from 'react'
import { FaQrcode, FaRegCopy, FaShareAlt } from 'react-icons/fa'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'
import useClickOutside from '../../../core/hooks/useClickOutside'
import { SOCKET_URL } from '../../../core/constants/urls'
import RCoinDropdown from '../modals/RCoinDropdown'
import useCoinExtraInfo from '../../../core/hooks/useCoinExtraInfo'
import { _formatNumber } from '../../../core/utils/numbers'
import { FeesContainer } from '../../my-wallets/CoinOperation'
import ChooseBankWalletModal from '../../modals/ChooseBankWalletModal'
import { useAuthContext } from '../../../core/contexts/auth'
import TwoFactorModal from '../../modals/TwoFactorModal'

const RCoinOperation = () => {
	const { wallet, coin, setCoin } = useWalletContext()
	const { data: market } = useMarketQuery()

	const ref = useRef()

	/* deposit stuff */
	const [showNetworkPopUp, setShowNetworkPopUp] = useState(false)
	const [showQrCode, setShowQrCode] = useState(true)
	const [coins, setCoins] = useState([])
	const { coinExtraInfo } = useCoinExtraInfo({ coin })

	const {
		depositList,
		depositData,
		network,
		activeDepositNetwork,
		setActiveNetwork,
		getQrAddress,
		copyToClipboard,
		depositNetworks,
		fees,
	} = useDepositOperations()

	const {
		amount,
		onValueChange,
		wallets,
		setAmount,
		chosenWallet,
		onOptionChanged,
		sendWithdraw,
		onWalletValueChange,
		activeNetwork,
	} = useWithdrawOperations()

	const { profileSettings } = useAuthContext()
	const [authModal, setAuthModal] = useState(false)
	const onSubmitTwoFactorModal = (authData) => {
		sendWithdraw(authData)
	}

	const hasOption = wallets.filter((o) => o.coin === coin)

	const onWithdrawClicked = () => {
		if (profileSettings?.settings?.twoFactor?.onWithdraw) setAuthModal(true)
		else sendWithdraw()
		try {
			ref.current.reset()
		} catch (err) {}
	}

	const walletTabs = [
		{
			label: 'whitelist',
			value: 'whitelist',
			component: ({ wallets, onOptionChanged }) => {
				return (
					<ChooseBankWalletModal
						label={hasOption.length ? 'choose-wallet' : 'no-wallets'}
						options={wallets}
						onOptionChange={onOptionChanged}
						ref={ref}
						type='wallet'
					/>
				)
			},
		},
		{
			label: 'new_address',
			value: 'new_address',
			component: () => {
				return (
					<>
						<AmountInput
							onChange={onWalletValueChange}
							className={'rounded-full'}
							defaultValue={''}
						/>
					</>
				)
			},
		},
	]

	const [activeWalletTab, setActiveWalletTab] = useState(walletTabs[0])

	const ActiveWalletComponent = activeWalletTab.component

	const onCoinsChanged = (idx) => {
		setCoin(coins[idx])
	}

	/* --- */

	const navigate = useNavigate()
	const goToTransactions = () => {
		navigate('/transaction-history')
	}

	useEffect(() => {
		market && setCoins(market.map((m) => m.id))
	}, [market])

	const { feeError } = useFees({ amount, network: activeNetwork })

	const hasError = !amount || !coin || !chosenWallet || !!feeError

	return (
		<CardLayout width='100%' height='100%'>
			<div style={{ padding: '10px' }}>
				{/* title - mutual */}
				<CFlexCenter>
					<RText>
						<Text tid={wallet.op} /> {coin ? coin.toUpperCase() : ''}
					</RText>
				</CFlexCenter>

				{/* logo - deposit */}
				<CFlexCenter>
					{showQrCode && depositData ? (
						<QRCode bgColor='#0f1c2e' fgColor='#c3c5b7' size={80} value={getQrAddress()} />
					) : (
						<>
							{wallet.op === 'deposit' && (
								<img
									src={require('../../../assets/images/deposit-coin.png')}
									alt=' '
									width='100px'
								/>
							)}
						</>
					)}
				</CFlexCenter>

				{/* choose coin - mutual */}
				<CFlexStart>
					<Label>
						<Text tid='chooseCoin' />
					</Label>
					<RCoinDropdown
						coinExtraInfo={coinExtraInfo}
						isCoin={true}
						options={coins}
						defaultOption={coin ? coin : 'choose-coin'}
						width='100%'
						margin='0'
						onOptionChanged={onCoinsChanged}
					/>
				</CFlexStart>

				{!!coin && (
					<>
						{/* choose network - deposit */}
						{!!depositNetworks?.length ? (
							<>
								<Label>
									<Text tid='selectNetwork' />
								</Label>

								<AddressBox onClick={() => setShowNetworkPopUp(true)} className={'justify-center'}>
									<AddressText>{activeDepositNetwork?.network || 'انتخاب'}</AddressText>
								</AddressBox>
							</>
						) : null}

						{wallet.op === 'deposit' ? (
							<>
								<Label>
									<Text tid='getAddress' />
								</Label>
								<AddressBox>
									<AddressText className={'w-full'}>
										<input
											className={'w-full'}
											style={{ background: 'transparent' }}
											readOnly={true}
											value={getQrAddress()}
										/>
									</AddressText>
								</AddressBox>

								<CFlexCenter>
									<IconWrapper>
										<FaRegCopy
											onClick={() => copyToClipboard(navigator)}
											size={14}
											color='#c3c5b7'
											style={{ margin: '0 5px' }}
										/>
										<FaQrcode
											onClick={() => setShowQrCode((state) => !state)}
											size={14}
											color='#c3c5b7'
											style={{ margin: '0 5px' }}
										/>
										<FaShareAlt size={14} color='#c3c5b7' style={{ margin: '0 5px' }} />
									</IconWrapper>
								</CFlexCenter>
								<div className={'text-xs'}>
									<FeesContainer network={activeDepositNetwork} amount={amount} type={'deposit'} />
								</div>
							</>
						) : (
							<>
								<CFlexStart>
									<Label>
										<Text
											tid={wallet?.op === 'deposit' ? 'depositWith' : 'destinationWalletAddress'}
										/>
									</Label>
									{/*<WalletAddressesTabsContainer>*/}
									{/*	{walletTabs.map((item, index) => {*/}
									{/*		const isActive = item.value === activeWalletTab.value*/}

									{/*		return (*/}
									{/*			<WalletAddressesTabItem*/}
									{/*				active={isActive}*/}
									{/*				onClick={() => {*/}
									{/*					return false*/}

									{/*					setActiveWalletTab(item)*/}
									{/*				}}*/}
									{/*				key={index}*/}
									{/*			>*/}
									{/*				<Text tid={item.label} />*/}
									{/*			</WalletAddressesTabItem>*/}
									{/*		)*/}
									{/*	})}*/}
									{/*</WalletAddressesTabsContainer>*/}

									<ChooseBankWalletModal
										label={hasOption.length ? 'choose-wallet' : 'no-wallets'}
										options={wallets}
										onOptionChange={onOptionChanged}
										ref={ref}
										type='wallet'
									/>
								</CFlexStart>
								<CFlexStart>
									<Label className={'flex items-center justify-between w-full'}>
										<Text tid='amount' />

										<CurrentAmount
											onClick={() => {
												setAmount(coinExtraInfo?.value)
											}}
										>
											<Text tid='max' />: {_formatNumber(coinExtraInfo?.value)}
										</CurrentAmount>
									</Label>
									<AddressBox className={'rounded-full p-0'}>
										<AmountInput
											borderRadius={'0 100px 100px 0 !important'}
											className={'rounded-full'}
											value={amount}
											onChange={onValueChange}
										/>
										{coinExtraInfo?.id && (
											<CoinNameWrapper className={'w-auto px-3'}>
												<FlexCenter className={'flex-nowrap'}>
													<img
														width='24px'
														height='24px'
														src={SOCKET_URL + `assets/icon/${coinExtraInfo?.id?.toLowerCase()}.png`}
														alt={`${coinExtraInfo?.id?.toLowerCase()}.png`}
													/>{' '}
													<NameCoin>{coinExtraInfo?.id?.toUpperCase()}</NameCoin>
												</FlexCenter>
											</CoinNameWrapper>
										)}
									</AddressBox>
								</CFlexStart>
								<div className={'text-xs'}>
									<FeesContainer network={activeNetwork} amount={amount} />
								</div>

								<CFlexCenter>
									<RButton active={!hasError} width='80%' onClick={onWithdrawClicked}>
										<Text tid='withdraw' />
									</RButton>
								</CFlexCenter>
							</>
						)}
					</>
				)}

				{/* visit transactions - mutual */}
				<CFlexCenter>
					<RText
						onClick={goToTransactions}
						color='#4f31c5'
						style={{ textDecoration: 'underline', margin: '10px 0' }}
					>
						<Text tid='see-transaction-history' />
					</RText>
				</CFlexCenter>
			</div>

			{showNetworkPopUp && (
				<NetworkSelectPopUp
					networks={depositNetworks}
					network={network}
					activeNetwork={activeDepositNetwork}
					setActiveNetwork={setActiveNetwork}
					depositList={depositList}
					setShowNetworkPopUp={setShowNetworkPopUp}
				/>
			)}

			<TwoFactorModal
				open={authModal}
				onSubmit={onSubmitTwoFactorModal}
				onClose={() => setAuthModal(false)}
				cause={'withdraw'}
			/>
		</CardLayout>
	)
}

const NetworkSelectPopUp = ({
	networks,
	network,
	activeNetwork,
	setActiveNetwork,
	depositList,
	setShowNetworkPopUp,
}) => {
	const ref = useRef()

	useClickOutside(ref, () => {
		setShowNetworkPopUp?.(false)
	})

	return (
		<NetworkOptionsPopUp>
			<NetworkOptionsPopUpContent ref={ref} className={''}>
				<h6 className={'block w-full text text-center mb-4'}>انتخاب شبکه</h6>
				<NetworkOptionsPopUpHint className={'mb-4'}>
					توجه! در حین انجام عملیات واریز و برداشت، برای امنیت دارایی هایتان لطفا از یکسان بودن شبکه
					کیف‌پول مبدا و مقصد اطمینان حاصل کنید
				</NetworkOptionsPopUpHint>
				<RNetworkOptionsWrapper>
					{networks?.map((net, idx) => (
						<RNetWorkItem
							key={idx}
							onClick={() => {
								setActiveNetwork?.(net)
								setShowNetworkPopUp?.(false)
							}}
							active={activeNetwork && activeNetwork.network === net.network}
						>
							{net.network}
						</RNetWorkItem>
					))}
				</RNetworkOptionsWrapper>
			</NetworkOptionsPopUpContent>
		</NetworkOptionsPopUp>
	)
}

export default RCoinOperation
