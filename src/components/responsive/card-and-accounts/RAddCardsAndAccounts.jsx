import React, { useState } from 'react'
import CardLayout from '../../layouts/CardLayout'
import { FaChevronRight } from 'react-icons/fa'
import { useMainContext } from '../../../core/contexts/main'
import AddAccountCard from '../../cards-accounts/AddAccountCard'
import { useProfileUpdateMutation } from '../../../core/services/react-query/useProfileQuery'

const RAddCardsAndAccounts = ({ activeTab, setShowModal }) => {
	const {
		main: { theme },
	} = useMainContext()

	const { mutate: updateProfile } = useProfileUpdateMutation()

	const initialState = { bank: '', sheba: '', wallet: '', label: '' }

	const [inputValues, setInputValues] = useState(initialState)

	const onAddWalletOrBank = (selectedCoin = null, network, authData = null) => {
		const data =
			activeTab === 1
				? {
						banks: {
							cardNo: inputValues.bank.replaceAll(' ', ''),
							shebaNo: 'IR' + inputValues.sheba,
							label: inputValues.label,
						},
				  }
				: {
						wallets: {
							coin: selectedCoin.toLowerCase(),
							address: inputValues.wallet,
							label: inputValues.label,
							network
						},
				  }
		if (authData?.otp) data.otp = authData.otp
		if (authData?.ga) data.ga = authData.ga
		updateProfile(data)
		setInputValues(initialState)

		setShowModal?.(false)
	}

	return (
		<>
			<div className={'w-full px-5 pt-10 z-50'}>
				<div
					className={`flex w-full px-2 justify-start ${
						theme === 'dark' ? 'text-white' : 'text-black'
					}`}
				>
					<FaChevronRight
						onClick={() => {
							setShowModal?.(false)
						}}
					/>
				</div>

				<CardLayout width='100%' className={'pt-5'}>
					<AddAccountCard
						activeTab={activeTab}
						inputValues={inputValues}
						setInputValues={setInputValues}
						onAddWalletOrBank={onAddWalletOrBank}
					/>
				</CardLayout>
			</div>
		</>
	)
}

export default RAddCardsAndAccounts
