import {
	AddressBox,
	CoinNameWrapper,
	Label,
	NameCoin,
	WithdrawButton,
	WithdrawInput,
	Wrapper,
} from '../../styles/CoinOperationStyles'
import Text from '../../core/utils/Text'
import { SOCKET_URL } from '../../core/constants/urls'
import { FlexCenter, LoaderContainer } from '../../styles/CommonStyles'
import { useFees, useWithdrawOperations } from '../../core/hooks/useWalletOperations'
import { useWalletContext } from '../../core/contexts/wallet'
import { FeesContainer } from './CoinOperation'
import ChooseBankWalletModal from '../modals/ChooseBankWalletModal'
import { useEffect, useRef, useState } from 'react'
import { useQueryContext } from '../../core/contexts/query'
import { PulseLoader } from 'react-spinners'
import CurrencyBalance from './CurrencyBalance'
import { useAuthContext } from '../../core/contexts/auth'
import TwoFactorModal from '../modals/TwoFactorModal'

const WithdrawCoin = () => {
	const { coin } = useWalletContext()
	const { setToast } = useQueryContext()
	const ref = useRef()

	const {
		amount,
		onValueChange,
		wallets,
		chosenWallet,
		onOptionChanged,
		sendWithdraw,
		activeNetwork,
		loading,
		onBalanceClicked,
		resetAmount,
	} = useWithdrawOperations()

	const { profileSettings } = useAuthContext()
	const [authModal, setAuthModal] = useState(false)
	const onSubmitTwoFactorModal = (authData) => {
		sendWithdraw(authData)
	}

	useEffect(() => {
		if (coin) resetAmount()
	}, [coin])

	const { feeError } = useFees({ amount, network: activeNetwork })

	const hasOption = wallets.filter((o) => o.coin === coin)

	const hasError = !amount?.length || !chosenWallet || !activeNetwork?.network || !!feeError

	const onWithdrawClicked = () => {
		if (!amount || !chosenWallet) {
			setToast({
				isError: true,
				show: true,
				message: 'fill-inputs',
			})
		} else {
			if (profileSettings?.settings?.twoFactor?.onWithdraw) setAuthModal(true)
			else sendWithdraw()
			try {
				ref.current.reset()
			} catch (err) {}
		}
	}

	return (
		<>
			<Wrapper>
				<Label>
					<Text tid='amount' />
				</Label>
				<AddressBox>
					<WithdrawInput value={amount} onChange={onValueChange} />
					{coin && (
						<CoinNameWrapper>
							<FlexCenter>
								<img
									width='24px'
									height='24px'
									src={SOCKET_URL + `assets/icon/${coin?.toLowerCase()}.png`}
									alt={`${coin?.toLowerCase()}.png`}
								/>{' '}
								<NameCoin>{coin?.toUpperCase()}</NameCoin>
							</FlexCenter>
						</CoinNameWrapper>
					)}
				</AddressBox>
				<CurrencyBalance
					currency={coin}
					onBalanceClicked={onBalanceClicked}
					style={{ marginTop: '8px' }}
				/>
			</Wrapper>
			<Wrapper>
				<Label>
					<Text tid='destinationWalletAddress' />
				</Label>
				<ChooseBankWalletModal
					label={hasOption?.length ? 'choose-wallet' : 'no-wallets'}
					options={wallets}
					onOptionChange={onOptionChanged}
					ref={ref}
					type='wallet'
				/>
			</Wrapper>
			{!!activeNetwork?.network && <FeesContainer network={activeNetwork} amount={amount} />}

			<FlexCenter style={{ marginTop: '40px' }}>
				<WithdrawButton active={!hasError} onClick={onWithdrawClicked}>
					{loading ? (
						<LoaderContainer>
							<PulseLoader size={9} color='#4f31c5' />
						</LoaderContainer>
					) : (
						<Text tid='createWithdrawalRequest' />
					)}
				</WithdrawButton>
			</FlexCenter>
			<TwoFactorModal
				open={authModal}
				onSubmit={onSubmitTwoFactorModal}
				onClose={() => setAuthModal(false)}
				cause={'withdraw'}
			/>
		</>
	)
}

export default WithdrawCoin
