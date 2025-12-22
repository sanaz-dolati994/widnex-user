import React, { useEffect, useState } from 'react'
import CardLayout from '../../layouts/CardLayout'
import FilterDropdown from '../../modals/FilterDropdown'
import SearchBox from '../../SearchBox'
import { FaPlusCircle, FaThermometerEmpty } from 'react-icons/fa'
import { Flex, RMainTab } from '../../../styles/CommonStyles'
import Text from '../../../core/utils/Text'
import { useProfileQuery } from '../../../core/services/react-query/useProfileQuery'
import { useMainContext } from '../../../core/contexts/main'
import { useLocation } from 'react-router-dom'
import { TabContainer } from '../../../styles/CoinOperationStyles'
import RAddCardsAndAccounts from './RAddCardsAndAccounts'
import { BalanceBtn, BtnText } from '../../../styles/UserBalanceStyles'
import RCardItem from './RCardItem'
import RAccountItem from './RAccountItem'
import { useDeleteAccountAndCard } from '../../../core/hooks/useDeleteAccountAndCard'
import TwoFactorModal from '../../modals/TwoFactorModal'

const bankStatusOptions = ['all', 'verified', 'Tpending']

const getHeaders = (activeTab) => [
	activeTab === 1 ? 'card-number' : 'coin',
	activeTab === 1 ? 'shaba-number' : 'wallet-address',
	'label',
	'status',
]

const RCardsAndAccounts = () => {
	const [showModal, setShowModal] = useState(false)

	const {
		main: { theme },
	} = useMainContext()

	const { data: profile } = useProfileQuery()

	const location = useLocation()

	// TODO activeTab change according to wallet
	const [activeTab, setActiveTab] = useState(location?.state?.wallet ? 2 : 1)

	const [searchValue, setSearchValue] = useState('')
	const [wallets, setWallets] = useState([])
	const [banks, setBanks] = useState([])

	useEffect(() => {
		if (profile?.wallets) {
			setWallets(profile?.wallets)
		}
		if (profile?.banks) {
			setBanks(profile?.banks)
		}
	}, [profile])

	const onTabChange = (idx) => {
		if (idx !== activeTab) {
			setActiveTab(idx)
		}
	}

	const onCloseSearchClicked = () => {
		setSearchValue('')
		if (profile) {
			setWallets(profile?.wallets)
			setBanks(profile?.banks)
		}
	}

	const onOptionChanged = (idx) => {
		const option = bankStatusOptions[idx]
		if (profile) {
		}
		if (option === 'all') {
			activeTab === 1 ? setBanks(profile?.banks) : setWallets(profile?.wallets)
			return
		} else {
			const item =
				activeTab === 1
					? { func: setBanks, list: profile?.banks }
					: { func: setWallets, list: profile?.wallets }
			item.func(item.list.filter((b) => (option === 'verified' ? b.verifyAt : !b.verifyAt)))
		}
	}

	const onInputValueChange = (e) => {
		setSearchValue(e?.target?.value)
		if (e?.target?.value) {
			profile && activeTab === 1
				? setBanks(banks.filter((b) => b.cardNo.includes(e?.target?.value)))
				: setWallets(wallets.filter((w) => w.coin.includes(e?.target?.value)))
		} else {
			profile && activeTab === 1 ? setBanks(profile?.banks) : setWallets(profile?.wallets)
		}
	}

	const { loading, onCheckAuth, authModal, onSubmitTwoFactorModal, closeAuthModal, accountCauses } =
		useDeleteAccountAndCard(activeTab)

	return (
		<>
			<>
				<Tabbar activeTab={activeTab} onTabChange={onTabChange} />
				{!!showModal ? (
					<RAddCardsAndAccounts activeTab={activeTab} setShowModal={setShowModal} />
				) : (
					<>
						<CardLayout className={'mb-[50px]'} width='100%'>
							<div className={'m-0 p-5 justify-start gap-5 flex-wrap'}>
								<div className={'flex items-center'}>
									<SearchBox
										height='45px'
										className={'w-full'}
										searchValue={searchValue}
										bgColor={theme === 'dark' ? '#3f4243' : '#B7B8B9'}
										onInputValueChange={onInputValueChange}
										onCloseSearchClicked={onCloseSearchClicked}
									/>
									<BalanceBtn
										className={'w-auto p-2 rounded-full'}
										onClick={() => setShowModal(true)}
									>
										<BtnText>
											<FaPlusCircle />
											{/*<span className={'mr-2'}>*/}
											{/*	{activeTab === 1 && <Text tid='new-bank-card' />}*/}
											{/*	{activeTab === 2 && <Text tid='new-wallet' />}*/}
											{/*</span>*/}
										</BtnText>
									</BalanceBtn>
								</div>
								<Flex justify={'end'}>
									<FilterDropdown
										options={bankStatusOptions}
										defaultOption='status'
										icon={<FaThermometerEmpty size={16} color='#c3c5b7' />}
										onOptionChanged={onOptionChanged}
									/>
								</Flex>
							</div>

							<div>
								{activeTab === 1 &&
									banks?.map((item, idx) => (
										<RAccountItem
											data={item}
											key={idx}
											idx={idx}
											onCheckAuth={onCheckAuth}
											loading={loading}
										/>
									))}
								{activeTab === 2 &&
									wallets?.map((item, idx) => (
										<RCardItem
											data={item}
											key={idx}
											idx={idx}
											onCheckAuth={onCheckAuth}
											loading={loading}
										/>
									))}
							</div>
						</CardLayout>
					</>
				)}
			</>
			<TwoFactorModal
				open={authModal.con}
				onSubmit={onSubmitTwoFactorModal}
				onClose={closeAuthModal}
				cause={accountCauses[activeTab - 1]}
			/>
		</>
	)
}

const Tabbar = ({ activeTab, onTabChange }) => {
	return (
		<>
			<TabContainer margin='0' style={{ width: '100%' }}>
				<RMainTab onClick={() => onTabChange(1)} idx={1} active={activeTab === 1}>
					<Text tid='add-new-bank-card' />
				</RMainTab>
				<RMainTab onClick={() => onTabChange(2)} idx={2} active={activeTab === 2}>
					<Text tid='add-new-wallet' />
				</RMainTab>
			</TabContainer>
		</>
	)
}

export default RCardsAndAccounts
