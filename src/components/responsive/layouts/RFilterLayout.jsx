import React, { useEffect, useRef, useState } from 'react'
import Pagination from 'react-js-pagination'
import SearchBox from '../../SearchBox'
import useSearchApi from '../../../core/hooks/useSearchApi'
import {
	DText,
	Flex,
	FlexCenter,
	PaginationContainer,
	SubmitSearch,
} from '../../../styles/CommonStyles'
import { HeaderColumn, HeaderRow, NoDataWrapper } from '../../../styles/TableStyle'
import Text from '../../../core/utils/Text'
import { useMainContext } from '../../../core/contexts/main'
import AuthLoading from '../../authentication/AuthLoading'
import { useWindowSize } from '../../../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../../../core/constants/common'
import {
	FilterButton,
	FilterCheckBox,
	FilterContent,
	FiltersRow,
	FiltersText,
	FiltersWrapper,
	Filters,
	FilterTag,
	SelectDropdown,
} from '../../../styles/layout-styles/CommonStyles'
import { AnimatePresence } from 'framer-motion'
import { filters as FILTERS, getFilterDate } from '../../../core/utils/filter'
import useClickOutside from '../../../core/hooks/useClickOutside'
import { FilterIcon } from '../../common/icons'
import FilterDropdown from '../../modals/FilterDropdown'
import { FaHistory } from 'react-icons/fa'
import RFilterDropdown from '../../modals/RFilterDropdown'
import RefetchTimer from '../../transactions/RefetchTimer'

const RFilterLayout = ({
	children,
	state,
	headers,
	data,
	loading,
	refetch = () => { },
	totalPages,
	filters,
	hasSearchBar,
	title,
	activeTab = -1,
} = {}) => {
	const { width } = useWindowSize()

	const {
		main: { theme },
	} = useMainContext()
	const [searchValue, setSearchValue] = useState('')

	const filtersRef = useRef()
	const [filtersOpen, setFiltersOpen] = useState(false)
	const [filtersOn, setFiltersOn] = useState([])
	// const [selectedOption, setSelectedOption] = useState(null)

	const [_filters, setFilters] = useState({})

	useEffect(() => {
		const temp = {}
		filters.forEach((filter) => {
			temp[filter] = -1
		})
		setFilters(temp)
	}, [])

	useEffect(() => {
		filtersReset()
	}, [activeTab])

	useClickOutside(filtersRef, () => setFiltersOpen(false))

	const { filterQueries, setFilterQueries, initialState } = state
	const [onCloseSearchClicked, onPageChange, requestOrdersByMarket] = useSearchApi(activeTab, state)

	const onEnterToggled = (e) => {
		if (e.keyCode === 13) {
			requestOrdersByMarket(searchValue)
		}
	}

	const onCloseSearchClick = () => {
		setSearchValue('')
		onCloseSearchClicked()
	}

	const onFilterClicked = (type, idx) => {
		setFilters((state) => ({ ...state, [type]: idx }))
	}

	const onSubmitClicked = () => {
		setFiltersOpen(false)
		setFilterQueries((state) => {
			const newQuery = {}
			let temp = []
			Object.keys(_filters).forEach((key) => {
				const value = _filters[key]
				if (value >= 0) {
					temp.push({ key, value: FILTERS[key][value] })
				}
				if (key === 'date') {
					return
				}

				let _value = FILTERS[key][value]
				if (key === 'status') {
					_value = _value?.replace('T', '')
				}

				newQuery[key] = _value ? _value : ''
			})
			if (temp.length) {
				setFiltersOn(temp)
			}

			let dateFrom = ''
			if ('date' in _filters) {
				dateFrom = getFilterDate(_filters.date)
			}

			return { ...state, dateFrom, query: { ...state.query, ...newQuery } }
		})
	}

	const filtersReset = () => {
		setFilterQueries(initialState)
		setFiltersOn([])
		setFilters({})
	}

	return (
		<>
			<div className={'w-full gap-3 p-3'}>
				<div className='flex justify-between w-full items-center gap-6 '>
					{title && (
						<h2 className='font-semibold'>
							<Text tid={title} />
						</h2>
					)}
					<Filters onClick={() => setFiltersOpen(true)} active={filtersOn.length}>
						<DText>
							{/* <Text tid='filters' /> */}
							<FilterIcon color={theme === 'dark' ? '#D9D9D9' : '#2E3344'} />
						</DText>
					</Filters>
					<div className='mr-auto'>
						<RefetchTimer onTimeout={refetch} />
					</div>
				</div>
				<FlexCenter style={{ flexWrap: 'wrap', justifyContent: 'flex-start', marginTop: '8px' }}>
					{filtersOn.map((tag) => (
						<FilterTag>
							<DText style={{ margin: '0 2px' }}>
								<Text tid={tag.key} />:
							</DText>
							<DText>
								<Text tid={tag.value} />
							</DText>
						</FilterTag>
					))}
				</FlexCenter>

				{hasSearchBar && (
					<Flex align={'center'}>
						<SearchBox
							onKeyDown={onEnterToggled}
							searchValue={searchValue}
							onInputValueChange={(e) => setSearchValue(e?.target?.value)}
							onCloseSearchClicked={onCloseSearchClick}
						/>
						{searchValue && <SubmitSearch onClick={() => requestOrdersByMarket(searchValue)} />}
					</Flex>
				)}
			</div>

			{width > TABLET_SIZE && !!headers?.length && (
				<HeaderRow>
					{headers.map((header) => (
						<HeaderColumn key={header.title} width={header.width}>
							<Text tid={header.title} />
						</HeaderColumn>
					))}
				</HeaderRow>
			)}

			{!loading && children}

			{data?.data?.length && totalPages ? (
				<PaginationContainer>
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
			<AuthLoading loading={loading} />
			{data?.data?.length === 0 && !loading && (
				<NoDataWrapper top='150px'>
					<img alt=' ' src={require('../../../assets/images/noData.png')} />
				</NoDataWrapper>
			)}
			<AnimatePresence exitBeforeEnter>
				{filtersOpen && (
					<FiltersWrapper
						ref={filtersRef}
						variants={variants}
						animate='in'
						exit='out'
						initial='out'
					>
						<div className='flex flex-col gap-6 items-center h-full'>
							<FlexCenter style={{ borderBottom: '1px solid #ffffff15', paddingBottom: '5px' }}>
								<DText
									style={{ position: 'absolute', right: '20px', top: '20px' }}
									onClick={filtersReset}
								>
									<Text tid='delete-filters' />
								</DText>
								<FiltersText color='mainOrange'>
									<Text tid='filters' />
								</FiltersText>
							</FlexCenter>
							{filtersOn.length > 0 && (
								<FlexCenter style={{ flexWrap: 'wrap', justifyContent: 'flex-start' }}>
									{filtersOn.map((tag) => (
										<FilterTag>
											<DText style={{ margin: '0 2px' }}>
												<Text tid={tag.key} />:
											</DText>
											<DText>
												<Text tid={tag.value} />
											</DText>
										</FilterTag>
									))}
								</FlexCenter>
							)}
							<FilterContent>
								{filters?.map((filter) => (
									<FiltersRow>
										<DText style={{ margin: '5px 0' }}>
											<Text tid={'based-on'} />
											<Text tid={filter} className='mr-1' />
										</DText>
										<RFilterDropdown
											options={FILTERS[filter]}
											// icon={<FaHistory size={14} color={theme === 'dark' ? '#c3c5b7' : '#0d1726'} />}
											defaultOption={filter}
											onOptionChanged={(idx) => {
												onFilterClicked(filter, idx)
											}}
										/>
										{/* <SelectDropdown onChange={(e) => onFilterClicked(filter, e.target.value)}>
										{FILTERS[filter].map((item, idx) => {

											return (
												<DText key={idx} value={item}>
													<Text className='!inline-block' tid={item} />
												</DText>
											)
										})}
									</SelectDropdown> */}
									</FiltersRow>
								))}
							</FilterContent>
							<FlexCenter
								style={{
									flexDirection: 'column',
									gap: '6px',
									justifyContent: 'space-around',
									marginTop: 'auto',
								}}
							>
								<FilterButton active onClick={() => onSubmitClicked()}>
									<Text tid='affect' />
								</FilterButton>

								<FilterButton onClick={() => setFiltersOpen(false)}>
									<Text tid='cancel' />
								</FilterButton>
							</FlexCenter>
						</div>
					</FiltersWrapper>
				)}
			</AnimatePresence>
		</>
	)
}

const variants = {
	in: {
		y: 0,
		transition: { duration: 0.3 },
	},
	out: {
		y: 500,
		transition: { duration: 0.3 },
	},
}

export default RFilterLayout
