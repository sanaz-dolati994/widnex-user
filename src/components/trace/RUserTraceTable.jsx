import CardLayout from '../layouts/CardLayout'
import { useMainContext } from '../../core/contexts/main'
import { useTraceData } from './useTraceData'
import React, { useMemo, useState } from 'react'
import Pagination from 'react-js-pagination'
import { ScaleLoader } from 'react-spinners'
import { SOCKET_URL } from '../../core/constants/urls'
import { formatDate, formatNumber } from '../../core/utils/common'
import { FaLongArrowAltLeft, FaSearch } from 'react-icons/fa'
import Text from '../../core/utils/Text'
import { IoSearchSharp } from 'react-icons/io5'
import { ItemData, ItemRow } from '../../styles/newStyles/MobileModal.styled'
import { BiChevronDown } from 'react-icons/bi'

const RUserTraceTable = () => {
	const {
		main: { theme, lang },
	} = useMainContext()

	const initialDetailState = { show: false, id: null }
	const [details, setDetails] = useState(initialDetailState)

	const { filterQueries, traces, isFetching, onPageChange, searchId, setSearchId, onSearchById } =
		useTraceData()

	const totalPages = useMemo(() => {
		return traces?.meta?.total || 0
	}, [traces])

	const toggleDetails = (id) => {
		if (details.show && details.id === id) setDetails(initialDetailState)
		else setDetails({ show: true, id: id })
	}

	return (
		<div className='min-h-[420px]'>
			<div className='mx-5'>
				<form
					className='bg-primary dark:bg-white/10 relative flex items-center w-full px-4 py-2 rounded-lg'
					onSubmit={(e) => {
						e.preventDefault()
						onSearchById()
					}}
				>
					<input
						type='text'
						className='block w-4/5 bg-transparent placeholder:text-sm'
						placeholder={'جستجو...'}
						value={searchId}
						onChange={(e) => setSearchId(e?.target?.value)}
					/>
					<FaSearch className='w-1/5 text-black/20 dark:text-pColor' />
				</form>
			</div>
			<div className={'w-full mt-2 relative'}>
				{isFetching && (
					<div
						className={
							'z-[1002] bg-[#ffffff50] dark:bg-[#00000030] min-h-[300px] rounded w-full h-full absolute left-0 top-0 flex items-center justify-center'
						}
					>
						<ScaleLoader color='#0773F1' height='24px' width='2px' />
					</div>
				)}

				{traces?.data?.map((item) => {
					const diffBalance = item.balanceNew - item.balance
					const diffBlock = item.balanceBlockedNew - item.balanceBlocked
					let diffBalanceColor = 'gray-400'
					if (diffBalance > 0) diffBalanceColor = 'green-600'
					if (diffBalance < 0) diffBalanceColor = 'red-600'
					let diffBlockColor = 'gray-400'
					if (diffBlock > 0) diffBlockColor = 'green-600'
					if (diffBlock < 0) diffBlockColor = 'red-600'

					let typeColor = 'text-gray-500'
					if (item.type === 'INCREASE') typeColor = 'text-[#00A478]'
					if (item.type === 'DECREASE') typeColor = 'text-red-500'

					return (
						<div
							className={'text-xs border-b border-borderPrimary dark:border-card-border'}
							key={item._id}
						>
							<div
								className='flex items-center py-4 mx-5'
								onClick={toggleDetails.bind(null, item._id)}
							>
								<div className={'flex items-center gap-2 text-sm'}>
									<img
										width='28px'
										height='28px'
										src={
											item.currency === 'irt'
												? require('../../assets/images/tooman.png')
												: SOCKET_URL + `assets/icon/${item.currency}.png`
										}
										alt=' '
									/>
									<span>{item.currency?.toUpperCase()}</span>
								</div>
								<div className='mr-auto ml-4'>
									<span className={`text-sm ${typeColor}`}>
										{formatNumber(item.volume, { type: item.currency })}
									</span>
								</div>
								<BiChevronDown
									size={22}
									className={`transition-transform duration-300 ${
										details.id === item._id ? 'transform rotate-180' : ''
									}`}
								/>
							</div>

							{details.show && details.id === item._id ? (
								<div className='w-[90%] mx-auto'>
									<ItemRow>
										<Text tid={'balanceChange'} className={'text-xs text-pcolor-light'} />

										<div className={'flex items-center justify-center gap-x-2 text-xs'}>
											<span>{formatNumber(item.balance, { type: item.currency })}</span>
											<FaLongArrowAltLeft
												size={18}
												className={`text-${diffBalanceColor} ${lang === 'en' && 'rotate-180'}`}
											/>
											<span>{formatNumber(item.balanceNew, { type: item.currency })}</span>
										</div>
									</ItemRow>

									<ItemRow>
										<Text tid={'balanceBlockChange'} className={'text-xs text-pcolor-light'} />
										<div className={'flex items-center justify-center gap-x-2 text-xs'}>
											<span>{formatNumber(item.balanceBlocked, { type: item.currency })}</span>
											<FaLongArrowAltLeft
												size={18}
												className={`text-${diffBlockColor} ${lang === 'en' && 'rotate-180'}`}
											/>
											<span>{formatNumber(item.balanceBlockedNew, { type: item.currency })}</span>
										</div>
									</ItemRow>

									<ItemRow>
										<Text tid={'type'} className={'text-xs text-pcolor-light'} />
										<div className={typeColor}>
											<Text tid={item.type} className={'text-xs'} />
										</div>
									</ItemRow>

									<ItemRow>
										<Text tid={'cause'} className={'text-xs text-pcolor-light'} />
										<div
											className={
												'text-xs w-max dark:bg-gray-800 bg-gray-300 rounded-md py-1 px-2 min-w-[82px] flex justify-center items-center'
											}
										>
											<Text tid={item.cause?.label} />
										</div>
									</ItemRow>

									<ItemRow>
										<Text tid='date' className={'text-xs text-pcolor-light'} />
										<div className={'flex gap-x-2'}>
											<span>
												{formatDate(item.createdAt, 'time', lang, {
													hour: '2-digit',
													minute: '2-digit',
												})}
											</span>
											<span>{formatDate(item.createdAt, 'date', lang)}</span>
										</div>
									</ItemRow>
								</div>
							) : null}
						</div>
					)
				})}
			</div>

			{traces?.data?.length && totalPages ? (
				<div className={'flex justify-center mt-1'}>
					<Pagination
						activePage={filterQueries.page}
						itemsCountPerPage={10}
						totalItemsCount={totalPages}
						pageRangeDisplayed={3}
						onChange={(p) => onPageChange(p)}
						itemClass={theme === 'light' ? 'd-page-item' : 'page-item'}
						linkClass={theme === 'light' ? 'd-page-link' : 'page-link'}
					/>
				</div>
			) : null}
			{traces?.data?.length === 0 && !isFetching && (
				<div className={'min-h-[200px] w-full flex items-center justify-center'}>
					<img alt=' ' src={require('../../assets/images/noData.png')} />
				</div>
			)}
		</div>
	)
}

export default RUserTraceTable
