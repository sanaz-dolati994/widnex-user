import styled, { css } from 'styled-components'
import { CgDetailsLess } from 'react-icons/cg'
import { motion } from 'framer-motion'
import { IoIosClose } from 'react-icons/io'
import { DText } from './CommonStyles'

const TabBar = styled.div`
	height: 32px;
	width: 340px;
	border-radius: 22px;
	background-color: #c3c5b7;
	display: flex;
	//color: ${(props) => props.theme.mainBg};
	//margin: 0 20px;
	color: #0d1726;
`

const Tab = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 50%;
	font-size: 0.9rem;
	font-weight: 400;
	transition: all 0.3s;
	cursor: pointer;
	height: inherit;
	${(props) =>
		((props.idx === 1 && props.theme.english) || (props.idx === 2 && !props.theme.english)) &&
		css`
			border-top-left-radius: 22px;
			border-bottom-left-radius: 22px;
		`}
	${(props) =>
		((props.idx === 2 && props.theme.english) || (props.idx === 1 && !props.theme.english)) &&
		css`
			border-top-right-radius: 22px;
			border-bottom-right-radius: 22px;
		`}
    background-color: ${(props) => props.active && props.theme.mainOrange};
`

const TransactionStatus = styled.div`
	color: ${(props) =>
		(props.status === 'pending' && props.theme.mainOrange) ||
		(props.status === 'success' && props.theme.mainGreen) ||
		props.theme.mainRed};
	padding: 4px 6px;
	border-radius: 99999px;
	background-color:${(props) =>
		(props.status === 'pending' && '#0773F140') ||
		(props.status === 'success' && '#008e4740') ||
		'#d54a6140'};
`

export const TransactionType = styled.div`
	color: ${(props) => (props.status === 'buy' && props.theme.mainGreen) || props.theme.mainRed};
`

const DetailsIcon = styled(CgDetailsLess)`
	color: ${(props) => props.theme.color};
	cursor: pointer;
`

const DetailsBody = styled.div`
	width: 100%;
	padding: 10px 15px;
	border-radius: 8px;
	background-color: ${(props) => props.theme.primaryBg};
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 10px 0;
`

const DetailsButton = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 42px;
	padding: 10px 25px;
	border-radius: 12px;
	cursor: pointer;
	color: black;
	/* background-color: ${(props) => props.theme.mainOrange}; */
	font-size: 1rem;
	box-shadow: 0 0 4px black;

	@media screen and (max-width: 768px) {
		font-size: 0.9rem;
		padding: 6px 18px;
	}
`

const DetailRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	border-bottom: ${(props) => !props.last && '1px solid #ffffff15'};
	padding: 15px 0;
	position: relative;
`

const DetailText = styled.div`
	font-size: 0.95rem;
	color: ${(props) => (props.color ? props.theme[props.color] : props.theme.color)};

	${(props) =>
		props.txId &&
		css`
			color: #2196f3;
			text-decoration: underline;
			cursor: pointer;
			font-size: 0.9rem;
			width: 70%;
			line-break: anywhere;
			direction: ltr;
		`};

	${(props) =>
		props.address &&
		css`
			width: 70%;
			line-break: anywhere;
			text-align: left;
		`};

	@media screen and (max-width: 1050px) {
		font-size: 0.8rem;
	} ;
`

const DetailStatus = styled(DetailRow)`
	background-color: ${({ status, theme }) =>
		status === 'success'
			? theme.mainGreen
			: status === 'pending'
				? theme.mainOrange
				: theme.mainRed}15;
	border: 1px solid ${(props) => props.theme.color}15;
	border-radius: 8px;
	padding: 15px 10px;
	width: calc(100% + 20px);
`

const DetailsWrapper = styled(motion.div)`
	width: 100%;
	height: fit-content;
	position: fixed;
	bottom: 80px;
	z-index: 5000000000;
	padding: 20px;
	left: 0;
	background-color: ${(props) => props.theme.mainBg};
	border-top-right-radius: 12px;
	border-top-left-radius: 12px;
	box-shadow: 0 0 4px black;
	border: 1px solid #ffffff15;
`

const DetailsTooltip = styled.div`
	color: ${(props) => props.theme.color};
	font-size: 0.75rem;

	@media screen and (max-width: 768px) {
		font-size: 0.65rem;
	}
	max-height: 300px;
	overflow-y: auto;
	margin: 5px 0;
`

const DetailsTooltipWrapper = styled.div`
	padding: 20px 10px 10px 10px;
	position: absolute;
	left: 0;
	border-radius: 8px;
	width: 100%;
	bottom: 40px;
	background-color: ${(props) => props.theme.tInputBg};
	text-align: start;
	z-index: 10000000;
`

const DetailsCloseBtn = styled(IoIosClose)`
	color: ${(props) => props.theme.color};
	position: absolute;
	top: 5px;
	right: 5px;
	cursor: pointer;
`

const TxidLink = styled.a`
	width: 70%;
	line-break: anywhere;
	color: #2196f3;
	text-decoration: underline;
	font-size: 0.9rem;
	direction: ltr;
`

const NetworkBadge = styled.div`
	padding: 6px;
	border-radius: 12px;
	background-color: ${(props) => props.theme.mainOrange}90;
	color: #0d1726;
	width: 82px;
	box-shadow: 0 0 2px black;
	font-weight: 600;
	// letter-spacing: 1.5px;
`

const AllTransactions = styled(DText)`
	position: absolute;
	bottom: 10px;
	right: 10px;
	cursor: pointer;
	padding: 4px;
	z-index: 1000;
	color: ${(props) => props.theme.mainOrange};
`

export {
	TabBar,
	Tab,
	TransactionStatus,
	DetailsIcon,
	DetailsBody,
	DetailsButton,
	DetailRow,
	DetailText,
	DetailStatus,
	DetailsWrapper,
	DetailsTooltip,
	DetailsTooltipWrapper,
	DetailsCloseBtn,
	TxidLink,
	NetworkBadge,
	AllTransactions,
}
