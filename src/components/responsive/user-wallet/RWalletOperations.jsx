import BankPortContextProvider from '../../../core/contexts/bankPort'
import { useWalletContext } from '../../../core/contexts/wallet'
import { TabContainer } from '../../../styles/CoinOperationStyles'
import { RMainTab } from '../../../styles/CommonStyles'
import { RCFlex } from '../../../styles/responsive/Common'
import Text from '../../../core/utils/Text'
import RCoinOperation from './RCoinOperation'
import RToomanOperation from './RToomanOperation'
import useTransactions from '../../../core/hooks/useTransaction'
import { useEffect } from 'react'

const RWalletOperations = () => {
	const { wallet, coin, setWallet } = useWalletContext()

	const onChangeTab = (type) => {
		setWallet((state) => ({ ...state, type }))
	}

	const { setBankQueries, setWalletQueries } = useTransactions()

	useEffect(() => {
		if (wallet.type === 'coin') {
			setWalletQueries((state) => ({ ...state, query: [wallet.op, coin] }))
		} else {
			setBankQueries((state) => ({ ...state, query: [wallet.op, null] }))
		}
	}, [wallet, coin])

	return (
		<BankPortContextProvider>
			<RCFlex>
				<TabContainer margin='0' style={{ width: '100%' }}>
					{types.map((type) => (
						<RMainTab onClick={() => onChangeTab(type)} width='50%' active={wallet.type === type}>
							<Text tid={wallet.op} /> <Text tid={type} />
						</RMainTab>
					))}
				</TabContainer>
				{wallet.type === 'coin' && <RCoinOperation />}
				{wallet.type === 'tooman' && <RToomanOperation />}
			</RCFlex>
		</BankPortContextProvider>
	)
}

const types = ['coin', 'tooman']

export default RWalletOperations
