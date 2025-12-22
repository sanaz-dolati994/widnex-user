import { Label, WithdrawButton } from '../../styles/CoinOperationStyles'
import Text from '../../core/utils/Text'
import { AmountInput, CFlexCenter, CFlexStart, LoaderContainer } from '../../styles/CommonStyles'
import { useWalletContext } from '../../core/contexts/wallet'
import { useFees, useToomanOperation } from '../../core/hooks/useWalletOperations'
import { FeesContainer } from './CoinOperation'
import {PulseLoader} from "react-spinners";
import ChooseBankWalletModal from "../modals/ChooseBankWalletModal";
import {useRef, useState} from "react";
import {useQueryContext} from "../../core/contexts/query";
import CurrencyBalance from "./CurrencyBalance";
import {useProfileQuery} from "../../core/services/react-query/useProfileQuery";
import TwoFactorModal from "../modals/TwoFactorModal";
import {useAuth} from "../../pages/UserAuthentication";
import {useAuthContext} from "../../core/contexts/auth";


const ToomanOperation = () => {
	const { wallet } = useWalletContext()
	const { setToast } = useQueryContext()

	const ref = useRef()

	const {
		amount,
		onValueChange,
		banks,
		onOptionChanged,
		onOperationClicked,
		availableBanks,
		chosenBank,
		loading,
		onBalanceClicked,
	} = useToomanOperation()

	const { profileSettings } = useAuthContext()
	const [authModal, setAuthModal] = useState(false)
	const onSubmitTwoFactorModal = (authData) => {
		onOperationClicked(authData)
	}

	const { feeError } = useFees({ amount, network: availableBanks?.data[wallet.op] })

	const hasError = !amount?.length || !chosenBank || !!feeError

	const onOperationClick = () => {
		if (!amount || !chosenBank) {
			setToast({
				isError: true,
				show: true,
				message: 'fill-inputs',
			})
		}else {
			if (
				(wallet?.op === 'deposit' && profileSettings?.settings?.twoFactor?.onDeposit) ||
				(wallet?.op === 'withdraw' && profileSettings?.settings?.twoFactor?.onWithdraw)
			)
				setAuthModal(true)
			else
				onOperationClicked()
			try {
				ref.current.reset()
			} catch (err) {}
		}
	}

	return (
		<CFlexCenter style={{ width: '100%' }}>
			<CFlexStart style={{ width: '70%' }}>
				<Label>
					<Text tid='amount' />
				</Label>
				<AmountInput value={amount} onChange={onValueChange} />
				<CurrencyBalance currency={'irt'} onBalanceClicked={onBalanceClicked} />
			</CFlexStart>
			<CFlexStart style={{ width: '70%' }}>
				<Label>
					<Text tid={wallet?.op === 'deposit' ? 'depositWith' : 'destinationWalletAddress'} />
				</Label>
				<ChooseBankWalletModal
					label={banks?.length ? 'choose-bank' : 'no-banks'}
					options={banks}
					onOptionChange={onOptionChanged}
					ref={ref}
				/>
			</CFlexStart>

			{!!availableBanks?.data?.withdraw && (
				<FeesContainer
					isToman={true}
					amount={amount}
					type={wallet.op}
					network={availableBanks.data[wallet.op]}
				/>
			)}
			<WithdrawButton className={'mt-5'} active={!hasError} onClick={onOperationClick}>
				{loading ? (
					<LoaderContainer>
						<PulseLoader size={9} color='#0d1726' />
					</LoaderContainer>
				) : (
					<Text tid={wallet.op} />
				)}
			</WithdrawButton>
			<TwoFactorModal open={authModal} onSubmit={onSubmitTwoFactorModal} onClose={() => setAuthModal(false)} cause={wallet.op}/>
		</CFlexCenter>
	)
}

export default ToomanOperation
