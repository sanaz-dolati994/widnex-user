import {useEffect, useMemo, useState} from 'react'
import {
	useAvailableCoinTokensQuery,
	useBankDepositMutation,
	useBankWithdrawMutation,
	useDepositMutation,
} from '../services/react-query/useWalletQuery'
import { useWalletContext } from '../contexts/wallet'
import { useProfileQuery } from '../services/react-query/useProfileQuery'
import { useWithdrawMutation } from '../services/react-query/useWalletQuery'
import { formatNumber, p2e, stringToNumber } from '../utils/common'
import { useBankPortContext } from '../contexts/bankPort'
import { useQueryContext } from '../contexts/query'
import { useAvailableCoinsQuery } from '../services/react-query/useAvailableCoinsQuery'
import { useAvailableBanksQuery } from '../services/react-query/useAvailableBanksQuery'
import { useMainContext } from '../contexts/main'
import { onInputValueChangeUtil } from '../utils/useInputValueChange'
import { useRunAfterUpdate } from './useRunAfterUpdate'

export const useFees = ({ network = {}, amount } = {}) => {

	const { feeFactor = 0, feeMax = 0, max = 0, min = 0 } = network

	const [fee, setFee] = useState('')

	const [feeError, setFeeError] = useState(null)

	const floatAmount = (amount) => (!!amount ? parseFloat(amount.replaceAll(',', '')) : 0)

	const calculateFees = () => {
		handleFeeError()

		if (!amount) return

		let calculatedFee = (feeFactor * floatAmount(amount)) / 100

		if (calculatedFee > feeMax) {
			calculatedFee = feeMax
		}

		setFee(calculatedFee)
	}

	const handleFeeError = () => {
		setFeeError(null)

		const floatedAmount = floatAmount(amount)
		let error = null

		if (floatedAmount > max) {
			error = 'amount-reached-max'
		} else if (floatedAmount < min) {
			error = 'amount-should-reach-min'
		}

		setFeeError(floatedAmount > 0 ? error : null)
	}

	useEffect(calculateFees, [network, amount])

	return {
		fee,
		feeFactor,
		feeError,
		feeMax,
		max,
		min,
		floatAmount,
		calculateFees,
	}
}

const useDepositOperations = () => {
	const { wallet, coin } = useWalletContext()
	const { setToast } = useQueryContext()
	const {
		main: { lang },
	} = useMainContext()

	const [qrAddress, setQrAddress] = useState(null)
	const [activeNetwork, setActiveNetwork] = useState(null)

	const [depositData, setDepositData] = useState(null)
	// const [depositList, setDepositList] = useState([])

	const [feesInfo, setFeesInfo] = useState({})

	const [networks, setNetworks] = useState([])

	const {
		data: availableCoins,
		isFetching: availableCoinsLoading,
		refetch: refetchAvailableCoins,
	} = useAvailableCoinsQuery()

	useEffect(() => {
		setActiveNetwork({})
		if (availableCoins?.data?.length) {
			const selectedCoin = availableCoins.data.filter((item) => item.symbol === coin)

			if (selectedCoin?.length) {
				const network = selectedCoin[0].depositList

				setNetworks(network)
				setActiveNetwork(network[0])
			}
		}
	}, [coin, availableCoins])

	const getFeesInfo = () => {
		const selectedNetwork = activeNetwork?.network || coin

		if (availableCoins?.data?.length) {
			const filter = availableCoins.data.filter((item) => item.symbol === coin)

			if (filter?.length) {
				let { depositList, withdrawList } = filter[0]

				depositList = depositList.filter((item) => item.network === selectedNetwork)
				withdrawList = withdrawList.filter((item) => item.network === selectedNetwork)

				setFeesInfo({
					depositFees: depositList?.length ? depositList[0] : {},
					withdrawFees: depositList?.length ? withdrawList[0] : {},
				})
			}
		}
	}

	useEffect(getFeesInfo, [coin, activeNetwork])
	useEffect(refetchAvailableCoins, [])

	const onDepositSuccess = (res) => {
		setDepositData(res.data?.data)
	}

	useEffect(() => {
		if (activeNetwork?.network) {
			deposit({ coin, network: activeNetwork.network || coin })
		}
	}, [activeNetwork])

	const { mutate: deposit, isError: depositError, isLoading } = useDepositMutation(onDepositSuccess)

	useEffect(() => {
		setDepositData(null)
		// setDepositList([])
	}, [depositError])

	useEffect(() => {
		if (coin) {
			// setDepositList([])
			setDepositData(null)
		}
	}, [coin])

	const getQrAddress = () => {
		const noDeposit = lang === 'en' ? 'No address available...' : 'در حال حاضر آدرسی موجود نیست...'
		// if (depositList.length) {
		// 	if (activeNetwork) {
		// 		const address = depositList.find((d) => d.blockchain === activeNetwork.blockchain)?.address
		// 		return address ? address : noDeposit
		// 	}
		// 	return 'no deposit'
		// } else {
		return depositData?.address ? depositData.address : noDeposit
		// }
	}

	useEffect(() => {
		setQrAddress(getQrAddress())
	}, [coin, activeNetwork, depositData])

	const copyToClipboard = (navigator) => {
		navigator.clipboard.writeText(depositData?.address)
		setToast({
			isError: false,
			show: true,
			message: 'copy-success',
		})
	}

	return {
		activeDepositNetwork: activeNetwork,
		depositNetworks: networks,
		isLoading,
		fees: feesInfo,
		getFees: getFeesInfo,
		availableCoins,
		refetchAvailableCoins,
		// depositList,
		depositData,
		setActiveNetwork,
		getQrAddress,
		copyToClipboard,
		qrAddress,
	}
}

const useWithdrawOperations = () => {
	const { coin } = useWalletContext()
	const { setToast } = useQueryContext()

	const [amount, setAmount] = useState('')
	const [chosenWallet, setChosenWallet] = useState(null)
	const [wallets, setWallets] = useState([])
	const [activeNetwork, setActiveNetwork] = useState({})

	const { data: profile } = useProfileQuery()

	const { mutate: withdraw, isLoading: loading } = useWithdrawMutation({
		callback: () => {
			setAmount('')
			setActiveNetwork({})
			setChosenWallet(null)
		},
	})

	const { data: availableCoins } = useAvailableCoinsQuery()

	useEffect(() => {
		if (coin && chosenWallet && availableCoins) {
			const coinData = availableCoins.data?.find((c) => c.id === coin)

			if (!coinData) {
				setToast({
					isError: true,
					show: true,
					message: 'coin-not-found',
				})
				return
			}

			const walletNetwork = chosenWallet.network

			if (!walletNetwork) {
				setToast({
					isError: true,
					show: true,
					message: 'wallet-without-network',
				})
				return
			}

			const chosenNetwork = coinData.withdrawList?.find((n) => n.network === walletNetwork)
			setActiveNetwork(chosenNetwork)
		}
	}, [coin, chosenWallet, availableCoins])

	useEffect(() => {
		if (profile && coin) {
			setWallets(profile?.wallets)
			setChosenWallet(null)
		}
	}, [profile, coin])

	const runAfterUpdate = useRunAfterUpdate()
	const onValueChange = (e) => {
		let val = onInputValueChangeUtil(e, runAfterUpdate)
		setAmount(val)
	}

	const onWalletValueChange = (e) => {
		let val = e?.target?.value
		setChosenWallet(val)
	}

	const onOptionChanged = (idx) => {
		setChosenWallet(wallets[idx])
	}

	const sendWithdraw = (authData = null) => {
		if (amount?.length && chosenWallet && coin && chosenWallet.network) {
			let floatAmount = parseFloat(stringToNumber(amount))
			const payload = {
				amount: floatAmount,
				coin,
				wallet: chosenWallet.id,
				network: chosenWallet.network,
				blockchain: activeNetwork?.blockchain,
			}
			if (authData?.otp) payload.otp = authData.otp
			if (authData?.ga) payload.ga = authData.ga
			withdraw(payload)
			setChosenWallet(null)
			setActiveNetwork({})
			setAmount('')
		}
	}

	const onBalanceClicked = (_amount) => {
		setAmount(formatNumber(_amount))
	}

	const resetAmount = () => setAmount('')

	return {
		setActiveNetwork,
		activeNetwork,
		onWalletValueChange,
		amount,
		setAmount,
		onValueChange,
		wallets,
		chosenWallet,
		setChosenWallet,
		onOptionChanged,
		sendWithdraw,
		loading,
		onBalanceClicked,
		resetAmount,
	}
}

const useToomanOperation = () => {
	const { data: profile } = useProfileQuery()
	const { wallet } = useWalletContext()
	const { port } = useBankPortContext()
	const { setToast } = useQueryContext()

	const onDepositSuccess = (res) => {
		setToast({
			isError: false,
			show: true,
			message: 'sendto-bank-port',
		})
		window.location.href = res?.data?.data?.link
	}

	const { mutate: withdraw, isLoading: withdrawLoading } = useBankWithdrawMutation({
		callback: () => {
			setAmount('')
			setChosenBank(null)
		},
	})

	const { mutate: deposit, isLoading: depositLoading } = useBankDepositMutation(onDepositSuccess)

	const [chosenBank, setChosenBank] = useState(null)
	// const [banks, setBanks] = useState([])
	// const [shebas, setShebas] = useState([])
	const [amount, setAmount] = useState('')

	const {
		data: availableBanks,
		isFetching: availableBanksLoading,
		refetch: refetchAvailableBanks,
	} = useAvailableBanksQuery()

	// useEffect(() => {
	// 	if (profile) {
	// 		wallet.op === 'deposit' && setBanks(profile?.banks.map((b) => b.cardNo))
	// 		wallet.op === 'withdraw' && setShebas(profile?.banks.map((b) => b.shebaNo))
	// 	}
	// }, [profile, wallet])

	const onValueChange = (e) => {
		let val = p2e(e?.target?.value)
		let numParts = val.split('.')
		numParts[0] = numParts[0].replaceAll(',', '')
		numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		setAmount(numParts.join('.'))
	}

	const verifiedBanks = useMemo(() => {
		return profile?.banks?.filter((item) => item.status === 'VERIFIED') || []
	}, [profile])


	const onOptionChanged = (idx) => {
		const bank = verifiedBanks[idx]
		setChosenBank(wallet.op === 'deposit' ? bank.cardNo : bank.shebaNo)
		// setChosenBank(wallet.op === 'deposit' ? banks[idx] : shebas[idx])
	}

	const onOperationClicked = (authData = null) => {
		if (depositLoading || withdrawLoading) {
			return
		}
		if (amount && chosenBank) {
			const account = profile?.banks?.find(
				(b) => b.shebaNo === chosenBank || b.cardNo === chosenBank
			)?.id
			if (account) {
				let payload = { amount: parseFloat(stringToNumber(amount)), account }
				if (authData?.otp) payload.otp = authData.otp
				if (authData?.ga) payload.ga = authData.ga
				if (wallet.op === 'withdraw') {
					withdraw(payload)
				} else {
					payload = { ...payload, gateway: port }
					deposit(payload)
				}
			}
		}
	}

	const onBalanceClicked = (_amount) => {
		setAmount(formatNumber(_amount))
	}

	return {
		availableBanks,
		availableBanksLoading,
		refetchAvailableBanks,
		amount,
		onValueChange,
		// banks,
		// shebas,
		banks: verifiedBanks,
		onOptionChanged,
		chosenBank,
		onOperationClicked,
		loading: depositLoading || withdrawLoading,
		onBalanceClicked,
	}
}

export { useDepositOperations, useWithdrawOperations, useToomanOperation }
