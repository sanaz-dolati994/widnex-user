import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from '..'
import { SOCKET_URL } from '../../../core/constants/urls'
import { formatNumber } from '../../../core/utils/common'
import AddStakingModal from './AddStakingModal'
import Select from '../../global/select/Select'

const CreateStakingStage2 = ({ plans, currency, coins = [], onCurrencyChange }) => {
	const onboard = useMemo(() => {
		let res = []
		if (!!currency && plans?.length) {
			res = plans.filter((p) => p.currency === currency)
		}
		return res
	}, [plans, currency])

	const { t } = useTranslation()
	const [input, setInput] = useState([])
	useEffect(() => {
		setInput(onboard.map((_) => ({ value: '', isError: false, error: '' })))
	}, [onboard])

	const initialAddModal = { show: false, data: null }
	const [addModal, setAddModal] = useState(initialAddModal)
	const openAddModal = (data) => setAddModal({ show: true, data })
	const closeAddModal = () => setAddModal(initialAddModal)

	return (
		<div className='flex flex-col gap-3'>
			<AddStakingModal onClose={closeAddModal} detail={addModal} />

			<div className='flex items-center gap-2 justify-between'>
				<Text
					tid={'active-plans'}
					className={'dark:text-gray-100 font-semibold lg:text-base text-sm'}
				/>
				<Select
					options={coins}
					value={currency}
					onChange={onCurrencyChange}
					singleSelect={true}
					template={(coin) => (
						<div className={'flex gap-2 items-center'}>
							<img
								width='26px'
								height='26px'
								src={
									coin === 'irt'
										? require('../../../assets/images/tooman.png')
										: SOCKET_URL + `assets/icon/${coin}.png`
								}
								alt=' '
							/>
							<span>{coin?.toUpperCase()}</span>
						</div>
					)}
				/>
			</div>

			<div className={'grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-2'}>
				{onboard.map((item, idx) => {
					return (
						<div
							key={item.id}
							className={`
						rounded-md main-border p-3 flex flex-col gap-3
						w-full lg:max-w-[340px]
						`}
						>
							<div
								className={`flex justify-between items-center gap-2 
                						rounded-md px-3 h-[52px] w-full`}
							>
								<div className={'flex items-center gap-2'}>
									<img
										width='36px'
										height='36px'
										src={
											currency === 'irt'
												? require('../../../assets/images/tooman.png')
												: SOCKET_URL + `assets/icon/${currency}.png`
										}
										alt=' '
									/>
									<span className={'mt-1 text-sm'}>{currency?.toUpperCase()}</span>
								</div>

								<div className={'bg-blue-500 bg-opacity-10 text-blue-500 rounded py-1 px-4'}>
									<span className={'text-[0.75rem]'}>
										<span>{item.periodDays}</span>
										<span> </span>
										<Text tid={'days'} />
									</span>
								</div>
							</div>

							<div className={'h-[1px] w-full line-bg'} />

							<div className={'rounded-md staking-card-item flex items-center justify-between p-3'}>
								<Text tid={'income-profit'} className={'text-[0.8rem] dark:text-gray-300'} />
								<span dir={'ltr'} className={' text-green-500'}>{`${item.interestRate} %`}</span>
							</div>

							<div className={'rounded-md flex items-center justify-between p-3'}>
								<Text tid={'stakeMaxAmount'} className={'text-[0.75rem] dark:text-gray-300'} />
								<span dir={'ltr'} className={' text-sm'}>{`${formatNumber(item.maxAmount, {
									type: item.currency,
								})} ${item.currency.toUpperCase()}`}</span>
							</div>

							<div className={'rounded-md flex items-center justify-between p-3 staking-card-item'}>
								<Text tid={'stakeMinAmount'} className={'text-[0.75rem] dark:text-gray-300'} />
								<span dir={'ltr'} className={' text-sm'}>{`${formatNumber(item.minAmount, {
									type: item.currency,
								})} ${item.currency.toUpperCase()}`}</span>
							</div>

							<div
								onClick={() => openAddModal(item)}
								className={`
                  cursor-pointer mt-3 h-[42px] flex items-center justify-center w-full 
                  bg-blue-500 rounded-md text-gray-100 text-sm
                `}
							>
								<Text tid={'staking-details'} />
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default CreateStakingStage2
