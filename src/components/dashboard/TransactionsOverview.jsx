import Text from '../../core/utils/Text'
import { Link } from 'react-router-dom'
import TransactionHistory from './TransactionHistory'
import { Heading } from '../../styles/newStyles/Dashboard.styled'

export default function TransactionsOverview({
    heading,
    narrow = false,
    type,
    filter,
}) {
    return (
        <div className='p-4'>
            <Heading>
                <h2
                    className={`text-heading dark:text-pColor font-bold ${narrow ? 'text-sm' : ''
                        }`}>
                    <Text tid={heading} />
                </h2>

                <Link
                    to='/transaction-history'
                    className={`${narrow ? 'text-xs' : 'text-sm'} text-cBlue`}>
                    <Text tid='all-transactions' />
                </Link>
            </Heading>

            <TransactionHistory type={type} filter={filter} />
        </div>
    )
}
