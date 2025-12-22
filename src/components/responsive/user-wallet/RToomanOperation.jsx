import { useNavigate } from 'react-router-dom'
import { useBankPortContext } from '../../../core/contexts/bankPort'
import { useWalletContext } from '../../../core/contexts/wallet'
import { useFees, useToomanOperation } from '../../../core/hooks/useWalletOperations'
import CardLayout from '../../layouts/CardLayout'
import FilterDropdown from '../../modals/FilterDropdown'
import { Label, PortLogo } from '../../../styles/CoinOperationStyles'
import {
	AmountInput,
	CFlexCenter,
	CFlexStart,
	FlexCenter,
	LoaderContainer,
} from '../../../styles/CommonStyles'
import { RButton, RText } from '../../../styles/responsive/Common'
import Text from '../../../core/utils/Text'
import { FeesContainer } from '../../my-wallets/CoinOperation'
import { PulseLoader } from 'react-spinners'
import ChooseBankWalletModal from '../../modals/ChooseBankWalletModal'
import { useRef, useState } from 'react'
import { useAuthContext } from '../../../core/contexts/auth'
import TwoFactorModal from '../../modals/TwoFactorModal'

const RToomanOperation = () => {
	const ref = useRef()
	const { wallet } = useWalletContext()
	const { port, setPort } = useBankPortContext()

	const {
		amount,
		onValueChange,
		banks,
		onOptionChanged,
		onOperationClicked,
		chosenBank,
		availableBanks,
		loading,
	} = useToomanOperation()

	const { profileSettings } = useAuthContext()
	const [authModal, setAuthModal] = useState(false)
	const onSubmitTwoFactorModal = (authData) => {
		onOperationClicked(authData)
	}

	const navigate = useNavigate()

	const goToTransactions = () => {
		navigate('/transaction-history')
	}

	const { feeError } = useFees({ amount, network: availableBanks?.data[wallet.op] })

	const hasError = !amount?.length || !chosenBank || !!feeError

	const onOperationClick = () => {
		if (
			(wallet?.op === 'deposit' && profileSettings?.settings?.twoFactor?.onDeposit) ||
			(wallet?.op === 'withdraw' && profileSettings?.settings?.twoFactor?.onWithdraw)
		)
			setAuthModal(true)
		else onOperationClicked()
		try {
			ref.current.reset()
		} catch (err) {}
	}

	return (
		<CardLayout width='100%' height='100%'>
			<div style={{ padding: '0 10px' }}>
				{wallet.op === 'deposit' && (
					<>
						<Label>
							<Text tid='choose-port' />
						</Label>
						<FlexCenter>
							{availableBanks?.data?.banks?.map((bankGate) => (
								<PortLogo active={port === bankGate.id} onClick={() => setPort(bankGate.id)}>
									{bankLogos[bankGate.id] && (
										<img src={bankLogos[bankGate.id]} alt=' ' width='80%' />
									)}
								</PortLogo>
							))}
						</FlexCenter>
					</>
				)}
				<CFlexStart>
					<Label>
						<Text tid='amount' />
					</Label>
					<AmountInput value={amount} onChange={onValueChange} />
				</CFlexStart>
				<CFlexStart>
					<Label>
						<Text tid='destinationWalletAddress' />
					</Label>
					<ChooseBankWalletModal
						label={banks?.length ? 'choose-bank' : 'no-banks'}
						options={banks}
						onOptionChange={onOptionChanged}
						ref={ref}
					/>
				</CFlexStart>

				<div className={'text-xs'}>
					{!!availableBanks?.data?.withdraw && (
						<FeesContainer
							amount={amount}
							type={wallet.op}
							isToman={true}
							network={availableBanks?.data[wallet.op]}
						/>
					)}
				</div>

				<CFlexCenter>
					<RButton active={!hasError} disabled={hasError} width='80%' onClick={onOperationClick}>
						{loading ? (
							<LoaderContainer>
								<PulseLoader size={9} color='#0d1726' />
							</LoaderContainer>
						) : (
							<Text tid={wallet.op} />
						)}
					</RButton>
				</CFlexCenter>
				<CFlexCenter>
					<RText
						onClick={goToTransactions}
						color='#4f31c5'
						style={{ textDecoration: 'underline', margin: '10px 0' }}
					>
						<Text tid='see-transaction-history' />
					</RText>
				</CFlexCenter>
			</div>
			<TwoFactorModal
				open={authModal}
				onSubmit={onSubmitTwoFactorModal}
				onClose={() => setAuthModal(false)}
				cause={wallet.op}
			/>
		</CardLayout>
	)
}

const bankLogos = {
	zibal: require('../../../assets/images/zibal-logo.png'),
	nextPay: require('../../../assets/images/nextpay-logo.png'),
	vandar: require('../../../assets/images/vandar-logo.png'),
	payStar: require('../../../assets/images/payStar.png'),
}

export default RToomanOperation
