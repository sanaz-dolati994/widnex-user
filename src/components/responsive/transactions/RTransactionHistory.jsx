import React, { useRef, useState } from 'react'
import CardLayout from '../../layouts/CardLayout'
import { RMainTab } from '../../../styles/CommonStyles'
import { AnimatePresence } from 'framer-motion'
import { useMainContext } from '../../../core/contexts/main'
import Text from '../../../core/utils/Text'
import useTransactions from '../../../core/hooks/useTransaction'
import { TabContainer } from '../../../styles/CoinOperationStyles'
import RTransactionItem from './RTransactionItem'
import RFilterLayout from '../layouts/RFilterLayout'
import { DetailsWrapper } from "../../../styles/TransactionHistoryStyles";
import TransactionDetails from "../../transactions/TransactionDetails";
import useClickOutside from "../../../core/hooks/useClickOutside";

const RTransactionHistory = () => {
	const [activeTab, setActiveTab] = useState(1)
	const [detailsModal, setDetailsModal] = useState({
		open: false, item: null
	})

	const modalRef = useRef()
	useClickOutside(modalRef, () => setDetailsModal({ open: false, item: null }))

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


	const onTabChange = (idx) => {
		if (activeTab !== idx) {
			setActiveTab(idx)
		}
	}


	return (
		<>
			<TabContainer margin='0' style={{ width: '100%' }}>
				<RMainTab onClick={() => onTabChange(1)} idx={1} active={activeTab === 1}>
					<Text tid='bank-transactions' />
				</RMainTab>
				<RMainTab onClick={() => onTabChange(2)} idx={2} active={activeTab === 2}>
					<Text tid='wallet-transactions' />
				</RMainTab>
			</TabContainer>
			<CardLayout width='100%' minHeight='400px' color='#607d8b'>
				<RFilterLayout
					data={activeTab === 1 ? bankTransactions : walletTransactions}
					totalPages={activeTab === 1 ? allPages.BT : allPages.WT}
					activeTab={activeTab}
					state={
						activeTab === 1
							? {
								filterQueries: bankQueries,
								setFilterQueries: setBankQueries,
								initialState: bankInitialState,
								type: 'flow',
							}
							: {
								filterQueries: walletQueries,
								setFilterQueries: setWalletQueries,
								initialState: walletInitialState,
								type: 'flow',
							}
					}
					loading={activeTab === 1 ? bankFetching : walletFetching}
					filters={['date', 'flow', 'status']}
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
				</RFilterLayout>
			</CardLayout>
			<AnimatePresence exitBeforeEnter>
				{detailsModal.open &&
					<DetailsWrapper ref={modalRef} variants={variants} animate='in' exit='out' initial='out'>
						<TransactionDetails
							transaction={detailsModal.item}
							onClose={() => setDetailsModal({ open: false, item: null })}
							type={activeTab === 1 ? 'bank' : 'wallet'}
						/>
					</DetailsWrapper>
				}
			</AnimatePresence>
		</>
	)
}


const variants = {
	in: {
		y: 0, transition: { duration: 1 }
	},
	out: {
		y: 500, transition: { duration: 1 }
	}
}


export const TransactionTable = ({ data, activeTab, setDetailsModal }) => {


	return (
		<AnimatePresence exitBeforeEnter>
			<div className={'pt-5 px-5'}>
				{data.map((item, idx) => (
					<RTransactionItem
						isCoin={activeTab === 2}
						data={item}
						key={idx}
						onClick={() => setDetailsModal({ open: true, item })}
					/>
				))}
			</div>
		</AnimatePresence>
	)
}

export default RTransactionHistory
