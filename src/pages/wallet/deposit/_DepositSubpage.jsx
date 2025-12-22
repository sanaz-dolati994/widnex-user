import { useEffect, useState } from 'react'
import Card from '../../../components/common/Card'
import TransactionsOverview from '../../../components/dashboard/TransactionsOverview'
import Text from '../../../core/utils/Text'
import { HorizontalLine } from '../../../styles/newStyles/MobileModal.styled'
import { useDepositFiat } from '../utils/hooks'
import { useMainContext } from '../../../core/contexts/main'
import TwoFactorModal from '../../../components/modals/TwoFactorModal'
import DepositFiat from './fiat/NewDepositFiat'
import DepositCoin from './coin/NewDepositCoin'
import { useSearchParams } from 'react-router-dom'

export default function DepositSubpage() {
	const {
		main: { lang },
	} = useMainContext()
	const [searchParams] = useSearchParams()
	const paramsTab = searchParams.get('tab')
	const initialTabState = !!paramsTab ? (paramsTab === 'coin' ? 1 : 0) : 0
	const [activeTab, setActiveTab] = useState(initialTabState)

	const {
		step,
		amount,
		setAmount,
		bankAccount,
		setBankAccount,
		depositType,
		setDepositType,
		depositIdModal,
		onFinish,
		onBack,
		onAction,
		depositLoading,
		authModal,
		setAuthModal,
		onSubmitTwoFactorModal,
		port,
		setPort,
		ports,
		newActionHandler,
	} = useDepositFiat()

	useEffect(() => {
		if (activeTab === 0) {
			setDepositType('bank-gateway')
		} else if (activeTab === 2) {
			setDepositType('deposit-id')
		} else setDepositType('')
	}, [activeTab])

	const handleTabChange = (index) => {
		if (index === 0) {
			setDepositType('bank-gateway')
		} else if (index === 2) {
			setDepositType('deposit-id')
		} else setDepositType('')

		setActiveTab(index)
	}

	const Components = [DepositFiat, DepositCoin, DepositFiat]
	const ActiveComponent = Components[activeTab]

	return (
		<>
			<Card className={'col-span-3 lg:h-full lg:overflow-y-auto'}>
				<h2 className='font-semibold'>
					<Text tid='deposit-type' />
				</h2>
				<div className='flex items-center justify-start gap-x-8 mt-4'>
					<TabBar activeTab={activeTab} onTabChange={handleTabChange} />
				</div>
				<HorizontalLine />

				<ActiveComponent depositType={depositType} />

				<TwoFactorModal
					open={authModal}
					onSubmit={onSubmitTwoFactorModal}
					onClose={() => setAuthModal(false)}
					cause={'deposit'}
				/>
			</Card>
			<Card padding='px-0' className={'col-span-2 lg:h-full lg:overflow-y-auto'}>
				<TransactionsOverview
					heading={activeTab === 0 ? 'recent-transactions' : 'recent-deposits'}
					narrow
					type={activeTab === 0 ? 'bank' : 'wallet'}
					filter={'wallet-deposit'}
				/>
			</Card>
		</>
	)
}

const TABS = ['depositIrt', 'depositCoin', 'deposit-id']

const TabBar = ({ onTabChange, activeTab }) => {
	return TABS.map((tab, index) => {
		return (
			<h3
				className={`${
					activeTab === index ? 'text-cBlue border-cBlue' : 'border-transparent'
				} cursor-pointer border-b-2 transition pb-2 flex-1 text-center lg:flex-none`}
				onClick={onTabChange.bind(null, index)}
			>
				<Text tid={tab} />
			</h3>
		)
	})
}
