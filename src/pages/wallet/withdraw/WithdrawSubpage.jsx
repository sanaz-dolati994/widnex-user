import { useWithdrawFiat } from '../utils/hooks'
import Text from '../../../core/utils/Text'
import Card from '../../../components/common/Card'
import TransactionsOverview from '../../../components/dashboard/TransactionsOverview'
import { HorizontalLine } from '../../../styles/newStyles/MobileModal.styled'
import { useState } from 'react'
import WithdrawFiat from './fiat/NewWithdrawFiat'
import WithdrawCoin from './coin/NewWithdrawCoin'
import { useSearchParams } from 'react-router-dom'

export default function WithdrawSubpage() {
	const [searchParams] = useSearchParams()
	const paramsTab = searchParams.get('tab')
	const initialTabState = !!paramsTab ? (paramsTab === 'coin' ? 1 : 0) : 0
	const [activeTab, setActiveTab] = useState(initialTabState)

	const handleTabChange = (index) => {
		setActiveTab(index)
	}

	const Components = [WithdrawFiat, WithdrawCoin]
	const ActiveComponent = Components[activeTab]

	const {
		amount,
		setAmount,
		bankAccount,
		setBankAccount,
		showError,
		onAction,
		profile,
		validAction,
		withdrawLoading,
		authModal,
		setAuthModal,
		onSubmitTwoFactorModal,
	} = useWithdrawFiat()

	return (
		<>
			<Card className={'col-span-3 lg:overflow-y-auto'}>
				<h2 className='font-semibold'>
					<Text tid='withdraw-type' />
				</h2>
				<div className='flex items-center justify-start gap-x-8 mt-4'>
					<TabBar activeTab={activeTab} onTabChange={handleTabChange} />
				</div>
				<HorizontalLine />

				<ActiveComponent />
			</Card>
			<Card padding='px-0' className={'col-span-2 lg:overflow-y-auto'}>
				<TransactionsOverview
					heading={'recent-transactions'}
					narrow
					type={activeTab === 0 ? 'bank' : 'wallet'}
					filter={'wallet-deposit'}
				/>
			</Card>
		</>
	)
}

const TABS = ['withdrawIrt', 'withdrawCoin']

const TabBar = ({ onTabChange, activeTab }) => {
	return TABS.map((tab, index) => {
		return (
			<h3
				className={`${activeTab === index ? 'text-cBlue border-cBlue' : 'border-transparent'
					} cursor-pointer border-b-2 transition pb-2 flex-1 text-center lg:flex-none`}
				onClick={onTabChange.bind(null, index)}
			>
				<Text tid={tab} />
			</h3>
		)
	})
}
