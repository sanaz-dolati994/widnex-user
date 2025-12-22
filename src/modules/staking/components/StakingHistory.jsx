import { useState } from 'react'
import { formatNumber, getMainTheme, Text, useMainContext, useWindowSize } from '..'
import Select from '../../global/select/Select'
import { useGetUserStakings } from '../core/services'
import { SOCKET_URL } from '../../../core/constants/urls'
import { ClipLoader } from 'react-spinners'
import { FaChevronDown } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { ReactComponent as Svg } from '../../../assets/images/receipt-search.svg'

const StakingHistory = () => {
	const {
		main: { lang },
	} = useMainContext()
	const { width } = useWindowSize()
	const [status, setStatus] = useState('')
	const options = ['CREATED', 'FINISHED', 'EARLY_FINISHED']

	const { data: stakings, isLoading } = useGetUserStakings({
		search: { status: 'status' },
		query: { status },
	})

	return (
		<div className={'main-border card-bg rounded-md p-5 min-h-[400px]'}>
			<div className={'flex items-center justify-between'}>
				<Text tid={'staking-history'} className={'lg:text-base text-sm'} />
				<Select
					placeholder={'select-status'}
					options={options}
					value={status}
					onChange={setStatus}
					prefix={'status-'}
				/>
			</div>

			<div className={'w-full relative mt-3'}>
				{isLoading ? (
					<div
						className={
							'absolute left-0 top-0 h-[200px] w-full flex items-center justify-center backdrop-blur'
						}
					>
						<ClipLoader color={getMainTheme().active} size={20} />
					</div>
				) : null}
				{stakings?.length ? (
					width > 1024 ? (
						<Desktop stakings={stakings} lang={lang} />
					) : (
						<Mobile stakings={stakings} lang={lang} />
					)
				) : (
					<div className={'min-h-[164px] w-full flex items-center justify-center flex-col gap-1'}>
						<Svg width={72} />
						<Text tid={'no-staking-yet'} className={'text-xs text-slate-500'} />
					</div>
				)}
			</div>
		</div>
	)
}

const Desktop = ({ stakings, lang }) => {
	return (
		<>
			{stakings?.map((item, idx) => {
				return (
					<div
						key={item._id}
						className={`grid grid-cols-6 items-center dark:test-slate-100 text-sm font-semibold gap-2 
									${idx % 2 ? '' : 'dark:bg-[#ffffff05] bg-[#00000010]'} py-3 px-5 rounded-md
									`}
					>
						<div className={'flex items-center gap-2'}>
							<img
								src={
									item.currency === 'irt'
										? require('../../../assets/images/tooman.png')
										: SOCKET_URL + `assets/icon/${item?.currency?.toLowerCase()}.png`
								}
								alt={item.currency}
								width={32}
								height={32}
							/>
							<span>{item.currency.toUpperCase()}</span>
						</div>

						<div className={'flex flex-col gap-2'}>
							<Text tid={'stake-type'} className={'text-gray-500 text-2xs'} />
							<div
								className={
									'py-1 px-3 text-xs rounded-md bg-blue-500 text-blue-500 bg-opacity-10 w-max'
								}
							>
								<span>
									<span>{item.periodDays}</span>
									<span> </span>
									<Text tid={'days'} />
								</span>
							</div>
						</div>

						<div className={'flex flex-col gap-2'}>
							<Text tid={'stake-amount'} className={'text-gray-500 text-2xs'} />
							<span>{formatNumber(item.amount, { type: item.currency })}</span>
						</div>

						<div className={'flex flex-col gap-2'}>
							<Text tid={'status'} className={'text-gray-500 text-2xs'} />
							<Text
								tid={`status-${item.status}`}
								className={`${item.status === 'CREATED' ? 'text-green-500' : ''}`}
							/>
						</div>

						<div className={'flex flex-col gap-2 w-max'}>
							<Text tid={'stake-date'} className={'text-gray-500 text-2xs'} />
							<span dir={'ltr'}>
								{`${new Date(item.createdAt).toLocaleString(lang === 'fa' ? 'fa-IR' : 'en-US')}`}
							</span>
						</div>

						<div className={'flex flex-col gap-2'}>
							<Text tid={'stake-operation'} className={'text-gray-500 text-2xs'} />

							<Link to={`/staking/${item._id}`}>
								<Text tid={'profit-detail'} className={'cursor-pointer text-blue-500 text-xs'} />
							</Link>
						</div>
					</div>
				)
			})}
		</>
	)
}

const Mobile = ({ stakings, lang }) => {
	const [open, setOpen] = useState(-1)

	return (
		<div className={'flex flex-col gap-2'}>
			{stakings?.map((item, idx) => {
				return (
					<div
						className={`
							rounded-md text-xs cursor-pointer
							dark:bg-[#ffffff05] bg-[#00000010] p-3
									`}
						onClick={() =>
							setOpen((state) => {
								if (state === idx) return -1
								else return idx
							})
						}
					>
						<div className={'grid grid-cols-6  items-center '}>
							<div className={'flex items-center gap-2 col-span-3'}>
								<img
									src={
										item.currency === 'irt'
											? require('../../../assets/images/tooman.png')
											: SOCKET_URL + `assets/icon/${item?.currency?.toLowerCase()}.png`
									}
									alt={item.currency}
									width={30}
									height={30}
								/>
								<span>{item.currency.toUpperCase()}</span>
							</div>
							<div>
								<Text
									tid={`status-${item.status}`}
									className={`${item.status === 'CREATED' ? 'text-green-500' : ''}`}
								/>
							</div>
							<div
								className={
									'py-1 px-3 text-xs rounded-md bg-blue-500 text-blue-500 bg-opacity-10 w-max'
								}
							>
								<span>
									<span>{item.periodDays}</span>
									<span> </span>
									<Text tid={'days'} />
								</span>
							</div>
							<div className={'flex justify-end text-slate-500'}>
								<FaChevronDown
									size={15}
									className={`${open === idx ? 'rotate-180' : 'rotate-0'} transition`}
								/>
							</div>
						</div>

						{open === idx ? (
							<div className={'grid grid-cols-2 items-center gap-y-3 mt-3'}>
								<Text tid={'stake-amount'} className={'text-slate-500 text-2xs'} />
								<div className={'flex justify-end'}>
									<span>{formatNumber(item.amount, { type: item.currency })}</span>
								</div>

								<Text tid={'stake-date'} className={'text-slate-500 text-2xs'} />
								<div className={'flex justify-end'}>
									<span dir={'ltr'}>
										{`${new Date(item.createdAt).toLocaleString(
											lang === 'fa' ? 'fa-IR' : 'en-US'
										)}`}
									</span>
								</div>

								<Text tid={'stake-operation'} className={'text-slate-500 text-2xs'} />
								<Link to={`/staking/${item._id}`}>
									<div className={'flex justify-end'}>
										<Text
											tid={'profit-detail'}
											className={'cursor-pointer underline text-blue-500 text-xs'}
										/>
									</div>
								</Link>
							</div>
						) : null}
					</div>
				)
			})}
		</div>
	)
}

export default StakingHistory
