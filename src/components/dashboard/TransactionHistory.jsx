import useTransactions from '../../core/hooks/useTransaction'
import FilterLayout from '../../components/layouts/FilterLayout'
import { useState } from 'react'
import TransactionTable from '../transactions/TransactionsTable'
import Text from '../../core/utils/Text'
import {
    FaArrowDown,
    FaArrowUp,
    FaChevronDown,
    FaChevronUp,
} from 'react-icons/fa'
import { formatDate, formatNumber } from '../../core/utils/common'
import { useMainContext } from '../../core/contexts/main'
import { Column } from '../../styles/TableStyle'
import { FlexCenter } from '../../styles/CommonStyles'
import { SOCKET_URL } from '../../core/constants/urls'
import { Market } from '../../styles/OrdersStyle'

export default function TransactionHistory({ type = 'bank', filter = '' }) {
    const {
        main: { lang },
    } = useMainContext()

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

    return (
        <div className='relative mt-6'>
            {type === 'bank' && bankTransactions?.data?.length > 0 ? (
                <TransactionItems
                    type='bank'
                    data={bankTransactions.data}
                    filter={filter}
                />
            ) : type === 'wallet' && walletTransactions?.data?.length > 0 ? (
                <TransactionItems
                    type='wallet'
                    data={walletTransactions.data}
                    filter={filter}
                />
            ) : (
                <div className='text-center my-5'>
                    <Text tid='no-data' />
                </div>
            )}
        </div>
    )
}

const TransactionItems = ({ type, data = [], filter }) => {
    const {
        main: { lang },
    } = useMainContext()

    let filteredBankData = [...data]
    let filteredWalletData = [...data]
    if (filter === 'wallet-deposit') {
        filteredWalletData = filteredWalletData.filter(
            (item) => item.flow === 'deposit'
        )
    }
    if (
        (type === 'wallet' && filteredWalletData.length === 0) ||
        (type === 'bank' && filteredBankData.length === 0)
    )
        return (
            <div className='text-center my-5'>
                <Text tid='no-data' />
            </div>
        )

    const renderedItems =
        type === 'wallet'
            ? filteredWalletData.map((transaction) => {
                  return (
                      <div
                          key={transaction._id}
                          className='flex items-center justify-between gap-x-2 mb-3 last:mb-0'>
                          <img
                              src={
                                  SOCKET_URL +
                                  `assets/icon/${transaction.coin}.png`
                              }
                              alt=' '
                              className='h-10 w-auto'
                          />

                          <div className='flex flex-col gap-1 ml-auto'>
                              <Market>{transaction.coin.toUpperCase()}</Market>
                              <p className='flex items-center gap-x-1 text-black/50 dark:text-pColor/40 text-sm'>
                                  <span>
                                      {formatDate(
                                          transaction.createdAt,
                                          'time',
                                          lang === 'en' ? 'en-US' : 'fa-IR'
                                      )}
                                  </span>
                                  <span>-</span>
                                  <span>
                                      {formatDate(
                                          transaction.createdAt,
                                          'date',
                                          lang === 'en' ? 'en-US' : 'fa-IR'
                                      )}
                                  </span>
                              </p>
                          </div>

                          <div className='flex items-center gap-x-1'>
                              <span className='text-lg font-bold text-heading dark:text-pColor'>
                                  {transaction.amount
                                      ? formatNumber(transaction.amount)
                                      : '--'}
                              </span>

                              {transaction.flow === 'deposit' ? (
                                  <FaChevronUp color='#11f344' size={11} />
                              ) : (
                                  <FaChevronDown color='#ce2331' size={11} />
                              )}
                          </div>
                      </div>
                  )
              })
            : filteredBankData.map((transaction) => {
                  return (
                      <div
                          key={transaction._id}
                          className='flex items-center justify-between gap-x-2 mb-2 last:mb-0'>
                          <div className='w-10 h-10 rounded-full bg-primary dark:bg-heading flex items-center justify-center'>
                              {transaction.flow === 'deposit' ? (
                                  <FaArrowUp color='#11f344' />
                              ) : (
                                  <FaArrowDown color='#ce2331' />
                              )}
                          </div>

                          <div className='flex flex-col gap-2 ml-auto'>
                              <Text
                                  tid={transaction.flow + 'Fiat'}
                                  className='text-heading dark:text-pColor font-semibold'
                              />
                              <p className='flex items-center gap-x-1 text-black/50 dark:text-pColor/40 text-sm'>
                                  <span>
                                      {formatDate(
                                          transaction.createdAt,
                                          'time',
                                          lang === 'en' ? 'en-US' : 'fa-IR'
                                      )}
                                  </span>
                                  <span>-</span>
                                  <span>
                                      {formatDate(
                                          transaction.createdAt,
                                          'date',
                                          lang === 'en' ? 'en-US' : 'fa-IR'
                                      )}
                                  </span>
                              </p>
                          </div>

                          <div className='flex items-center gap-x-1'>
                              <span className='text-lg font-bold text-heading dark:text-pColor'>
                                  {transaction.amount
                                      ? formatNumber(transaction.amount)
                                      : '--'}
                              </span>
                              <Text
                                  tid='tooman'
                                  className='text-black/50 dark:text-pColor/40 text-sm'
                              />
                              {transaction.flow === 'deposit' ? (
                                  <FaChevronUp color='#11f344' size={11} />
                              ) : (
                                  <FaChevronDown color='#ce2331' size={11} />
                              )}
                          </div>
                      </div>
                  )
              })

    return renderedItems
}
