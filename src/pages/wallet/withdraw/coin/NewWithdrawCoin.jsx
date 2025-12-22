import { Link } from 'react-router-dom'
import { useMainContext } from '../../../../core/contexts/main'
import { useWindowSize } from '../../../../core/hooks/useWindowSize'
import { useWithdrawCoin } from '../../utils/hooks'
import Text from '../../../../core/utils/Text'
import Select from '../../utils/Select'
import Input from '../../utils/Input'
import { formatNumber } from '../../../../core/utils/common'
import ChooseAccount from '../../utils/ChooseAccount'
import { TABLET_SIZE } from '../../../../core/constants/common'
import FeeContainer from '../../utils/FeeContainer'
import { ClipLoader } from 'react-spinners'
import TwoFactorModal from '../../../../components/modals/TwoFactorModal'
import HintBox from '../../../../components/common/HintBox'
import ModalLayout from '../../../../components/layouts/ModalLayout'
import { useEffect, useState } from 'react'

export default function NewWithdrawCoin() {
	const { width } = useWindowSize()
	const {
		main: { lang },
	} = useMainContext()
	const {
		availableCoins,
		coin,
		setCoin,
		amount,
		setAmount,
		wallet,
		setWallet,
		network,
		validAction,
		networks,
		showError,
		onSubmitTwoFactorModal,
		onWithdrawClicked,
		authModal,
		setAuthModal,
		loading,
		balance,
		setShowAddWallet,
		showAddWallet,
		setNetwork, walletNetwork, addWalletIsValid, address, setAddress, label, setLabel, showAddWalletError, addWalletIsLoading
	} = useWithdrawCoin()
	const [hintModal, setHintModal] = useState(false)
	const onCloseHintModal = () => setHintModal(false)


	const mappedNetworks = networks.length === 0 ? networks : networks.map(option => {
		if (option.network === 'eth') return { ...option, network: 'erc20' }
		if (option.network === 'trx') return { ...option, network: 'trc20' }
		if (option.network === 'bsc') return { ...option, network: 'bep20' }
		return option
	})

	useEffect(() => { setHintModal(true) }, [])


	return (
		<div className='flex flex-col lg:flex-row gap-x-4 py-4'>
			<div className='w-full lg:w-1/2'>
				<div className={'flex flex-col gap-5 mx-auto'}>
					<div className={'flex flex-col gap-1'}>
						<Text tid={'coin'} className={'text-sm text-secondary mx-1'} />
						<Select
							options={availableCoins?.data || []}
							value={coin}
							onChange={setCoin}
							dropdownClass={'min-h-[164px]'}
							placeholder={'coinFilter'}
							className={'w-full h-[42px] flex items-center'}
							isCoin
						/>
						{showError && validAction.type === 'coin' && (
							<Text tid={validAction.error} className={'text-red-500 text-xs mt-1'} />
						)}
					</div>
					<div className={'flex flex-col gap-1'}>
						<Text tid={'amount'} className={'text-sm text-secondary mx-1'} />
						<Input
							value={amount}
							onChange={setAmount}
							placeholder={lang === 'fa' ? 'مقدار را وارد کنید' : 'please enter amount'}
							hasError={showError && validAction.type === 'amount'}
							error={validAction.error}
							number
						/>
						{!!coin ? (
							<div className={'flex items-center gap-1 text-xs mt-1'} onClick={() => { setAmount(formatNumber(balance)) }}>
								<Text tid={'balance-can-withdraw'} />
								<span>{formatNumber(balance || 0, { type: coin.id })}</span>
								<span>{coin.id?.toUpperCase()}</span>
							</div>
						) : null}
					</div>
					{width < TABLET_SIZE ? (
						<div className={'flex flex-col items-center'}>
							<div className={`flex-col flex items-center gap-2 w-full`}>
								<ChooseAccount
									type={'wallet'}
									coin={coin}
									label={'choose-wallet'}
									value={wallet}
									onOptionChange={setWallet}
								/>
								<button onClick={() => {
									setShowAddWallet(prev => !prev)
									setWallet(null)
								}} className={`w-full flex items-center justify-center rounded-lg border-[1px] border-main border-opacity-20 px-4 py-3 cursor-pointer hover:border-active ${showAddWallet ? 'focus-within:border-active' : ''}`}>
									<Text tid={'add-wallet-account'} className={'text-xs text-secondary'} />
								</button>
							</div>
							{showError && validAction.type === 'wallet' && (
								<Text tid={validAction.error} className={'text-red-500 text-xs mt-1'} />
							)}
						</div>
					) : null}
					<div className={''}>
						<FeeContainer
							flow={'withdraw'}
							network={network}
							amount={amount}
							coin={coin}
							type={'wallet'}
						/>
					</div>
				</div>
				{width > TABLET_SIZE ? (
					<div className={'flex flex-col items-center mx-auto mt-4'}>
						<div className={`${wallet ? 'flex-col' : 'flex-row'} flex items-center gap-2 w-full`}>
							<ChooseAccount
								type={'wallet'}
								coin={coin}
								label={'choose-wallet'}
								value={wallet}
								onOptionChange={setWallet}
							/>
							<button onClick={() => {
								setShowAddWallet(prev => !prev)
								setWallet(null)
							}} className={`w-full flex items-center justify-center rounded-lg border-[1px] border-main border-opacity-20 px-4 py-3 cursor-pointer hover:border-active ${showAddWallet ? 'focus-within:border-active' : ''}`}>
								<Text tid={'add-wallet-account'} className={'text-xs text-secondary'} />
							</button>
						</div>
						{showError && validAction.type === 'wallet' && (
							<Text tid={validAction.error} className={'text-red-500 text-xs mt-1'} />
						)}
					</div>
				) : null}

				<div className={`${showAddWallet ? 'block' : 'hidden'} w-full mt-4`}>
					<div className={'w-full flex flex-col gap-5 text-sm'}>
						<div className={'flex flex-col gap-1'}>
							<Text tid={'network'} className={'text-sm text-secondary mx-1'} />
							<Select
								value={walletNetwork}
								options={mappedNetworks}
								onChange={setNetwork}
								className={'w-full h-[42px] flex items-center'}
								dropdownClass={'min-h-[164px]'}
								placeholder={'select-network'}
								selector={'network'}
							/>
							{(showAddWalletError && addWalletIsValid.type === 'network') ?
								<Text tid={'network-is-required'} className={'text-red-500 text-xs'} />
								: null}
						</div>
						<div className={'flex flex-col gap-1'}>
							<Text tid={'wallet-address'} />
							<Input
								value={address}
								onChange={setAddress}
								className={'w-full h-[42px]'}
								placeholder={lang === 'fa' ? 'آدرس کیف پول را وارد کنید.' : 'Wallet Address'}
								hasError={addWalletIsValid.type === 'address' && showAddWalletError}
								error={'address-is-required'}
							/>
						</div>
						<div className={'flex flex-col gap-1'}>
							<Text tid={'label'} />
							<Input
								value={label}
								onChange={setLabel}
								className={'w-full h-[42px]'}
								placeholder={lang === 'fa' ? 'لطفا نام دلخواه را وارد نمایید' : 'label'}
								hasError={addWalletIsValid.type === 'label' && showAddWalletError}
								error={'label-is-required'}
							/>
						</div>
					</div>
				</div>

				<div
					className={`rounded-lg flex items-center justify-center mx-auto shadow-md mt-8 h-[42px] ${validAction.valid
						? 'bg-cBlue text-white'
						: 'dark:bg-gray-800 bg-gray-400  text-secondary'
						} cursor-pointer ${loading || addWalletIsLoading ? 'brightness-50' : ''} hover:brightness-110 transition`}
					onClick={onWithdrawClicked}
				>
					{loading || addWalletIsLoading ? <ClipLoader size={24} color={'#000'} /> : <Text tid={'withdraw'} />}
				</div>
			</div>

			<div className='w-full lg:w-1/2 mt-6 lg:mt-0 space-y-2'>
				<HintBox type='warn' heading='warn' body='withdraw-hint' />
				<HintBox type='warn' heading='warn' body='deposit-to-unauthorized-people-warn' />
				<HintBox type='warn' heading='warn' body='deposit-other-coin-warn' />
				<HintBox type='warn' heading='warn' body='persian-restrict-exchanges-warn' />
				<HintBox type='info' heading='info' body='cancel-withdraw-hint2' />
			</div>
			<TwoFactorModal
				open={authModal}
				onSubmit={onSubmitTwoFactorModal}
				onClose={() => setAuthModal(false)}
				cause={'withdraw'}
			/>
			<ModalLayout open={hintModal} width={"520px"} onClose={onCloseHintModal}>
				<div className='flex flex-col gap-3'>
					<HintBox type='warn' heading='warn' body='withdraw-hint' className='!bg-none' />
					<button onClick={onCloseHintModal} className='w-full py-2 px-3 bg-cBlue rounded-lg'>
						<Text tid={'confirm'} />
					</button>
				</div>
			</ModalLayout>
		</div>
	)
}
