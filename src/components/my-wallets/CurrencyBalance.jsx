import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { DText } from '../../styles/CommonStyles'
import Text from '../../core/utils/Text'
import { formatNumber } from '../../core/utils/common'

const CurrencyBalance = (props) => {
	const { currency, onBalanceClicked } = props

	const { data: profile } = useProfileQuery()
	const [balance, setBalance] = useState(0)

	useEffect(() => {
		if (profile && currency) {
			let _balance = 0
			if (currency === 'irt') _balance = profile?.balance
			else {
				const coin = profile?.coins?.find((c) => c.coin === currency)
				if (coin) _balance = coin.amount
			}
			setBalance(_balance)
		}
	}, [profile, currency])

	return (
		<BalanceWrapper onClick={() => onBalanceClicked(balance)} {...props}>
			<DText>
				<Text tid={'balance'} /> :
			</DText>
			<DText style={{ margin: '2px 5px 0 5px' }}>{formatNumber(balance)}</DText>
		</BalanceWrapper>
	)
}

const BalanceWrapper = styled.div`
	display: flex;
	align-items: center;
	min-height: 32px;
	border-radius: 4px;
	padding: 0 10px;
	cursor: pointer;
`

export default CurrencyBalance
