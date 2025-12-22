import styled, { css } from 'styled-components'
import { SOCKET_URL } from '../../core/constants/urls'
import { walletInfo } from './WalletInfo'
import { FlexCenter } from '../../styles/CommonStyles'
import Text from '../../core/utils/Text'

const WalletCard = (props) => {
	const { item, newWallet = false } = props

	let walletColors = walletInfo.find((w) => w.name === item.coin)

	if (!walletColors) {
		const random = Math.floor(Math.random() * 50)
		walletColors = walletInfo[random]
	}

	// return (
	// 	<CardWrapper {...props}>
	// 		<CardBody
	// 			color={walletColors.color}
	// 			primary={walletColors.primary}
	// 			shadow={walletColors.shadow}
	// 		>
	// 			<FlexCenter>
	// 				<WText>{item.coin?.toUpperCase()}</WText>
	// 				<WText>{walletColors.fa}</WText>
	// 			</FlexCenter>

	// 			<FlexCenter>
	// 				<WText>
	// 					<Text tid='network' />
	// 				</WText>
	// 				<WText>{item.network}</WText>
	// 			</FlexCenter>

	return (
		<CardWrapper {...props}>
			<CardBody
				color={walletColors.color}
				primary={walletColors.primary}
				shadow={walletColors.shadow}
				newWallet={newWallet}
			>
				<FlexCenter>
					<WText>{item.coin?.toUpperCase()}</WText>
					<WText>{walletColors.fa}</WText>
				</FlexCenter>

				<FlexCenter>
					<WText>
						<Text tid='network' />
					</WText>
					<WText>{item.network}</WText>
				</FlexCenter>

				<WText>{item.address}</WText>
				<WText label>{item.label}</WText>
			</CardBody>
			<ImgWrapper>
				<Img src={SOCKET_URL + `assets/icon/${item.coin}.png`} alt=' ' />
			</ImgWrapper>
		</CardWrapper>
	)
}

const CardWrapper = styled.div`
	width: 320px;
	height: 230px;
	padding: 40px 10px;
	position: relative;
	@media screen and (max-width: 480px) {
		width: 300px;
	} ;
`

const CardBody = styled.div`
	border-radius: 8px 8px 12px 12px;
	background-color: ${(props) => props.color};
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	cursor: pointer;
	position: relative;
	z-index: 1;
	overflow: hidden;
	padding-top: 20px;

	${(props) =>
		!props.newWallet &&
		css`
			box-shadow: 20px 15px 0 0 rgb(0 0 0 / 10%);
		`};

	&::before {
		content: '';
		position: absolute;
		width: 150%;
		transform: rotate(-15deg);
		background-color: ${(props) => props.color};
		left: -34%;
		top: -144%;
		height: 150%;
		z-index: 0;
		opacity: 0.8;
		filter: brightness(80%);
	}

	&::after {
		content: '';
		position: absolute;
		width: 150%;
		transform: rotate(-15deg);
		background-color: ${(props) => props.color};
		left: -20%;
		top: 75%;
		height: 150%;
		filter: brightness(130%);
		opacity: 0.8;
		z-index: 0;
	}
`

const ImgWrapper = styled.div`
	width: 60px;
	position: absolute;
	top: 0;
	right: calc(50% - 35px);
	z-index: 10;
	border: 1px solid #00000015;
	border-radius: 50%;
`

const Img = styled.img`
	width: 100%;
`

const WText = styled.div`
	font-size: 1rem;
	color: #0d1726;
	font-weight: 500;
	// letter-spacing: 1.2px;
	margin: 0 5px;
	line-break: anywhere;
	text-align: center;
	z-index: 12;

	${(props) =>
		props.label &&
		css`
			background-color: #ffffff90;
			font-size: 0.8rem;
			width: 80%;
			text-align: center;
			padding: 2px 0;
			border-radius: 2px;
		`};
`

export default WalletCard
