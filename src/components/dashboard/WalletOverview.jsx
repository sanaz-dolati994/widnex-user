import Text from '../../core/utils/Text'
import { useState } from 'react'
import { formatNumber } from '../../core/utils/common'
import { useWalletPLData, useWalletRealTimeData } from '../newWallet/useWalletData'
import ModalLayout from '../layouts/ModalLayout'
import { ReactComponent as FiatAsset } from '../../pages/wallet/assets/withdraw.svg'
import { ReactComponent as CoinAsset } from '../../pages/wallet/assets/deposit.svg'
import { Link } from 'react-router-dom'
import { Heading } from '../../styles/newStyles/Dashboard.styled'

export default function WalletOverview({ className, fullHeight = false }) {
	const currencyTabs = ['tooman', 'usdt']
	const [currencyTab, setCurrencyTab] = useState('tooman')
	const type = currencyTab === 'tooman' ? 'irt' : 'usdt'

	const { myBalance } = useWalletRealTimeData()

	const { userChange } = useWalletPLData()

	const initialChooseModal = { type: null, open: false }
	const [chooseModal, setChooseModal] = useState(initialChooseModal)
	const openModal = (type) => setChooseModal({ type, open: true })
	const closeModal = () => setChooseModal(initialChooseModal)

	return (
		<>
			<div
				className={`rounded-md bg-cBlue dark:border border-pColor text-white p-4 ${className} ${
					fullHeight ? 'flex flex-col justify-items-stretch h-full' : ''
				}`}
			>
				<Heading>
					<h2 className='font-semibold'>
						<Text tid='your-balances-value' />
					</h2>

					<div className={'flex items-center w-28 rounded-md bg-white/10 p-1'}>
						{currencyTabs.map((tab) => {
							const active = currencyTab === tab
							return (
								<div
									key={tab}
									className={`text-center w-1/2 rounded-lg ${
										active && 'bg-gray-light text-cBlue'
									} cursor-pointer`}
									onClick={() => setCurrencyTab(tab)}
								>
									<Text tid={tab} className={'text-xs'} />
								</div>
							)
						})}
					</div>
				</Heading>

				<div className={'mt-3'}>
					<div className={'flex items-center gap-1'}>
						<span className={'text-lg lg:text-3xl font-bold'}>
							{formatNumber(myBalance[currencyTab], { type })}
						</span>
						<Text
							className={'text-xs text-white/60'}
							tid={currencyTab === 'tooman' ? 'tooman' : 'usdt'}
						/>
					</div>
				</div>

				<div className={`flex items-center gap-x-4 mt-3`}>
					<div
						className={
							'w-14 h-8 rounded-xl bg-white text-xs text-black flex items-center justify-center'
						}
					>
						<span className='' dir='ltr'>
							{userChange.pc}%
						</span>
						{/* <span className='text-sm'>{userChange.pc >= 0 ? '+' : '-'}</span> */}
					</div>
					<Text tid='daily-balance-change' className='text-sm text-white/90' />
				</div>

				<div
					className={`${
						!fullHeight ? 'mx-auto' : 'lg:mt-auto'
					} mt-5 flex items-center justify-center gap-5`}
				>
					<div
						className={
							'w-1/2 flex items-center justify-center gap-x-1 py-2 rounded-lg bg-white cursor-pointer text-cBlue'
						}
						onClick={() => openModal('deposit')}
					>
						<span className='text-lg font-bold h-6'>+</span>
						<Text tid={'deposit'} />
					</div>
					<div
						className={
							'w-1/2 flex items-center justify-center gap-x-1 py-2 rounded-lg cursor-pointer border border-borderPrimary'
						}
						onClick={() => openModal('withdraw')}
					>
						<span className='text-lg font-bold h-6'>-</span>
						<Text tid={'withdraw'} />
					</div>
				</div>
			</div>
			<ModalLayout width={'480px'} onClose={closeModal} open={chooseModal.open}>
				<div className={'flex flex-col gap-4'}>
					<Link to={`/wallets/${chooseModal.type}?tab=coin`}>
						<div
							className={
								'flex items-center gap-8 w-full hover:bg-slate-800 hover:text-white rounded-md px-3 cursor-pointer'
							}
						>
							<CoinAsset width={114} height={114} />
							<div className={'flex flex-col gap-2'}>
								<Text tid={`${chooseModal.type}-coin`} className={'lg:text-base text-sm'} />
								<Text tid={`${chooseModal.type}-coin-desc`} className={'text-xs'} />
							</div>
						</div>
					</Link>
					<div className={'w-full h-[1px] bg-gray-500 opacity-50'} />
					<Link to={`/wallets/${chooseModal.type}?tab=fiat`}>
						<div
							className={
								'flex items-center gap-8 w-full hover:bg-slate-800 hover:text-white rounded-md px-3 cursor-pointer'
							}
						>
							<FiatAsset width={114} height={114} />
							<div className={'flex flex-col gap-2'}>
								<Text tid={`${chooseModal.type}-fiat`} className={'lg:text-base text-sm'} />
								<Text tid={`${chooseModal.type}-fiat-desc`} className={'text-xs'} />
							</div>
						</div>
					</Link>
				</div>
			</ModalLayout>
		</>
	)
}
