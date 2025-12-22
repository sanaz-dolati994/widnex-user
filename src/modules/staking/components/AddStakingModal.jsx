import { useMemo, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { Text, formatNumber, useWindowSize } from '..'
import { SOCKET_URL } from '../../../core/constants/urls'
import { IoAdd, IoClose } from 'react-icons/io5'
import { deepCopy, stringToNumber } from '../../../core/utils/common'
import { Link } from 'react-router-dom'
import { useRunAfterUpdate } from '../../../core/hooks/useRunAfterUpdate'
import { onInputValueChangeUtil } from '../../../core/utils/useInputValueChange'
import { useProfileQuery } from '../../../core/services/react-query/useProfileQuery'
import { IoIosInformationCircleOutline } from 'react-icons/io'
import { FaCheck } from 'react-icons/fa'
import { useQueryContext } from '../../../core/contexts/query'
import { useCreateStake } from '../core/services'
import { TABLET_SIZE } from '../../../core/constants/common'
import MobileModal from '../../../components/modals/MobileModal'

const AddStakingModal = ({ detail, onClose }) => {
	const { width } = useWindowSize()
	const curr = detail.data

	const { data: profile } = useProfileQuery()
	const balance = useMemo(() => {
		if (profile?.coins?.length && !!curr) {
			const coin = profile.coins?.find((x) => x.coin === curr?.currency)
			if (!!coin) return coin.amount
		}

		return 0
	}, [profile, detail])

	const runAfterUpdate = useRunAfterUpdate()

	const [rules, setRules] = useState(false)
	const [amount, setAmount] = useState({ value: '', isError: false, error: '' })
	const onInputChange = (e, isNumber = false) => {
		const newAmount = deepCopy(amount)
		if (!isNumber) newAmount.value = onInputValueChangeUtil(e, runAfterUpdate)
		else newAmount.value = e

		const minAmount = curr?.minAmount
		const maxAmount = curr?.maxAmount
		const amt = stringToNumber(newAmount.value)

		if (amt < minAmount) {
			newAmount.isError = true
			newAmount.error = 'min-amount-error'
		}
		if (maxAmount) {
			if (amt > maxAmount) {
				newAmount.isError = true
				newAmount.error = 'max-amount-error'
			}
		}

		if (amt >= minAmount && amt <= maxAmount) {
			newAmount.isError = false
			newAmount.error = ''
		}

		setAmount(newAmount)
	}

	const onInputOptionsClick = (item) => {
		switch (item) {
			case 'max-amount':
				onInputChange(curr?.maxAmount, true)
				break
			case 'min-amount':
				onInputChange(curr?.minAmount, true)
				break
			case '۷۵٪':
				onInputChange((curr?.maxAmount * 75) / 100, true)
				break
			case '۵۰٪':
				onInputChange((curr?.maxAmount * 50) / 100, true)
				break
			case '۲۵٪':
				onInputChange((curr?.maxAmount * 25) / 100, true)
				break
			default:
				break
		}
	}

	const { mutate: createStake, isLoading: createStakeLoading } = useCreateStake(onClose)

	const onSubmit = () => {
		createStake({
			planId: curr.id,
			amount: parseFloat(amount.value),
		})
	}

	const { setToast } = useQueryContext()
	const onOpenStake = () => {
		if (createStakeLoading) return
		if (!rules) {
			setToast({
				message: 'please-accept-widnex-rules',
				isError: true,
				show: true,
			})
			return
		}
		if (!amount.value) {
			setToast({
				message: 'please-enter-valid-amount',
				isError: true,
				show: true,
			})
			return
		}
		if (amount.isError) {
			setToast({
				message: amount.error,
				isError: true,
				show: true,
			})
			return
		}
		onSubmit()
	}

	if (!detail.show) return <></>
	if (width > TABLET_SIZE) {
		return (
			<div
				className={
					'w-screen h-screen left-0 top-0 z-[1000003] fixed backdrop-blur flex items-center justify-center px-2'
				}
			>
				<div
					className={
						'lg:w-[520px] w-full rounded-md dark:bg-dStakingModal bg-white dark:bg-dark p-6 main-border text-sm'
					}
				>
					<BaseComp
						detail={detail}
						onInputChange={onInputChange}
						onClose={onClose}
						amount={amount}
						createStakeLoading={createStakeLoading}
						onOpenStake={onOpenStake}
						rules={rules}
						setRules={setRules}
						balance={balance}
						onInputOptionsClick={onInputOptionsClick}
					/>
				</div>
			</div>
		)
	} else {
		return (
			<MobileModal isOpen onClose={onClose}>
				<BaseComp
					detail={detail}
					onInputChange={onInputChange}
					onClose={onClose}
					amount={amount}
					createStakeLoading={createStakeLoading}
					onOpenStake={onOpenStake}
					rules={rules}
					setRules={setRules}
					balance={balance}
					onInputOptionsClick={onInputOptionsClick}
				/>
			</MobileModal>
		)
	}
}

const BaseComp = ({
	detail,
	onClose,
	amount,
	onInputChange,
	createStakeLoading,
	onOpenStake,
	rules,
	setRules,
	balance,
	onInputOptionsClick,
}) => {
	const curr = detail.data
	const { width } = useWindowSize()

	return (
		<>
			<div className={'flex items-center justify-between'}>
				<div className={'flex items-center gap-2'}>
					<Text tid={'staking-details'} />
					<div className={'bg-slate-500 bg-opacity-20 h-[24px] w-[2px]'} />
					<img
						width='26px'
						height='26px'
						src={
							curr?.currency === 'irt'
								? require('../../../assets/images/tooman.png')
								: SOCKET_URL + `assets/icon/${curr?.currency}.png`
						}
						alt=' '
					/>
					<span>{curr?.currency?.toUpperCase()}</span>
				</div>
				{width > 1024 ? (
					<div className={'cursor-pointer'} onClick={onClose}>
						<IoClose size={22} />
					</div>
				) : null}
			</div>

			<div className={'flex items-center justify-between mt-5'}>
				<Text tid={'amount'} className={'lg:text-sm text-xs'} />
				<Link to={'/wallets/deposit?tab=coin'}>
					<div className={'text-blue-500 flex items-center text-xs'}>
						<IoAdd size={16} />
						<Text tid={'add-balance'} />
					</div>
				</Link>
			</div>

			<div className={'main-border w-full h-[46px] rounded-md mt-1 flex'}>
				<input
					className={'w-[80%] h-full bg-transparent px-5'}
					value={amount.value}
					onChange={onInputChange}
					placeholder={`${curr?.minAmount} - ${curr?.maxAmount} ${curr?.currency?.toUpperCase()}`}
				/>
				<div
					className={
						'w-[20%] dark:bg-card-border bg-slate-200 rounded-l-md h-full flex-center gap-1'
					}
				>
					<img
						width='24px'
						height='24px'
						src={
							curr?.currency === 'irt'
								? require('../../../assets/images/tooman.png')
								: SOCKET_URL + `assets/icon/${curr?.currency}.png`
						}
						alt=' '
					/>
					<span className={'text-xs'}>{curr?.currency?.toUpperCase()}</span>
				</div>
			</div>

			{amount.isError ? (
				<div className={'mt-1'}>
					<Text tid={amount.error} className={'text-xs text-red-500'} />
				</div>
			) : null}

			<div className={'mt-2 flex lg:items-center lg:flex-row flex-col gap-2 lg:justify-between'}>
				<div className={'flex items-center gap-2'}>
					{['max-amount', '۷۵٪', '۵۰٪', '۲۵٪', 'min-amount'].map((item) => {
						return (
							<div
								key={item}
								onClick={() => onInputOptionsClick(item)}
								className={
									'p-1 rounded-md main-border text-[0.65rem] text-slate-500 cursor-pointer'
								}
							>
								<Text tid={item} />
							</div>
						)
					})}
				</div>
				<div className={'flex items-center gap-1'}>
					<div className={'text-blue-500'}>
						<IoIosInformationCircleOutline size={16} />
					</div>
					<Text tid={'all-your-balance'} className={'text-slate-500 text-xs'} />
					<span className={'lg:text-sm text-xs'} dir={'ltr'}>
						{balance}
					</span>
					<span className={'text-slate-500 text-xs'}>{curr?.currency?.toUpperCase()}</span>
				</div>
			</div>

			<div className={'flex items-center gap-1 mt-6 text-blue-500 text-xs'}>
				<IoIosInformationCircleOutline size={16} />
				<Text tid={'staking-detail-note'} />
			</div>

			<div className={'h-[1px] line-bg w-full my-5'}></div>

			<div
				className={
					'active-hover-bg rounded-md p-3 flex items-center text-xs lg:text-sm justify-between'
				}
			>
				<Text tid={'plan-state'} />
				<Text tid={'active'} className={'text-green-500'} />
			</div>

			<div className={'rounded-md p-3 flex items-center justify-between text-xs lg:text-sm '}>
				<Text tid={'stakeMaxAmount'} />
				<span dir={'ltr'} className={' text-sm'}>{`${formatNumber(curr.maxAmount, {
					type: curr.currency,
				})} ${curr.currency.toUpperCase()}`}</span>
			</div>

			<div
				className={
					'active-hover-bg rounded-md p-3 flex items-center justify-between text-xs lg:text-sm '
				}
			>
				<Text tid={'stakeMinAmount'} />
				<span dir={'ltr'} className={' text-sm'}>{`${formatNumber(curr?.minAmount, {
					type: curr.currency,
				})} ${curr.currency.toUpperCase()}`}</span>
			</div>

			<div className={'rounded-md p-3 flex items-center justify-between text-sm'}>
				<Text tid={'stake-profite'} />
				<span dir={'ltr'} className={' text-green-500'}>{`${curr?.interestRate} %`}</span>
			</div>

			<div className={'h-[1px] line-bg w-full my-2'}></div>
			<div className={'flex items-center gap-1 mt-3 lg:text-sm text-xs'}>
				<div
					onClick={() => setRules((state) => !state)}
					className={`cursor-pointer rounded-[50%] w-[22px] 
						h-[22px] flex-center ${rules ? 'bg-blue-500' : 'active-hover-bg'}
						`}
				>
					{rules ? <FaCheck size={15} /> : null}
				</div>
				<a href={'https://widnex.datest.ir/terms'}>
					<Text tid={'terms'} className={'text-blue-500'} />
				</a>
				<Text tid={'accept-widnex-rules'} />
			</div>

			<div
				onClick={onOpenStake}
				className={`
                  cursor-pointer mt-5 h-[42px] flex items-center justify-center w-full 
                  bg-blue-500 rounded-md text-gray-200 text-sm
                `}
			>
				{createStakeLoading ? <ClipLoader size={24} /> : <Text tid={'start-staking'} />}
			</div>
		</>
	)
}

export default AddStakingModal
