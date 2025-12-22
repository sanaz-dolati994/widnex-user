import { useEffect, useState } from 'react'
import {
	AddressBox,
	AddressText,
	IconWrapper,
	Label,
	NetWorkItem,
	NetworkOptionsWrapper,
	Wrapper,
} from '../../styles/CoinOperationStyles'
import Text from '../../core/utils/Text'
import { FaQrcode, FaRegCopy, FaShareAlt } from 'react-icons/fa'
import QRCode from 'react-qr-code'
import { useDepositOperations } from '../../core/hooks/useWalletOperations'
import { FeesContainer } from './CoinOperation'
import { ClipLoader } from 'react-spinners'
import { FlexCenter } from '../../styles/CommonStyles'

const DepositCoin = () => {
	const [showQrCode, setShowQrCode] = useState(false)

	const {
		depositNetworks,
		depositData,
		activeDepositNetwork,
		setActiveNetwork,
		isLoading,
		copyToClipboard,
		qrAddress,
	} = useDepositOperations()

	return (
		<>
			<Wrapper>
				<Label>
					<Text tid='selectNetwork' />
				</Label>
				<NetworkOptionsWrapper>
					{depositNetworks?.map((net, idx) => (
						<NetWorkItem
							width={`${100 / depositNetworks.length}%`}
							first={idx === depositNetworks.length - 1}
							last={idx === 0}
							onClick={() => setActiveNetwork(net)}
							active={activeDepositNetwork && activeDepositNetwork.network === net.network}
						>
							{net.network}
						</NetWorkItem>
					))}
				</NetworkOptionsWrapper>
			</Wrapper>

			{!!activeDepositNetwork?.network && (
				<>
					<Wrapper>
						<Label>
							<Text tid='getAddress' />
						</Label>
						<AddressBox>
							<AddressText className={'w-full'}>
								{isLoading ? (
									<FlexCenter>
										<ClipLoader color='#4f31c5' size={16} />
									</FlexCenter>
								) : (
									<input
										className={'w-full'}
										style={{ background: 'transparent' }}
										readOnly
										defaultValue={qrAddress}
									/>
								)}
							</AddressText>
							<IconWrapper>
								<FaRegCopy
									onClick={() => copyToClipboard(navigator)}
									size={22}
									// color='#fff'
									style={{ margin: '0 5px' }}
								/>
								<FaQrcode
									onClick={() => setShowQrCode((state) => !state)}
									size={22}
									// color='#fff'
									style={{ margin: '0 5px' }}
								/>
								<FaShareAlt
									size={22}
									// color='#fff'
									style={{ margin: '0 5px' }}
								/>
							</IconWrapper>
						</AddressBox>
					</Wrapper>
					<Wrapper
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							margin: '40px 0',
						}}
					>
						{showQrCode && depositData && (
							<QRCode bgColor='#0f1c2e' fgColor='#fff' size={120} value={qrAddress} />
						)}
					</Wrapper>
				</>
			)}

			{!!activeDepositNetwork?.network && (
				<FeesContainer type={'deposit'} network={activeDepositNetwork} />
			)}
		</>
	)
}

export default DepositCoin
