import { Grid, traceCs, traceHeaders, useTraceData } from './useTraceData'
import Pagination from 'react-js-pagination'
import React, { useMemo } from 'react'
import { useMainContext } from '../../core/contexts/main'
import Text from '../../core/utils/Text'
import { SOCKET_URL } from '../../core/constants/urls'
import { formatDate, formatNumber } from '../../core/utils/common'
import { FaLongArrowAltLeft, FaSearch } from 'react-icons/fa'
import { ScaleLoader } from 'react-spinners'
import { Heading } from '../../styles/newStyles/Dashboard.styled'
import { PaginationContainer } from '../../styles/CommonStyles'

const UserTraceTable = () => {
	const {
		main: { theme, lang },
	} = useMainContext()

	const { filterQueries, traces, isFetching, onPageChange, searchId, setSearchId, onSearchById } =
		useTraceData()

	const totalPages = useMemo(() => {
		return traces?.meta?.total || 0
	}, [traces])

	return (
		<div className='min-h-[520px] relative'>
			<Heading className='mb-8 px-5'>
				<h2 className='text-heading dark:text-gray-light font-bold'>
					<Text tid='accounts-list' />
				</h2>

				<form
					className='bg-primary dark:bg-white/10 relative flex items-center w-60 px-4 py-2 rounded-lg'
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
			</Heading>

			<Grid
				cs={traceCs}
				className={'border-b border-borderPrimary dark:border-card-border py-1 px-5'}
			>
				{traceHeaders.map((head, idx) => {
					return (
						<div key={head} className={idx > 1 ? 'flex justify-center' : ''}>
							<Text tid={head} className={'text-sm text-pcolor-light'} />
						</div>
					)
				})}
			</Grid>

			<div className={'relative'}>
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

					let typeColor = 'dark:text-gray-500 text-gray-400'
					if (item.type === 'INCREASE') typeColor = 'text-[#00A478]'
					if (item.type === 'DECREASE') typeColor = 'text-red-500'

					return (
						<Grid
							cs={traceCs}
							key={item._id}
							className={
								'px-5 py-4 hover:bg-gray-200 dark:hover:bg-primaryBg border-b last:border-b-0 border-borderPrimary dark:border-card-border font-medium'
							}
						>
							<div className={'flex items-center gap-2'}>
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
							<span className={'text-sm'}>
								{formatNumber(item.volume, { type: item.currency })}
							</span>
							<div className={'flex items-center justify-center gap-2 text-sm'}>
								<span>{formatNumber(item.balance, { type: item.currency })}</span>
								<FaLongArrowAltLeft
									size={18}
									className={`text-${diffBalanceColor} ${lang === 'en' && 'rotate-180'}`}
								/>
								<span>{formatNumber(item.balanceNew, { type: item.currency })}</span>
							</div>
							<div className={'flex items-center justify-center gap-2 text-sm'}>
								<span>{formatNumber(item.balanceBlocked, { type: item.currency })}</span>
								<FaLongArrowAltLeft
									size={18}
									className={`text-${diffBlockColor} ${lang === 'en' && 'rotate-180'}`}
								/>
								<span>{formatNumber(item.balanceBlockedNew, { type: item.currency })}</span>
							</div>
							<div
								className={`rounded-md mx-auto w-max min-w-[82px] flex justify-center items-center py-1 px-2 ${typeColor} `}
							>
								<Text tid={item.type} className={'text-sm'} />
							</div>
							<div
								className={
									'text-sm mx-auto dark:bg-gray-800 bg-gray-300 rounded-md py-1 px-2 min-w-[82px] flex justify-center items-center'
								}
							>
								<Text tid={item.cause?.label} />
							</div>
							<div className={'mx-auto text-sm font-medium flex gap-x-2'}>
								<span>
									{formatDate(item.createdAt, 'time', lang, { hour: '2-digit', minute: '2-digit' })}
								</span>
								<span>{formatDate(item.createdAt, 'date', lang)}</span>
							</div>
						</Grid>
					)
				})}
			</div>

			{traces?.data?.length && totalPages ? (
				<div className={'flex justify-center'}>
					<PaginationContainer className='bg-white dark:bg-dark pt-2'>
						<Pagination
							activePage={filterQueries.page}
							itemsCountPerPage={10}
							totalItemsCount={totalPages}
							pageRangeDisplayed={3}
							onChange={(p) => onPageChange(p)}
							itemClass={theme === 'light' ? 'd-page-item' : 'page-item'}
							linkClass={theme === 'light' ? 'd-page-link' : 'page-link'}
						/>
					</PaginationContainer>
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

export default UserTraceTable
