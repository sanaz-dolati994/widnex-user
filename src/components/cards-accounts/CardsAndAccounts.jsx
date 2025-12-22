import { useEffect, useState } from 'react'
import CardLayout from '../layouts/CardLayout'
import { Tab, TabBar, TransactionStatus } from '../../styles/TransactionHistoryStyles'
import AddAccountCard from './AddAccountCard'
import FilterDropdown from '../modals/FilterDropdown'
import SearchBox from '../SearchBox'
import { FaThermometerEmpty } from 'react-icons/fa'
import { Column, HeaderColumn, HeaderRow, Row, Table, TableWrapper } from '../../styles/TableStyle'
import { FlexCenter, RowBody } from '../../styles/CommonStyles'
import { DeleteIcon, Market } from '../../styles/OrdersStyle'
import Text from '../../core/utils/Text'
import {
	useProfileQuery,
	useProfileUpdateMutation,
} from '../../core/services/react-query/useProfileQuery'
import { SOCKET_URL } from '../../core/constants/urls'
import { useMainContext } from '../../core/contexts/main'
import { useLocation } from 'react-router-dom'
import { p2e } from '../../core/utils/common'
import { IconWrapper } from '../../styles/CoinOperationStyles'
import { ClipLoader } from 'react-spinners'
import { getMainTheme } from '../../core/utils/theme'
import TwoFactorModal from '../modals/TwoFactorModal'
import { useDeleteAccountAndCard } from '../../core/hooks/useDeleteAccountAndCard'

const bankStatusOptions = ['all', 'verified', 'Tpending']

const getHeaders = (activeTab) => [
	activeTab === 1 ? 'card-number' : 'coin',
	activeTab === 1 ? 'shaba-number' : 'wallet-address',
	'label',
	'status',
	'action',
]

const CardsAndAccounts = () => {
	const {
		main: { theme },
	} = useMainContext()

	const { data: profile } = useProfileQuery()

	const { mutate: updateProfile } = useProfileUpdateMutation()

	const location = useLocation()

	const [activeTab, setActiveTab] = useState(location?.state?.wallet ? 2 : 1)

	const [searchValue, setSearchValue] = useState('')
	const [wallets, setWallets] = useState([])
	const [banks, setBanks] = useState([])

	const initialState = { bank: '', sheba: '', wallet: '', label: '' }
	const [inputValues, setInputValues] = useState(initialState)

	useEffect(() => {
		if (profile?.wallets) {
			setWallets(profile.wallets)
		}
		if (profile?.banks) {
			setBanks(profile.banks)
		}
	}, [profile?.wallets, profile?.banks])

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

	const onInputValueChange = (e) => {
		const val = p2e(e?.target?.value)
		setSearchValue(val)
		if (val) {
			profile && activeTab === 1
				? setBanks(banks.filter((b) => b.cardNo.includes(val)))
				: setWallets(wallets.filter((w) => w.coin.includes(val)))
		} else {
			profile && activeTab === 1 ? setBanks(profile?.banks) : setWallets(profile?.wallets)
		}
	}

	const onOptionChanged = (idx) => {
		setWallets([])
		setBanks([])
		const option = bankStatusOptions[idx]

		if (option === 'all') {
			activeTab === 1 ? setBanks(profile?.banks) : setWallets(profile?.wallets)
		} else {
			const item =
				activeTab === 1
					? { func: setBanks, list: profile?.banks }
					: { func: setWallets, list: profile?.wallets }

			const newList = item.list.filter((b) => (option === 'verified' ? b.verifyAt : !b.verifyAt))
			item.func(newList)
		}
	}

	const onAddWalletOrBank = (selectedCoin = null, network = null, authData = null) => {
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
							network,
						},
				  }

		if (authData?.otp) data.otp = authData.otp
		if (authData?.ga) data.ga = authData.ga
		updateProfile(data)
		setInputValues(initialState)
	}

	const { loading, onCheckAuth, authModal, onSubmitTwoFactorModal, closeAuthModal, accountCauses } =
		useDeleteAccountAndCard(activeTab)

	return (
		<CardLayout width='100%' minHeight='500px' style={{ padding: '20px' }}>
			<Tabbar activeTab={activeTab} onTabChange={onTabChange} />
			<AddAccountCard
				activeTab={activeTab}
				inputValues={inputValues}
				setInputValues={setInputValues}
				onAddWalletOrBank={onAddWalletOrBank}
			/>
			<RowBody className={'justify-start gap-5'}>
				<SearchBox
					height='45px'
					className={'w-auto'}
					searchValue={searchValue}
					bgColor={theme === 'dark' ? '#3f4243' : '#B7B8B9'}
					onInputValueChange={onInputValueChange}
					onCloseSearchClicked={onCloseSearchClicked}
				/>
				<FilterDropdown
					options={bankStatusOptions}
					defaultOption='status'
					icon={<FaThermometerEmpty size={16} color='#c3c5b7' />}
					onOptionChanged={onOptionChanged}
				/>
			</RowBody>

			<TableWrapper height='35%'>
				<Table width='100%'>
					<HeaderRow fontSize='0.8rem'>
						{getHeaders(activeTab).map((header) => (
							<HeaderColumn key={header} width='25%'>
								<Text tid={header} />
							</HeaderColumn>
						))}
					</HeaderRow>
					{activeTab === 1 &&
						banks?.map((item, idx) => (
							<Row key={item._id}>
								<Column>{item.cardNo}</Column>
								<Column>{item.shebaNo}</Column>
								<Column>{item.label}</Column>
								<Column>
									<TransactionStatus status={item.verifyAt ? 'success' : 'pending'}>
										<Text tid={item.verifyAt ? 'verified' : 'Tpending'} />
									</TransactionStatus>
								</Column>
								<Column>
									{loading === idx ? (
										<IconWrapper>
											<ClipLoader size={18} color={getMainTheme('dark', 'en').active} />
										</IconWrapper>
									) : (
										<IconWrapper onClick={() => onCheckAuth(item, idx, 'bank')}>
											<DeleteIcon />
										</IconWrapper>
									)}
								</Column>
							</Row>
						))}
					{activeTab === 2 &&
						wallets?.map((item, idx) => (
							<Row key={item.address}>
								<Column>
									<FlexCenter>
										<img
											src={SOCKET_URL + `assets/icon/${item.coin}.png`}
											alt=' '
											width='18px'
											height='18px'
										/>
										<Market>{item.coin}</Market>
									</FlexCenter>
								</Column>
								<Column style={{ lineBreak: 'anywhere' }}>{item.address}</Column>
								<Column>{item.label}</Column>
								<Column>
									<TransactionStatus status={item.verifyAt ? 'success' : 'pending'}>
										<Text tid={item.verifyAt ? 'verified' : 'Tpending'} />
									</TransactionStatus>
								</Column>
								<Column>
									{loading === idx ? (
										<IconWrapper>
											<ClipLoader size={18} color={getMainTheme('dark', 'en').active} />
										</IconWrapper>
									) : (
										<IconWrapper onClick={() => onCheckAuth(item, idx, 'wallet')}>
											<DeleteIcon />
										</IconWrapper>
									)}
								</Column>
							</Row>
						))}
				</Table>
			</TableWrapper>

			<TwoFactorModal
				open={authModal.con}
				onSubmit={onSubmitTwoFactorModal}
				onClose={closeAuthModal}
				cause={accountCauses[activeTab - 1]}
			/>
		</CardLayout>
	)
}

const Tabbar = ({ activeTab, onTabChange }) => {
	return (
		<TabBar>
			<Tab onClick={() => onTabChange(1)} idx={1} active={activeTab === 1}>
				<Text tid='new-bank-card' />
			</Tab>
			<Tab onClick={() => onTabChange(2)} idx={2} active={activeTab === 2}>
				<Text tid='new-wallet' />
			</Tab>
		</TabBar>
	)
}

export default CardsAndAccounts
