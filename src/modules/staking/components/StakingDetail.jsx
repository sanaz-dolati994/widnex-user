import { formatNumber, Text, useMainContext, useWindowSize } from '..'
import { useGetUserStake } from '../core/services'
import { useMemo, useState } from 'react'
import NewLayout from '../../../components/layouts/NewLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { ReactComponent as Svg } from '../../../assets/images/receipt-search.svg'
import { SOCKET_URL } from '../../../core/constants/urls'
import { FaArrowRight } from 'react-icons/fa'

const DetailsModal = () => {
	const { width } = useWindowSize()
	const params = useParams()
	const {
		main: { lang },
	} = useMainContext()
	const { data: stake } = useGetUserStake(params?.id)
	console.log({ stake })

	const [pair, setPair] = useState('irt')

	const profitPc = useMemo(() => {
		if (!!stake) {
			return ((stake.settlementsPaid || 0) / stake.settlements) * 100 || 5
		}
		return 0
	}, [stake])

	const pcTilNow = useMemo(() => {
		if (!!stake) {
			if (stake.amountPaid > 0) {
				return (stake.amountPaid / stake.amount) * 100
			}
		}
		return 0
	}, [stake])

	const daysLeft = useMemo(() => {
		if (!!stake) {
			const created = new Date(stake.createdAt).getTime()
			const now = new Date().getTime()
			const daysPassed = parseInt((now - created) / 1000 / 60 / 60 / 24)
			return stake.periodDays - daysPassed
		}
		return 0
	}, [stake])

	const navigate = useNavigate()
	const onBack = () => {
		navigate(-1)
	}

	return (
		<NewLayout>
			{width < 1024 ? (
				<div className={'px-5 pt-5 dark:bg-dark flex items-center gap-3 text-sm'}>
					<div onClick={onBack} className='cursor-pointer'>
						<FaArrowRight size={17} />
					</div>
					<span>گنجینه سرمایه</span>
				</div>
			) : null}
			<div className={'flex flex-col gap-5 max-w-[1200px]'}>
				<div className={'grid grid-cols-1 lg:grid-cols-2 gap-5 lg:mt-0 mt-5'}>
					<div
						className={`bg-[#4FCB6A] overflow-hidden p-6 relative 
							text-white flex flex-col justify-between h-[200px] lg:w-full w-[95%] mx-auto lg:mx-0 rounded-xl border-[1px] border-white`}
					>
						<div className='absolute left-[-120px] bottom-[-320px] w-[400px] h-[400px] rounded-[50%] bg-[#ffffff10]'></div>
						<div className='absolute left-[-90px] bottom-[-300px] w-[400px] h-[400px] rounded-[50%] bg-[#ffffff10]'></div>
						<div className='absolute left-[-60px] bottom-[-280px] w-[400px] h-[400px] rounded-[50%] bg-[#ffffff10]'></div>
						<div className={'flex items-center justify-between'}>
							<Text tid={'your-total-profit'} />
							<div
								className={
									'w-[118px] h-[28px] rounded-lg flex bg-opacity-10 bg-white cursor-pointer'
								}
							>
								{['irt', 'usdt'].map((x) => {
									const active = pair === x
									return (
										<div
											onClick={() => setPair(x)}
											key={x}
											className={`
										${active ? 'bg-white text-slate-800' : 'dark:text-slate-100'} w-[50%]
										rounded-lg flex-center h-full text-[0.8rem] transition
									`}
										>
											<Text tid={x} />
										</div>
									)
								})}
							</div>
						</div>

						<div className={'flex flex-col'}>
							<span>
								<span className={'text-2xl'}>{stake?.amountPaid}</span>
								<span> </span>
								<Text tid={pair} className={'text-gray-300 text-xs'} />
							</span>
							<div className={'flex items-center gap-2 text-xs'}>
								<div className={'bg-white p-1 rounded-md text-slate-800'}>
									<span dir={'ltr'}>
										{pcTilNow > 0 ? '+' : ''} {pcTilNow} %
									</span>
								</div>
								<Text tid={'profit-till-now'} />
							</div>
						</div>
					</div>

					<div
						className={
							'card-bg main-border p-6 h-[200px] rounded-xl text-sm flex flex-col justify-between lg:w-full w-[95%] mx-auto lg:mx-0 '
						}
					>
						<div className={'flex lg:items-center justify-between'}>
							<div className={'flex flex-col gap-1 max-w-[200px] lg:max-w-[320px]'}>
								<Text tid={'stake-profit-process'} />
								<Text
									tid={'stake-profit-process-note'}
									className={'text-slate-500 text-[0.65rem] lg:text-xs'}
								/>
							</div>
							<span>
								<span className={'text-lg lg:text-4xl'}>{daysLeft}</span>
								<span> </span>
								<Text className={'text-base lg:text-2xl'} tid={'day'} />
								<span> </span>
								<Text tid={'days-left'} className={'text-2xs text-slate-500'} />
							</span>
						</div>

						<div className={'flex items-center gap-1 mt-4'}>
							{Array.from(Array(stake?.settlements || 0).keys()).map((item, idx) => {
								const getOpacity = (idx) => {
									const eachOne = 100 / stake?.settlements
									const curr = idx * eachOne
									const op = curr - (curr % 10)
									return op
								}
								return (
									<div key={item} className={'w-full flex flex-col gap-1'}>
										<div
											className={`w-full h-[16px] rounded-md bg-[#00A478]`}
											style={{
												width: `${100 / stake.settlements}%`,
												opacity: `${getOpacity(idx + 1)}%`,
											}}
										></div>
										<span className={'text-xs'}>
											<span>{(idx + 1) * 30}</span>
											<span> </span>
											<Text tid={'day'} />
										</span>
										<div>
											<span dir={'ltr'} className={'text-xs text-green-500'}>
												<span>
													{formatNumber(stake?.amount / stake?.settlements, {
														type: stake?.currency,
													})}
												</span>
												<span> </span>
												<span> {stake?.currency?.toUpperCase()}</span>
											</span>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>

				<div className={'card-bg main-border lg:rounded-md p-5'}>
					<Text tid={'income-profit'} />
					<div className={'flex items-center justify-between gap-3 mt-5'}>
						{['currency-name', 'profit-gained', 'date-hour'].map((t) => {
							return (
								<div className={'text-slate-500 text-xs'} key={t}>
									<Text tid={t} />
								</div>
							)
						})}
					</div>
					<div className={'h-[1px] line-bg w-full my-2'} />

					{stake?.history?.length ? (
						stake?.history.map((h) => {
							return (
								<div
									key={h.at}
									className={'flex items-center justify-between gap-3 py-3 lg:text-sm text-xs'}
								>
									<div className={'flex items-center gap-2'}>
										<img
											src={
												h.currency === 'irt'
													? require('../../../assets/images/tooman.png')
													: SOCKET_URL + `assets/icon/${h?.currency?.toLowerCase()}.png`
											}
											alt={h.currency}
											width={28}
											height={28}
										/>
										<span>{h.currency.toUpperCase()}</span>
									</div>
									<span className={'text-green-500'}>{h.amount}</span>
									<span dir={'ltr'}>
										{new Date(h.at).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')}
									</span>
								</div>
							)
						})
					) : (
						<div className={'min-h-[164px] w-full flex items-center justify-center flex-col gap-1'}>
							<Svg width={72} />
							<Text tid={'no-profit-yet'} className={'text-xs text-slate-500'} />
						</div>
					)}
				</div>
			</div>
		</NewLayout>
	)
}

export default DetailsModal
