import CardLayout from '../layouts/CardLayout'
import { useWalletContext } from '../../core/contexts/wallet'
import { useMainContext } from '../../core/contexts/main'
import DepositCoin from './DepositCoin'
import WithdrawCoin from './WithdrawCoin'
import {useEffect, useMemo} from 'react'
import { useState } from 'react'
import ToomanOperation from './ToomanOperation'
import Text from '../../core/utils/Text'
import {
	Decoration,
	DecorationText,
	WalletOperationErrorContainer,
	Wrapper,
} from '../../styles/CoinOperationStyles'
import { formatNumber } from '../../core/utils/common'
import { useFees } from '../../core/hooks/useWalletOperations'
import useAvailableBanks from "../../core/hooks/useAvailableBanks";

const CoinOperation = () => {
	const { wallet } = useWalletContext()
	const {
		main: { lang },
	} = useMainContext()
	const { coin } = useWalletContext()

	const [title, setTitle] = useState('')

	useEffect(() => {
		if (wallet.op === 'deposit') {
			if (wallet.type === 'coin') {
				setTitle(
					`${lang === 'en' ? 'Deposit' : 'واریز'} ${
						!!coin ? coin?.toUpperCase() : lang === 'en' ? 'Coin' : 'ارز'
					}`
				)
			} else {
				setTitle(`${lang === 'en' ? 'Deposit toman' : 'واریز تومانی'} `)
			}
		} else {
			if (wallet.type === 'coin') {
				setTitle(
					`${lang === 'en' ? 'Withdraw' : 'برداشت'} ${
						!!coin ? coin?.toUpperCase() : lang === 'en' ? 'Coin' : 'ارز'
					}`
				)
			} else {
				setTitle(`${lang === 'en' ? 'Withdraw toman' : 'برداشت تومانی'} `)
			}
		}
	}, [wallet, coin, lang])

	return (
		<>
			{wallet.type === 'coin' ? (
				<>
					<CardLayout width='100%' height='fit-content' title={title}>
						{!!coin ? (
							<>{wallet.op === 'deposit' ? <DepositCoin /> : <WithdrawCoin />}</>
						) : (
							<p className={'py-2 px-5'}>
								<Text tid={'select-coin-from-list'} />
							</p>
						)}
					</CardLayout>
				</>
			) : (
				<>
					<CardLayout width='100%' height='fit-content' title={title}>
						<ToomanOperation />
					</CardLayout>
				</>
			)}
		</>
	)
}

export const FeesContainer = ({ network, amount, type = 'withdraw', isToman = false }) => {

	const isWithdraw = type === 'withdraw'

	const { availableBanks } = useAvailableBanks()

	if (!network) {
		isToman = true
	}

	const { coin } = useWalletContext()

	const { fee, feeFactor, feeMax, max, min, floatAmount, calculateFees, feeError } = useFees({
		network,
		amount,
	})

	const finalAmount = useMemo(() => {
		let res = 0
		const isWageIncluded = availableBanks?.data?.isBankWageIncluded
		if (isWithdraw) res = floatAmount(amount) - fee
		else {
			if (isWageIncluded) res = floatAmount(amount) + fee
			else res = floatAmount(amount) - fee
		}
		return formatNumber(res)
	}, [availableBanks, amount, fee])

	return (
		<div className={'w-full'}>
			<Wrapper style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
				<Decoration />
				<DecorationText>
					<Text tid={isWithdraw ? 'maxWithdraw' : 'maxDeposit'} />:{' '}
					<span dir={isToman ? 'rtl' : 'ltr'}>
						{formatNumber(max)} {!!isToman ? <Text tid='toman' /> : coin}
					</span>
				</DecorationText>
			</Wrapper>
			<Wrapper style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
				<Decoration />
				<DecorationText>
					<Text tid={isWithdraw ? 'minWithdraw' : 'minDeposit'} />:{' '}
					<span dir={isToman ? 'rtl' : 'ltr'}>
						{formatNumber(min)} {!!isToman ? <Text tid='toman' /> : coin}
					</span>
				</DecorationText>
			</Wrapper>
			{!!!!amount?.length && (
				<>
					<Wrapper style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
						<Decoration />
						<DecorationText>
							<Text tid='transactionFee' />:{' '}
							<span dir={isToman ? 'rtl' : 'ltr'}>
								{formatNumber(fee)} {!!isToman ? <Text tid='toman' /> : coin}
							</span>
						</DecorationText>
					</Wrapper>
					<Wrapper style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
						<Decoration />
						<DecorationText>
							<Text tid='finalAmount' />:{' '}
							<span dir={isToman ? 'rtl' : 'ltr'}>
								{formatNumber(type === 'withdraw' ? floatAmount(amount) - fee : floatAmount(amount) + fee)} {!!isToman ? <Text tid='toman' /> : coin}
							</span>
						</DecorationText>
					</Wrapper>
				</>
			)}

			{!(!isWithdraw && !isToman) && !!feeError && (
				<Wrapper style={{ display: 'flex', alignItems: 'center', marginTop: '50px' }}>
					<WalletOperationErrorContainer>
						<Text tid={feeError} />
					</WalletOperationErrorContainer>
				</Wrapper>
			)}
		</div>
	)
}

export default CoinOperation
