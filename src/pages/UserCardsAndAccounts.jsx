import { useState } from 'react'
import Card from '../components/common/Card'
import Text from '../core/utils/Text'
import { Heading } from '../styles/newStyles/Dashboard.styled'
import BankAccounts from './accounts/banks/NewBankAccounts'
import WalletAccounts from './accounts/wallets/NewWalletAccounts'
import { useSearchParams } from 'react-router-dom'
import HintBox from '../components/common/HintBox'

export default function UserCardsAndAccounts() {
	const tabs = ['bank-accounts', 'wallet-accounts']
	const [searchParams] = useSearchParams()
	const [currentTab, setCurrentTab] = useState(searchParams.get('tab') || 'bank-accounts')

	return (
		<Card className='col-span-3 lg:overflow-y-auto' padding='px-0 py-2'>
			<Heading className='flex-col lg:flex-row lg:gap-x-10 items-start lg:items-center text-sm lg:border-b border-light-border dark:border-card-border p-5 lg:pb-4'>
				<div className='flex flex-col gap-y-4 w-full lg:w-2/3'>
					<h2 className='text-base font-semibold'>
						<Text tid='cards-accounts' />
					</h2>
					<HintBox type='hint' heading='hint' body={`${currentTab}-hint`} />
				</div>

				<div
					className={
						'self-start flex items-center w-full lg:w-1/3 lg:h-8 rounded-lg bg-gray-secondary dark:bg-white/10 p-1 mt-4 lg:mt-0'
					}
				>
					{tabs.map((tab) => {
						const active = currentTab === tab
						return (
							<div
								key={tab}
								className={`text-center w-1/2 rounded-lg px-2 py-0.5 lg:py-1 ${
									active && 'bg-cBlue text-white'
								} cursor-pointer`}
								onClick={() => setCurrentTab(tab)}
							>
								<Text tid={tab} className={'text-xs'} />
							</div>
						)
					})}
				</div>
			</Heading>

			<div className='p-5'>
				{currentTab === 'bank-accounts' ? <BankAccounts /> : null}
				{currentTab === 'wallet-accounts' ? <WalletAccounts /> : null}
			</div>
		</Card>
	)
}
