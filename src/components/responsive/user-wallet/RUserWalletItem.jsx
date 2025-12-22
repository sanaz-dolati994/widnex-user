import React from 'react'
import { SOCKET_URL } from '../../../core/constants/urls'
import useTransactions from '../../../core/hooks/useTransaction'
import CardLayout from '../../layouts/CardLayout'
import { Flex } from '../../../styles/CommonStyles'
import Text from '../../../core/utils/Text'
import { _formatNumber } from '../../../core/utils/numbers'
import { BalanceBtn, BtnText } from '../../../styles/UserBalanceStyles'
import useUserBalance from '../../../core/hooks/useUserBalance'
import { FaChevronCircleDown, FaChevronCircleUp, FaChevronRight, FaHistory } from 'react-icons/fa'
import FilterDropdown from '../../modals/FilterDropdown'
import { filters, getFilterDate, TYPES } from '../../../core/utils/filter'
import { useMainContext } from '../../../core/contexts/main'
import { NoDataWrapper } from '../../../styles/TableStyle'
import RTransactionItem from '../transactions/RTransactionItem'

const RUserWalletItem = ({ data, setActiveItem, showModal, setShowModal }) => {
	data.image = SOCKET_URL + `assets/icon/${data.name}.png`

	const { all, available, blocked, name, tether, image } = data

	const {
		main: { theme },
	} = useMainContext()

	const { onBalanceOperationsClicked } = useUserBalance()

	const { walletTransactions, setWalletQueries } = useTransactions({
		fetchBanks: false,
		walletInitialState: {
			page: 1,
			dateFrom: null,
			search: ['flow', 'coin'],
			query: [null, name],
		},
	})

	const onDateOptionChanged = (option) => {
		const date = getFilterDate(option)
		setWalletQueries((state) => ({ ...state, page: 1, dateFrom: date }))
	}

	return (
		<>
			<div
				className={
					'absolute overflow-y-auto top-0 left-0 w-full h-[calc(100vh-80px)] px-5 py-10 z-50'
				}
			>
				<div
					className={`flex w-full px-2 justify-start ${
						theme === 'dark' ? 'text-white' : 'text-black'
					}`}
				>
					<FaChevronRight
						onClick={() => {
							setShowModal?.(false)
							setActiveItem?.({})
						}}
					/>
				</div>

				<CardLayout width='100%'>
					<Flex className={'-top-[30.5px] relative'} items={'center'} justify={'center'}>
						<img width='56px' height='56px' src={SOCKET_URL + `assets/icon/${name}.png`} alt=' ' />
					</Flex>
					<Flex className={''} items={'center'} justify={'between'}>
						<span className={'px-4 py-2'}>
							<Text tid={'balance'} />
						</span>
						<span className={'px-4 py-2'} dir={'ltr'}>
							{_formatNumber(all, { shorten: false })} {name}
						</span>
					</Flex>
					<Flex className={''} items={'center'} justify={'between'}>
						<span className={'px-4 py-2'}>
							<Text tid={'available'} />
						</span>
						<span className={'px-4 py-2'} dir={'ltr'}>
							{_formatNumber(available, { shorten: false })} {name}
						</span>
					</Flex>
					<Flex className={''} items={'center'} justify={'between'}>
						<span className={'px-4 py-2'}>
							<Text tid={'blockedBalance'} />
						</span>
						<span className={'px-4 py-2'} dir={'ltr'}>
							{_formatNumber(blocked, { shorten: false })} {name}
						</span>
					</Flex>
				</CardLayout>

				<CardLayout width='100%' className={'pt-5 px-5'}>
					<Flex align={'center'} justify={'between'}>
						<span>بازارها</span>
					</Flex>
				</CardLayout>

				<CardLayout width='100%' className={'pt-5 px-5'}>
					<Flex align={'center'} justify={'between'}>
						<span>تاریخچه تراکنش‌ها</span>

						<FilterDropdown
							options={filters.date}
							icon={<FaHistory size={14} color={theme === 'dark' ? '#c3c5b7' : '#0d1726'} />}
							defaultOption='pickDate'
							onOptionChanged={(idx) => onDateOptionChanged(idx)}
						/>
					</Flex>
					<div className={'py-10'}>
						{walletTransactions?.data?.length ? (
							walletTransactions.data.map((item, index) => (
								<RTransactionItem key={index} data={item} />
							))
						) : (
							<NoDataWrapper>
								<img alt=' ' src={require('../../../assets/images/noData.png')} />
							</NoDataWrapper>
						)}
					</div>
					<Flex className={'gap-5 pt-4'}>
						<BalanceBtn active onClick={() => onBalanceOperationsClicked('deposit', name, false)}>
							<BtnText>
								<FaChevronCircleUp />
								<span className={'mr-2'}>واریز</span>
							</BtnText>
						</BalanceBtn>
						<BalanceBtn onClick={() => onBalanceOperationsClicked('withdraw', name, false)}>
							<BtnText>
								<FaChevronCircleDown />
								<span className={'mr-2'}>برداشت</span>
							</BtnText>
						</BalanceBtn>
					</Flex>
				</CardLayout>
			</div>
		</>
	)
}

export default RUserWalletItem
