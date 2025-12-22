import { useMainContext } from '../../core/contexts/main'
import { Column, HeaderColumn, HeaderRow, NoDataWrapper, Row } from '../../styles/TableStyle'
import { DText, FlexCenter, PaginationContainer } from '../../styles/CommonStyles'
import { SOCKET_URL } from '../../core/constants/urls'
import {
	AllTransactions,
	DetailsIcon,
	NetworkBadge,
	TransactionStatus,
} from '../../styles/TransactionHistoryStyles'
import { formatDate, formatNumber } from '../../core/utils/common'
import Text from '../../core/utils/Text'
import React, { useEffect, useState } from 'react'
import ModalLayout from '../../components/layouts/ModalLayout'
import TransactionDetails from '../../components/transactions/TransactionDetails'
import useTransactions from '../../core/hooks/useTransaction'
import AuthLoading from '../../components/authentication/AuthLoading'
import Pagination from 'react-js-pagination'
import { Link } from 'react-router-dom'
import { ScaleLoader } from 'react-spinners'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../../core/constants/common'

const TransactionTable = ({ type, flow, coin }) => {
	const { width } = useWindowSize()
	const {
		main: { theme },
	} = useMainContext()

	const [detailsModal, setDetailsModal] = useState({
		open: false,
		item: null,
	})
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
		if (type === 'wallet') {
			setWalletQueries((state) => ({
				...state,
				query: {
					...state.query,
					flow,
					coin: coin.id,
				},
			}))
		} else {
			setBankQueries((state) => ({ ...state, query: [type, null] }))
		}
	}, [type, coin])

	const onPageChange = (p) => {
		if (type === 'coin') {
			setWalletQueries((state) => ({ ...state, page: p }))
		} else {
			setBankQueries((state) => ({ ...state, page: p }))
		}
	}

	const data = type === 'bank' ? bankTransactions : walletTransactions
	const Table = width > TABLET_SIZE ? Desktop : Mobile

	return (
		<div className={'relative'}>
			{detailsModal.open ? (
				<ModalLayout width='600px' open={detailsModal.open} onClose={onModalClosed}>
					<TransactionDetails type={type} transaction={detailsModal.item} onClose={onModalClosed} />
				</ModalLayout>
			) : null}

			<Table data={data} setDetailsModal={setDetailsModal} type={type} />

			{walletFetching || bankFetching ? (
				<div
					className={
						'flex items-center justify-center absolute top-0 left-0 w-full h-full bg-[#00000020] rounded-md'
					}
				>
					<ScaleLoader size={15} color='#4f31c5' />
				</div>
			) : null}

			<div className={'relative'}>
				{allPages ? (
					<Pagination
						activePage={type === 'wallet' ? walletQueries.page : bankQueries.page}
						itemsCountPerPage={10}
						totalItemsCount={type === 'wallet' ? allPages?.WT : allPages?.BT}
						pageRangeDisplayed={3}
						onChange={(p) => onPageChange(p)}
						itemClass={theme === 'light' ? 'd-page-item' : 'page-item'}
						linkClass={theme === 'light' ? 'd-page-link' : 'page-link'}
					/>
				) : null}
				<Link to={'/transaction-history'}>
					<div
						className={
							'lg:absolute text-center mt-3 lg:mt-0 left-0 top-4 lg:text-active underline text-xs'
						}
					>
						<Text tid='see-transaction-history' />
					</div>
				</Link>
			</div>

			{((type === 'wallet' && walletTransactions?.data?.length === 0 && !walletFetching) ||
				(type === 'bank' && bankTransactions?.data?.length === 0 && !bankFetching)) && (
				<div className={'flex items-center justify-center w-full h-full absolute left-0 top-0'}>
					<img
						width={width > TABLET_SIZE ? 114 : 92}
						alt=' '
						src={require('../../assets/images/noData.png')}
					/>
				</div>
			)}
		</div>
	)
}

const Desktop = ({ data, type, setDetailsModal }) => {
	const headers = type === 'bank' ? bankHeaders : walletHeaders
	const {
		main: { lang },
	} = useMainContext()

	return (
		<div className={'min-h-[300px]'}>
			<table className={'w-full'}>
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
					{data?.data?.length
						? data?.data?.map((item) => (
								<Row>
									{type === 'wallet' ? (
										<>
											<Column width='14%'>
												<FlexCenter>
													<img
														src={SOCKET_URL + `assets/icon/${item.coin}.png`}
														alt=' '
														width='22px'
														height='22px'
													/>
													<DText style={{ margin: '0 5px' }} fontSize={'0.8rem'}>
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
						: null}
				</tbody>
			</table>
		</div>
	)
}

const Mobile = ({ data, type, setDetailsModal }) => {
	const {
		main: { lang },
	} = useMainContext()

	return (
		<div className={'min-h-[240px]'}>
			{data?.data?.map((item) => {
				return (
					<div
						className={'rounded-md bg-gray-100 dark:bg-primaryBg my-2 p-3'}
						onClick={() => setDetailsModal({ open: true, item })}
					>
						<div className={'grid grid-cols-2 text-xs'}>
							{type === 'wallet' ? (
								<>
									<div className={'flex items-center gap-2'}>
										<div className={'flex items-center gap-1'}>
											<img
												src={SOCKET_URL + `assets/icon/${item.coin}.png`}
												alt=' '
												width='22px'
												height='22px'
											/>
											<span>{item.coin}</span>
										</div>
									</div>
									<div className={'flex items-center gap-2'}>
										<span>
											<Text tid={'network'} className={'text-xs text-secondary'} />
											<span>:</span>
										</span>
										<div className={'rounded-md bg-active opacity-70 px-3 py-1 text-black'}>
											<span>{item.network}</span>
										</div>
									</div>
								</>
							) : (
								<div className={'flex items-center gap-2 col-span-2'}>
									<span>
										<Text tid={'id'} className={'text-xs text-secondary'} />
										<span>:</span>
									</span>
									<span>{item._id}</span>
								</div>
							)}
							<div
								className={
									'mx-auto w-full h-[1px] bg-gray-800 dark:bg-gray-100 opacity-10 col-span-2 my-2'
								}
							/>
							<div className={'flex items-center gap-2'}>
								<span>
									<Text tid={'amount'} className={'text-xs text-secondary'} />
									<span>:</span>
								</span>
								<span>{formatNumber(item.amount)}</span>
							</div>
							<div className={'flex items-center gap-2'}>
								<span>
									<Text tid={'status'} className={'text-xs text-secondary'} />
									<span>:</span>
								</span>
								<TransactionStatus status={item.status}>
									<Text tid={`T${item.status}`} />
								</TransactionStatus>
							</div>
							<div
								className={
									'mx-auto w-full h-[1px] bg-gray-800 dark:bg-gray-100 opacity-10 col-span-2 my-2'
								}
							/>
							<div className={'mt-2'}>
								<span>{`${formatDate(item.createdAt, 'date', lang)}-${formatDate(
									item.createdAt,
									'time',
									lang
								)}`}</span>
							</div>
						</div>
					</div>
				)
			})}
		</div>
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

export default TransactionTable
