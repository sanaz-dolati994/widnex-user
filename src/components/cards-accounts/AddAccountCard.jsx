import { useEffect, useState, useReducer, useRef } from 'react'
import FilterDropdown from '../modals/FilterDropdown'
import {
	Prefix,
	BankInputClose,
	Error,
	Body,
	Column,
	Label,
	Input,
	AddBtn,
} from '../../styles/AccountsAndCardsStyles'
import Text from '../../core/utils/Text'
import { useMarketQuery } from '../../core/services/react-query/useMarketQuery'
import { useMainContext } from '../../core/contexts/main'
import { Flex } from '../../styles/CommonStyles'
import { p2e } from '../../core/utils/common'
import getBankInfo from '../../packages/bank-service/Bank'
import { useQueryContext } from '../../core/contexts/query'
import { useAvailableCoinsQuery } from '../../core/services/react-query/useAvailableCoinsQuery'
import { useAuthContext } from '../../core/contexts/auth'
import TwoFactorModal from '../modals/TwoFactorModal'

const initialState = {
	bank: 'normal',
	sheba: 'normal',
	wallet: 'normal',
}

const AddAccountCard = ({ activeTab, inputValues, setInputValues, onAddWalletOrBank }) => {
	const {
		main: { lang },
	} = useMainContext()
	const { setToast } = useQueryContext()
	const networkRef = useRef()

	const statusReducer = (state, action) => {
		switch (action.type) {
			case 'bank':
				return { ...state, bank: action.payload }
			case 'sheba':
				return { ...state, sheba: action.payload }
			case 'wallet':
				return { ...state, wallet: action.payload }
			default:
				return state
		}
	}

	const [validationStatus, setValidationStatus] = useReducer(statusReducer, initialState)
	const [selectedCoin, setSelectedCoin] = useState()

	const [coins, setCoins] = useState([])
	const { data: coinsList } = useMarketQuery()

	/**
	 * network list of selected coin stuff
	 */
	const { data: availableCoins } = useAvailableCoinsQuery()
	const [networks, setNetworks] = useState([])
	const [selectedNetwork, setSelectedNetwork] = useState(null)

	useEffect(() => {
		if (availableCoins?.data?.length) {
			const coinData = availableCoins.data.find((c) => c.id === selectedCoin?.toLowerCase())

			if (coinData) {
				setNetworks(coinData.withdrawList?.map((c) => c.network))
			}
		}
	}, [availableCoins, selectedCoin])

	const [validForm, setValidForm] = useState(false)

	useEffect(() => {
		const valid =
			(validationStatus.bank === 'valid' && validationStatus.sheba === 'valid') ||
			(validationStatus.wallet === 'valid' && selectedNetwork)
		setValidForm(valid)
	}, [validationStatus])

	useEffect(() => {
		setCoins(coinsList?.map((coin) => coin.id))
	}, [coinsList])

	useEffect(() => {
		setInputValues((state) => ({ ...state, label: '' }))
	}, [activeTab])

	const onOptionChanged = (idx) => {
		if (coins) {
			setSelectedCoin(coins[idx].toUpperCase())
			setSelectedNetwork(null)
			try {
				networkRef.current.reset()
			} catch (err) { }
		}
		setInputValues((state) => ({ ...state, wallet: '' }))
		setValidationStatus({ type: 'wallet', payload: 'normal' })
	}

	const onInputValueChange = (e, type) => {
		let value
		switch (type) {
			case 'bank':
				value = p2e(e?.target?.value)

				value = value.replace(/[^\d]/g, '').substring(0, 16)
				value = value.match(/\d{1,4}/g)

				if (value !== null) {
					value = value.join(' ')
				}

				if (value?.length === 19) {

					const validBank = getBankInfo(value)
					if (validBank) {
						setValidationStatus({ type: 'bank', payload: 'valid' })
					} else {
						setValidationStatus({ type: 'bank', payload: 'bank-error' })
					}
				}

				setInputValues((state) => ({ ...state, bank: value }))
				break
			case 'sheba':
				value = p2e(e?.target?.value)
				if (value.length === 0) {
					setValidationStatus({ type: 'sheba', payload: 'normal' })
				} else if (value.length < 24) {
					setValidationStatus({ type: 'sheba', payload: 'error' })
				} else if (value.length >= 24) {
					setValidationStatus({ type: 'sheba', payload: 'valid' })
					if (value.length > 24) {
						return
					}
				}
				setInputValues((state) => ({ ...state, sheba: value }))
				break
			case 'wallet':
				value = p2e(e?.target?.value)
				setInputValues((state) => ({ ...state, wallet: value }))
				break
			case 'label':
				value = e?.target?.value
				setInputValues((state) => ({ ...state, label: value }))
				break
			default:
				break
		}
	}

	useEffect(() => {
		if (inputValues.wallet) {
			validateWalletAddress()
		}
	}, [inputValues])

	const clearInput = () => {
		setInputValues((state) => ({ ...state, bank: '' }))
		setValidationStatus({ type: 'bank', payload: 'normal' })
	}

	const validateWalletAddress = () => {
		if (inputValues.wallet.length === 0) {
			setValidationStatus({ type: 'wallet', payload: 'normal' })
		} else {
			if (inputValues.wallet.length < 16) {
				setValidationStatus({ type: 'wallet', payload: 'error' })
			} else {
				setValidationStatus({ type: 'wallet', payload: 'valid' })
			}
		}
	}

	const { profileSettings } = useAuthContext()
	const [authModal, setAuthModal] = useState(false)
	const onSubmitTwoFactorModal = (authData) => {
		onAddWalletOrBank(selectedCoin, selectedNetwork, authData)
	}

	const onAddClicked = () => {
		if (validForm) {
			if (
				(profileSettings?.settings?.twoFactor?.onWhiteListWallet && activeTab === 2) ||
				(profileSettings?.settings?.twoFactor?.onWhiteListAccount && activeTab === 1)
			)
				setAuthModal(true)
			else onAddWalletOrBank(selectedCoin, selectedNetwork)
			setValidationStatus(initialState)
		} else {
			setToast({
				isError: true,
				show: true,
				message: 'fill-inputs',
			})
		}
	}

	const accountCauses = ['WHITE_LIST_ACCOUNT', 'WHITE_LIST_WALLET']

	return (
		<Body className={'flex-wrap justify-center md:justify-start gap-5 mt-0 pt-5'}>
			<Flex className={'w-full'} wrap>
				<Column active={activeTab === 1}>
					<Label>
						<Text tid='card-number' />
					</Label>
					<Input
						direction='ltr'
						value={inputValues.bank}
						onChange={(e) => onInputValueChange(e, 'bank')}
						borderColor={validationStatus.bank}
					/>
					{inputValues.bank && <BankInputClose size={22} onClick={clearInput} />}
					{validationStatus.bank === 'error' && (
						<Error>
							<Text tid='bank-error' />
						</Error>
					)}

					{validationStatus.bank === 'bank-error' && (
						<Error>
							<Text tid='not-valid-bank-number' />
						</Error>
					)}
				</Column>

				<Column active={activeTab === 1}>
					<Label>
						<Text tid='shaba-number' />
					</Label>
					<Prefix>IR</Prefix>
					<Input
						direction='ltr'
						letterSpacing='1.5px'
						value={inputValues.sheba}
						onChange={(e) => onInputValueChange(e, 'sheba')}
						borderColor={validationStatus.sheba}
					/>
					{validationStatus.sheba === 'error' && (
						<Error>
							<Text tid='sheba-error' />
						</Error>
					)}
				</Column>

				<Column active={activeTab === 2}>
					<Label margin='0 25px'>
						<Text tid='coin' />
					</Label>
					{coins?.length ? (
						<FilterDropdown
							width='100%'
							options={coinsList}
							type='buy'
							isCoin
							onOptionChanged={onOptionChanged}
						/>
					) : (
						<Input
							readOnly
							defaultValue={lang === 'en' ? 'No coins available' : 'هیچ ارزی موجود نیست'}
						/>
					)}
				</Column>

				<Column active={activeTab === 2}>
					<Label margin='0 25px'>
						<Text tid='network' />
					</Label>
					<FilterDropdown
						options={networks}
						defaultOption='selectNetwork'
						onOptionChanged={(idx) => setSelectedNetwork(networks[idx])}
						width='100%'
						ref={networkRef}
					/>
				</Column>

				<Column active={activeTab === 2}>
					<Label>
						<Text tid='wallet-address' />
					</Label>
					<Input
						value={inputValues.wallet}
						borderColor={validationStatus.wallet}
						onChange={(e) => onInputValueChange(e, 'wallet')}
					/>
					{validationStatus.wallet === 'error' && (
						<Error>
							<Text tid='wallet-error' />
						</Error>
					)}
				</Column>

				<Column active>
					<Label>
						<Text tid='label' />
					</Label>
					<Input
						value={inputValues.label}
						borderColor='normal'
						onChange={(e) => onInputValueChange(e, 'label')}
					/>
				</Column>

				<Column active>
					<AddBtn active={validForm} onClick={onAddClicked}>
						<Text tid={activeTab === 1 ? 'add-card' : 'add-wallet'} />
					</AddBtn>
				</Column>
			</Flex>

			<TwoFactorModal
				open={authModal}
				onSubmit={onSubmitTwoFactorModal}
				onClose={() => setAuthModal(false)}
				cause={accountCauses[activeTab - 1]}
			/>
		</Body>
	)
}

export default AddAccountCard
