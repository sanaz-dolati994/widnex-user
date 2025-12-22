import React, { useEffect, useState } from 'react'
import CoinOperation from '../../components/my-wallets/CoinOperation'
import CoinsList from '../../components/my-wallets/CoinsList'
import {
	MainRow,
	MainColumn,
	PaginationContainer,
	Flex,
	FlexCenter,
	DText,
} from '../../styles/CommonStyles'
import { formatDate, formatNumber, variants } from '../../core/utils/common'
import { Table, Row, Column } from '../../styles/TableStyle'
import { TableWrapper } from '../../styles/OrdersStyle.js'
import { AnimatePresence } from 'framer-motion'
import CardLayout from '../layouts/CardLayout'
import { HeaderColumn, HeaderRow, NoDataWrapper } from '../../styles/TableStyle'
import Pagination from 'react-js-pagination'
import {
	AllTransactions,
	DetailsIcon,
	NetworkBadge,
	TransactionStatus,
} from '../../styles/TransactionHistoryStyles'
import { useWalletContext } from '../../core/contexts/wallet'
import Text from '../../core/utils/Text'
import { useMainContext } from '../../core/contexts/main'
import BankPortContextProvider from '../../core/contexts/bankPort'
import useTransactions from '../../core/hooks/useTransaction'
import AuthLoading from '../../components/authentication/AuthLoading'
import TransactionDetails from '../transactions/TransactionDetails'
import ModalLayout from '../layouts/ModalLayout'
import { useNavigate } from 'react-router-dom'
import { SOCKET_URL } from '../../core/constants/urls'

const WalletsOperation = () => {
	const {
		main: { theme },
	} = useMainContext()
	const { wallet, coin } = useWalletContext()
	const navigate = useNavigate()

	const [detailsModal, setDetailsModal] = useState({
		open: false,
		item: null,
	})

	const goToTransactions = () => {
		navigate('/transaction-history')
	}

	const onModalClosed = () => {
		setDetailsModal({ open: false, item: null })
	}

	const {
		bankQueries,
		bankFetching,
		bankTransactions,
		walletQueries,
		walletFetching,
		walletTransactions,
		allPages,
		setBankQueries,
		setWalletQueries,
	} = useTransactions()

	useEffect(() => {
		if (wallet.type === 'coin') {
			setWalletQueries((state) => ({
				...state,
				query: {
					...state.query,
					flow: wallet.op,
					coin,
				},
			}))
		} else {
			setBankQueries((state) => ({ ...state, query: [wallet.op, null] }))
		}
	}, [wallet, coin])

	const onPageChange = (p) => {
		if (wallet.type === 'coin') {
			setWalletQueries((state) => ({ ...state, page: p }))
		} else {
			setBankQueries((state) => ({ ...state, page: p }))
		}
	}

	const headers = wallet.type === 'tooman' ? bankHeaders : walletHeaders

	return (
		<MainRow>
			<BankPortContextProvider>
				<Flex align={'start'} className={'w-full gap-5'}>
					<CoinsList />
					<MainColumn width='70%'>
						<CoinOperation />
						<CardLayout width='100%'>
							<AnimatePresence exitBeforeEnter>
								{
									<TableWrapper variants={variants} initial='out' animate='in' exit='out'>
										<Table width='100%'>
											<thead>
												<HeaderRow>
													{headers.map((header) => (
														<HeaderColumn key={header.title} width={header.width}>
															<Text tid={header.title} />
														</HeaderColumn>
													))}
												</HeaderRow>
											</thead>
											<tbody>
												{/* wallet transactions table */}
												{!walletFetching && wallet.type === 'coin' && (
													<TransactionTable
														type='coin'
														coin={coin}
														data={walletTransactions}
														setDetailsModal={setDetailsModal}
													/>
												)}
												{/* bank transactions table */}
												{!bankFetching && wallet.type === 'tooman' && (
													<TransactionTable
														type='bank'
														data={bankTransactions}
														setDetailsModal={setDetailsModal}
													/>
												)}
											</tbody>
										</Table>
									</TableWrapper>
								}
							</AnimatePresence>
							<AuthLoading loading={walletFetching || bankFetching} />
							<AllTransactions onClick={goToTransactions}>
								<Text tid='see-transaction-history' />
							</AllTransactions>
							{allPages ? (
								<PaginationContainer>
									<Pagination
										activePage={wallet.type === 'coin' ? walletQueries.page : bankQueries.page}
										itemsCountPerPage={10}
										totalItemsCount={wallet.type === 'coin' ? allPages?.WT : allPages?.BT}
										pageRangeDisplayed={3}
										onChange={(p) => onPageChange(p)}
										itemClass={theme === 'light' ? 'd-page-item' : 'page-item'}
										linkClass={theme === 'light' ? 'd-page-link' : 'page-link'}
									/>
								</PaginationContainer>
							) : null}
							{((wallet.type === 'coin' &&
								walletTransactions?.data?.length === 0 &&
								!walletFetching) ||
								(wallet.type === 'tooman' &&
									bankTransactions?.data?.length === 0 &&
									!bankFetching)) && (
								<NoDataWrapper top='150px'>
									<img alt=' ' src={require('../../assets/images/noData.png')} />
								</NoDataWrapper>
							)}
						</CardLayout>
						{detailsModal.open ? (
							<ModalLayout width='600px' open={detailsModal.open} onClose={onModalClosed}>
								<TransactionDetails
									type={wallet.type === 'tooman' ? 'bank' : 'wallet'}
									transaction={detailsModal.item}
									onClose={onModalClosed}
								/>
							</ModalLayout>
						) : null}
					</MainColumn>
				</Flex>
			</BankPortContextProvider>
		</MainRow>
	)
}

const TransactionTable = (props) => {
	const {
		main: { lang },
	} = useMainContext()

	const { data, coin, setDetailsModal, type } = props

	const SHOW = (coin && type === 'coin') || type === 'bank'

	return (
		<>
			{SHOW ? (
				data?.data?.map((item) => (
					<Row>
						{type === 'coin' ? (
							<>
								<Column width='14%'>
									<FlexCenter>
										<img
											src={SOCKET_URL + `assets/icon/${item.coin}.png`}
											alt=' '
											width='22px'
											height='22px'
										/>
										<DText style={{ margin: '0 5px' }} fontSize={'0.9rem'}>
											{item.coin}
										</DText>
									</FlexCenter>
								</Column>
								<Column width='14%'>
									<FlexCenter>
										<NetworkBadge>{item.network}</NetworkBadge>
									</FlexCenter>
								</Column>
							</>
						) : (
							<Column>{item._id}</Column>
						)}

						<Column width='19%'>{formatNumber(item.amount)}</Column>
						<Column width='19%'>
							{formatDate(item.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}
						</Column>
						<Column width='14%'>
							{formatDate(item.createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}
						</Column>
						<Column width='14%'>
							<TransactionStatus status={item.status}>
								<Text tid={`T${item.status}`} />
							</TransactionStatus>
						</Column>
						<Column width='6%' onClick={() => setDetailsModal({ open: true, item })}>
							<FlexCenter onClick={() => setDetailsModal({ open: true, item })}>
								<DetailsIcon size={22} />
							</FlexCenter>
						</Column>
					</Row>
				))
			) : (
				<NoDataWrapper top='150px'>
					<img alt=' ' src={require('../../assets/images/noData.png')} />
				</NoDataWrapper>
			)}
		</>
	)
}

const walletHeaders = [
	{ title: 'coin', width: '14%' },
	{ title: 'network', width: '14%' },
	{ title: 'amount', width: '19%' },
	{ title: 'date', width: '19%' },
	{ title: 'timeHour', width: '14%' },
	{ title: 'status', width: '14%' },
	{ title: 'details', width: '6%' },
]

const bankHeaders = [
	{ title: 'id', width: '28%' },
	{ title: 'amount', width: '19%' },
	{ title: 'date', width: '19%' },
	{ title: 'timeHour', width: '14%' },
	{ title: 'status', width: '14%' },
	{ title: 'details', width: '6%' },
]

export default WalletsOperation
