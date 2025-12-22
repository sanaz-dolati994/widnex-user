import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import styled, { css } from 'styled-components'
import Text from '../../core/utils/Text'
import ModalLayout from '../layouts/ModalLayout'
import { ScrollWrap } from '../../styles/responsive/Common'
import { DText, FlexCenter } from '../../styles/CommonStyles'
import { useWalletContext } from '../../core/contexts/wallet'
import { SOCKET_URL } from '../../core/constants/urls'
import { useNavigate } from 'react-router-dom'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import getBankInfo from '../../packages/bank-service/Bank'
import BankCard from '../../packages/bank-service/BankCard'
import WalletCard from '../../packages/wallet-service/WalletCard'
import { BiPlusCircle } from 'react-icons/bi'

const ChooseBankWalletModal = forwardRef((props, ref) => {
	const { width } = useWindowSize()
	const { coin } = useWalletContext()
	const { label, options, onOptionChange, type } = props

	const [verifiedOptions, setVerifiedOptions] = useState([])
	const hasOption = !!verifiedOptions.filter((o) => o.coin === coin)?.length

	useEffect(() => {
		if (type === 'wallet') setVerifiedOptions(options)
		else setVerifiedOptions(options?.filter((item) => item.verifyAt))
	}, [options])

	const { wallet } = useWalletContext()

	useImperativeHandle(ref, () => ({
		reset() {
			setSelected(-1)
		},
	}))

	const [modalOpen, setModalOpen] = useState(false)
	const [selected, setSelected] = useState(-1)
	const [bankInfo, setBankInfo] = useState(null)

	const onCardClicked = (idx, bankInfo) => {
		setSelected(idx)
		if (bankInfo) setBankInfo(bankInfo)

		setModalOpen(false)
		onOptionChange(idx)
	}

	useEffect(() => {
		setSelected(-1)
	}, [wallet, coin])

	const navigate = useNavigate()
	const onPlaceHolderClicked = () => {
		if ((hasOption && type === 'wallet') || (verifiedOptions && type !== 'wallet')) {
			setModalOpen(true)
		} else {
			navigate('/accounts-cards', { state: { wallet: type === 'wallet' } })
		}
	}

	return (
		<>
			{selected === -1 ? (
				<div className='w-full flex items-center justify-between'>
					<PlaceHolder onClick={onPlaceHolderClicked} className='w-full'>
						<Text tid={label} />
					</PlaceHolder>

					{!hasOption && (
						<BiPlusCircle
							onClick={() => navigate('/accounts-cards', { state: { wallet: type === 'wallet' } })}
							className='mx-2'
							size={'1.5rem'}
						/>
					)}
				</div>
			) : (
				<>
					{type === 'wallet' ? (
						<FlexCenter>
							<WalletCard item={verifiedOptions[selected]} onClick={() => setModalOpen(true)} />
						</FlexCenter>
					) : (
						<FlexCenter width='100%'>
							<BankCard
								bankInfo={bankInfo}
								bankAccount={verifiedOptions[selected]}
								onClick={() => setModalOpen(true)}
							/>
						</FlexCenter>
					)}
				</>
			)}

			<ModalLayout
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				width={width < 480 ? '90%' : '800px'}
			>
				<FlexCenter style={{ marginBottom: '10px' }}>
					<DText>
						<Text tid={label} />
					</DText>
				</FlexCenter>

				<ScrollWrap maxHeight='400px'>
					<Grid type={type}>
						{verifiedOptions?.map((option, idx) => (
							<>
								{type === 'wallet' ? (
									<WalletOption item={option} idx={idx} onCardClicked={onCardClicked} />
								) : (
									<BankOption item={option} idx={idx} onCardClicked={onCardClicked} />
								)}
							</>
						))}
					</Grid>
				</ScrollWrap>
			</ModalLayout>
		</>
	)
})

const BankOption = ({ item, idx, onCardClicked }) => {
	const bankInfo = getBankInfo(item.cardNo)

	if (!bankInfo) {
		return <></>
	}

	return (
		<FlexCenter>
			<BankCard
				onClick={() => onCardClicked(idx, bankInfo)}
				bankInfo={bankInfo}
				bankAccount={item}
			/>
		</FlexCenter>
	)
}

const WalletOption = ({ item, idx, onCardClicked }) => {
	const { coin } = useWalletContext()
	if (item.coin !== coin) {
		return null
	}

	return (
		<FlexCenter>
			<WalletCard onClick={() => onCardClicked(idx)} item={item} />
		</FlexCenter>
	)
}

const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(2, 50%);
	row-gap: 40px;
	margin: 10px 0;

	@media screen and (max-width: 480px) {
		grid-template-columns: repeat(1, 100%);
	} ;
`

const PlaceHolder = styled.div`
	border: 1px solid ${(props) => props.theme.color};
	border-radius: 8px;
	background-color: ${(props) => props.theme.tInputBg};
	min-height: 40px;
	width: 100%;
	font-size: 0.9rem;
	display: flex;
	align-items: center;
	padding: 0 10px;
	cursor: pointer;
`

export default ChooseBankWalletModal
