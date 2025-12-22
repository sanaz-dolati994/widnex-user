import React, { useEffect } from 'react'
import { useState } from 'react'
import { FaHistory } from 'react-icons/fa'
import Pagination from 'react-js-pagination'
import FilterDropdown from '../modals/FilterDropdown'
import SearchBox from '../SearchBox'
import { filters, TYPES } from '../../core/utils/filter'
import useSearchApi from '../../core/hooks/useSearchApi'
import { Flex, FlexCenter, PaginationContainer, SubmitSearch } from '../../styles/CommonStyles'
import { HeaderColumn, HeaderRow, NoDataWrapper } from '../../styles/TableStyle'
import Text from '../../core/utils/Text'
import { useMainContext } from '../../core/contexts/main'
import AuthLoading from '../authentication/AuthLoading'
import { AnimatePresence } from 'framer-motion'
import { TableWrapper } from '../../styles/OrdersStyle'
import { variants } from '../../core/utils/common'
import { ScaleLoader } from 'react-spinners'
import { useMarketQuery } from '../../core/services/react-query/useMarketQuery'
import RefetchTimer from '../transactions/RefetchTimer'

const FilterLayout = ({
	children,
	state,
	headers,
	refetch = () => { },
	data,
	loading,
	totalPages,
	hasDateOptions = true,
	hasSearchOption,
	hasCoinOption,
	hasTradeOptions,
	hasStatusOptions,
	hasTypeOptions,
	hasFlowOptions,
	hasTabbar,
	tabbar,
	activeTab = -1,
	isCurrency,
	noDataTop
} = {}) => {
	const {
		main: { theme },
	} = useMainContext()

	const [searchValue, setSearchValue] = useState('')
	const { data: market } = useMarketQuery()

	const { filterQueries } = state
	let newState = { ...state, searchValue }
	const [onCloseSearchClicked, onPageChange, requestOrdersByMarket, onOptionChanged] = useSearchApi(
		activeTab,
		newState
	)

	const onEnterToggled = (e) => {
		if (e.keyCode === 13) {
			requestOrdersByMarket(searchValue)
		}
	}

	const onCloseSearchClick = () => {
		setSearchValue('')
		onCloseSearchClicked()
	}

	return (
		<>
			<Flex
				wrap
				align={'center'}
				justify={'start'}
				className={'w-full gap-3 p-4'}
			// style={{ margin: '0 20px' }}
			>
				{hasTabbar && tabbar}
				{hasSearchOption && (
					<Flex align={'center'}>
						<SearchBox
							onKeyDown={onEnterToggled}
							searchValue={searchValue}
							bgColor={theme === 'dark' ? '#3f4243' : '#B7B8B9'}
							onInputValueChange={(e) => setSearchValue(e?.target?.value)}
							onCloseSearchClicked={onCloseSearchClick}
						/>
						{searchValue && <SubmitSearch onClick={() => requestOrdersByMarket(searchValue)} />}
					</Flex>
				)}

				<Flex wrap={true} align={'center'} className={'gap-0'}>
					{hasCoinOption && (
						<FilterDropdown
							options={market}
							defaultOption='coinFilter'
							onOptionChanged={(idx) => onOptionChanged(idx, isCurrency ? TYPES.CURRENCY : TYPES.COIN)}
							isCoin
							type='buy'
						/>
					)}
					{hasDateOptions && (
						<FilterDropdown
							options={filters.date}
							icon={<FaHistory size={14} color={theme === 'dark' ? '#c3c5b7' : '#0d1726'} />}
							defaultOption='pickDate'
							onOptionChanged={(idx) => onOptionChanged(idx, TYPES.DATE)}
						/>
					)}
					{hasFlowOptions && (
						<FilterDropdown
							options={filters.flow}
							defaultOption='flowType'
							onOptionChanged={(idx) => onOptionChanged(idx, TYPES.FLOW)}
						/>
					)}
					{hasTypeOptions && (
						<FilterDropdown
							options={filters.type}
							defaultOption='transactionType'
							onOptionChanged={(idx) => onOptionChanged(idx, TYPES.TYPE)}
						/>
					)}
					{hasTradeOptions && (
						<FilterDropdown
							options={filters.submit}
							defaultOption='tradeType'
							onOptionChanged={(idx) => onOptionChanged(idx, TYPES.SUBMIT)}
						/>
					)}
					{hasStatusOptions && (
						<FilterDropdown
							options={filters.status}
							defaultOption='statusType'
							onOptionChanged={(idx) => onOptionChanged(idx, TYPES.STATUS)}
						/>
					)}
				</Flex>
				<div className='mr-auto'>
					<RefetchTimer onTimeout={refetch} />
				</div>
			</Flex>

			<AnimatePresence exitBeforeEnter>
				<TableWrapper variants={variants} initial='out' animate='in' exit='out'>
					<div className={'overflow-x-auto w-100 '}>
						<table className={'table table-auto w-full border-separate'} style={{ borderSpacing: '0 0.5rem' }}>
							{!!headers?.length && (
								<thead>
									<HeaderRow>
										{headers.map((header) => (
											<HeaderColumn key={header.title}>
												<Text tid={header.title} />
											</HeaderColumn>
										))}
									</HeaderRow>
								</thead>
							)}
							{!loading && <tbody>{children}</tbody>}
						</table>
					</div>
					{loading && (
						<FlexCenter width='100%' height='400px'>
							<ScaleLoader size={24} color='#0773F1' />
						</FlexCenter>
					)}
				</TableWrapper>
			</AnimatePresence>
			{data?.data?.length && totalPages ? (
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
			) : null}
			{data?.data?.length === 0 && !loading && (
				<NoDataWrapper top={noDataTop}>
					<img alt=' ' src={require('../../assets/images/noData.png')} />
				</NoDataWrapper>
			)}
		</>
	)
}

export default FilterLayout
