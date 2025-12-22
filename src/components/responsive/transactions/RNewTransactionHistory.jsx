import React, { useEffect, useRef, useState } from 'react'
import CardLayout from '../../layouts/CardLayout'
import { AnimatePresence } from 'framer-motion'
import useTransactions from '../../../core/hooks/useTransaction'
import RTransactionItem from './RTransactionItem'
import RFilterLayout from '../layouts/RFilterLayout'
import { DetailsWrapper } from '../../../styles/TransactionHistoryStyles'
import TransactionDetails from '../../transactions/TransactionDetails'
import useClickOutside from '../../../core/hooks/useClickOutside'
import MobileModal from '../../modals/MobileModal'
import Text from '../../../core/utils/Text'

export default function RNewTransactionHistory({ type, flow }) {
	// const [activeTab, setActiveTab] = useState(1)
	const [detailsModal, setDetailsModal] = useState({
		open: false,
		item: null,
	})
	const [cancelModal, setCancelModal] = useState({
		open: false,
		type: null,
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
		onCancelTransaction,
		walletRefetch,
		bankRefetch
	} = useTransactions()

	useEffect(() => {
		if (type === 'bank') {
			setBankQueries((prevState) => ({
				...prevState,
				page: 1,
				query: { ...prevState.query, flow: flow },
			}))
		}
		if (type === 'wallet') {
			setWalletQueries((prevState) => ({
				...prevState,
				page: 1,
				query: { ...prevState.query, flow: flow },
			}))
		}
	}, [type, flow])

	const handleRefetch = () => {
		if (type === 'bank') {
			bankRefetch()
		} else {
			walletRefetch()
		}
	}

	return (
		<>
			<CardLayout width='100%' minHeight='400px' color='#607d8b'>
				<RFilterLayout
					refetch={handleRefetch}
					data={type === 'bank' ? bankTransactions : walletTransactions}
					totalPages={type === 'bank' ? allPages.BT : allPages.WT}
					activeTab={type}
					state={
						type === 'bank'
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
					loading={type === 'bank' ? bankFetching : walletFetching}
					filters={['date']}
				>
					{type === 'bank' ? (
						bankTransactions?.data?.length ? (
							<TransactionTable
								data={bankTransactions.data}
								// activeTab={activeTab}
								setCancelModal={setCancelModal}
								type={type}
								setDetailsModal={setDetailsModal}
							/>
						) : null
					) : walletTransactions?.data?.length ? (
						<TransactionTable
							data={walletTransactions.data}
							// activeTab={activeTab}
							setCancelModal={setCancelModal}
							type={type}
							setDetailsModal={setDetailsModal}
						/>
					) : null}
				</RFilterLayout>
			</CardLayout>
			<MobileModal
				isOpen={detailsModal.open}
				onClose={() => {
					setDetailsModal({ open: false, item: null })
				}}
			>
				<TransactionDetails
					setCancelModal={setCancelModal}
					transaction={detailsModal.item}
					onClose={() => {
						setDetailsModal({ open: false, item: null })
					}}
					type={type}
				/>
			</MobileModal>
			<MobileModal isOpen={cancelModal.open} onClose={() => setCancelModal(false)}>
				<div className='flex w-full flex-col gap-8'>
					<Text tid={'cancel-withdraw-transaction'} />
					<Text tid={'cancel-withdraw-transaction-confirm'} />
					<div className='flex w-full gap-4 items-center'>
						<button
							className='w-full rounded-lg py-2 hover:opacity-70 bg-cBlue'
							onClick={() => {
								console.log(cancelModal)
								onCancelTransaction(cancelModal.item, cancelModal.type)
								setCancelModal({ item: null, open: false, type: null })
							}}
						>
							<Text tid={'confirm'} />
						</button>
						<button
							className='w-full rounded-lg border py-2 hover:opacity-70'
							onClick={() => setCancelModal({ item: null, open: false, type: null })}
						>
							<Text tid={'decline'} />
						</button>
					</div>
				</div>
			</MobileModal>
		</>
	)
}

const variants = {
	in: {
		y: 0,
		transition: { duration: 1 },
	},
	out: {
		y: 500,
		transition: { duration: 1 },
	},
}

export const TransactionTable = ({ data, activeTab, type, setDetailsModal, setCancelModal }) => {
	return (
		<AnimatePresence exitBeforeEnter>
			<div className={'pt-5 '}>
				{data.map((item, idx) => (
					<>
						<RTransactionItem
							isCoin={type === 'wallet'}
							data={item}
							key={idx}
							setCancelModal={setCancelModal}
							onClick={() => {
								setDetailsModal({ open: true, item })
							}}
							type={type}
						/>
						{/*Exactly here should open an expandable to show row details  */}
					</>
				))}
			</div>
		</AnimatePresence>
	)
}
