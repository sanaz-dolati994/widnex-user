import React, { useEffect, useState } from 'react'
import { TabBar, Tab } from '../../styles/TransactionHistoryStyles'
import FilterLayout from '../layouts/FilterLayout'
import Text from '../../core/utils/Text'
import useTransactions from '../../core/hooks/useTransaction'
import ModalLayout from '../layouts/ModalLayout'
import TransactionTable from './TransactionsTable'
import TransactionDetails from './TransactionDetails'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../../core/constants/common'
import MobileModal from '../modals/MobileModal'
import RefetchTimer from './RefetchTimer'

export default function NewTransactionHistory({ type, flow }) {
    const { width } = useWindowSize()
    const [activeTab, setActiveTab] = useState(1)
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
        bankRefetch,
        walletRefetch
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

    const onModalClosed = () => {
        setDetailsModal({ id: null, open: false })
    }

    const handleRefetch = () => {
        if (type === 'bank') {
            bankRefetch()
        } else {
            walletRefetch()
        }
    }

    return (
        <>
            <div className='h-4/5 overflow-y-auto flex flex-col'>
                <FilterLayout
                    refetch={handleRefetch}
                    // headers={type === 'bank' ? bankingHeaders : walletHeaders}
                    data={
                        type === 'bank' ? bankTransactions : walletTransactions
                    }
                    totalPages={type === 'bank' ? allPages.BT : allPages.WT}
                    // tabbar={<Tabbar />}
                    // hasTabbar
                    // hasSearchOption={activeTab === 1}
                    hasCoinOption={type === 'wallet'}
                    // hasFlowOptions
                    // hasStatusOptions
                    state={
                        type === 'bank'
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
                    loading={type === 'bank' ? bankFetching : walletFetching}>
                    {type === 'bank' ? (
                        bankTransactions?.data?.length ? (
                            <TransactionTable
                                isWithdraw
                                data={bankTransactions.data}
                                // activeTab={activeTab}
                                type={type}
                                setDetailsModal={setDetailsModal}
                                setCancelModal={setCancelModal}
                            />
                        ) : null
                    ) : walletTransactions?.data?.length ? (
                        <TransactionTable
                            isWithdraw
                            data={walletTransactions.data}
                            // activeTab={activeTab}
                            type={type}
                            setDetailsModal={setDetailsModal}
                            setCancelModal={setCancelModal}
                        />
                    ) : null}
                </FilterLayout>
            </div>
            {
                width > 1024 ? (
                    <>
                        <ModalLayout
                            width={width > TABLET_SIZE ? '600px' : '100%'}
                            open={detailsModal.open}
                            onClose={onModalClosed}>
                            <TransactionDetails
                                type={type}
                                transaction={detailsModal.item}
                                onClose={onModalClosed}
                            />
                        </ModalLayout>
                        <ModalLayout
                            width={width > TABLET_SIZE ? '600px' : '100%'}
                            open={cancelModal.open}
                            onClose={() => setCancelModal(false)}>
                            <div className='flex w-full flex-col gap-8'>
                                <Text tid={'cancel-withdraw-transaction'} />
                                <Text tid={'cancel-withdraw-transaction-confirm'} />
                                <div className='flex w-full gap-4 items-center'>
                                    <button className='w-full rounded-lg py-2 hover:opacity-70 bg-cBlue' onClick={() => {
                                        onCancelTransaction(cancelModal.item, cancelModal.type)
                                        setCancelModal({ item: null, open: false, type: null })
                                    }}>
                                        <Text tid={'confirm'} />
                                    </button>
                                    <button className='w-full rounded-lg border py-2 hover:opacity-70' onClick={() => setCancelModal({ item: null, open: false, type: null })}>
                                        <Text tid={'decline'} />
                                    </button>
                                </div>
                            </div>
                        </ModalLayout>
                    </>
                ) : (
                    <>
                        <MobileModal isOpen={detailsModal.open} onClose={onModalClosed}>
                            <TransactionDetails
                                type={type}
                                transaction={detailsModal.item}
                                onClose={onModalClosed}
                            />
                        </MobileModal>
                        <MobileModal isOpen={cancelModal.open} onClose={() => setCancelModal(false)}>
                            <div className='flex w-full flex-col gap-8'>
                                <Text tid={'cancel-withdraw-transaction'} />
                                <Text tid={'cancel-withdraw-transaction-confirm'} />
                                <div className='flex w-full gap-4 items-center'>
                                    <button className='w-full rounded-lg border py-2 hover:opacity-70 ' onClick={() => onCancelTransaction(cancelModal.item, cancelModal.type)}>
                                        <Text tid={'confirm'} />
                                    </button>
                                    <button className='w-full rounded-lg border py-2 hover:opacity-70' onClick={() => setCancelModal({ item: null, open: false, type: null })}>
                                        <Text tid={'decline'} />
                                    </button>
                                </div>
                            </div>
                        </MobileModal>
                    </>
                )
            }
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
