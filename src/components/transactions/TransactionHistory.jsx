import React, { useState } from 'react'
import CardLayout from '../layouts/CardLayout'
import { TabBar, Tab } from '../../styles/TransactionHistoryStyles'
import FilterLayout from '../layouts/FilterLayout'
import Text from '../../core/utils/Text'
import useTransactions from '../../core/hooks/useTransaction'
import ModalLayout from '../layouts/ModalLayout'
import TransactionTable from './TransactionsTable'
import TransactionDetails from './TransactionDetails'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../../core/constants/common'

const TransactionHistory = () => {
	const { width } = useWindowSize()
	const [activeTab, setActiveTab] = useState(1)
	const [detailsModal, setDetailsModal] = useState({
		open: false,
		item: null,
	})

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
		bankInitialState,
		walletInitialState,
	} = useTransactions()

	const Tabbar = () => {
		return (
			<TabBar>
				<Tab onClick={() => onTabChange(1)} idx={1} active={activeTab === 1}>
					<Text className={activeTab === 1 ? '!text-white' : ''} tid='bank-transactions' />
				</Tab>
				<Tab onClick={() => onTabChange(2)} idx={2} active={activeTab === 2}>
					<Text className={activeTab === 2 ? '!text-white' : ''} tid='wallet-transactions' />
				</Tab>
			</TabBar>
		)
	}

	const onTabChange = (idx) => {
		if (activeTab !== idx) {
			setActiveTab(idx)
		}
	}

	const onModalClosed = () => {
		setDetailsModal({ id: null, open: false })
	}

	return (
		<>
			<CardLayout width='100%' color='#607d8b'>
				<FilterLayout
					headers={activeTab === 1 ? bankingHeaders : walletHeaders}
					data={activeTab === 1 ? bankTransactions : walletTransactions}
					totalPages={activeTab === 1 ? allPages.BT : allPages.WT}
					tabbar={<Tabbar />}
					hasTabbar
					hasSearchOption={activeTab === 1}
					hasCoinOption={activeTab === 2}
					hasFlowOptions
					hasStatusOptions
					state={
						activeTab === 1
							? {
								filterQueries: bankQueries,
								setFilterQueries: setBankQueries,
								initialState: bankInitialState,
							}
							: {
								filterQueries: walletQueries,
								setFilterQueries: setWalletQueries,
								initialState: walletInitialState,
							}
					}
					activeTab={activeTab}
					loading={activeTab === 1 ? bankFetching : walletFetching}
				>
					{activeTab === 1 ? (
						bankTransactions?.data?.length ? (
							<TransactionTable
								data={bankTransactions.data}
								activeTab={activeTab}
								setDetailsModal={setDetailsModal}
							/>
						) : null
					) : walletTransactions?.data?.length ? (
						<TransactionTable
							data={walletTransactions.data}
							activeTab={activeTab}
							setDetailsModal={setDetailsModal}
						/>
					) : null}
				</FilterLayout>
			</CardLayout>

			{detailsModal.open ? (
				<ModalLayout
					width={width > TABLET_SIZE ? '600px' : '100%'}
					open={detailsModal.open}
					onClose={onModalClosed}
				>
					<TransactionDetails
						type={activeTab === 1 ? 'bank' : 'wallet'}
						transaction={detailsModal.item}
						onClose={onModalClosed}
					/>
				</ModalLayout>
			) : null}
		</>
	)
}

const walletHeaders = [
	{ title: 'coin', width: '10%' },
	{ title: 'amount', width: '10%' },
	{ title: 'transactionType', width: '10%' },
	{ title: 'id', width: '20%' },
	{ title: 'network', width: '10%' },
	{ title: 'date', width: '10%' },
	{ title: 'timeHour', width: '10%' },
	{ title: 'status', width: '10%' },
	{ title: 'details', width: '10%' },
]

const bankingHeaders = [
	{ title: 'amount', width: '15.6%' },
	{ title: 'transactionType', width: '15.6%' },
	{ title: 'id', width: '20.2%' },
	{ title: 'date', width: '13.6%' },
	{ title: 'timeHour', width: '13.6%' },
	{ title: 'status', width: '13.6%' },
	{ title: 'details', width: '8%' },
]

export default TransactionHistory
