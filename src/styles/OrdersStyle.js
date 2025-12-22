import styled from 'styled-components'
import { FaArrowCircleDown, FaArrowCircleUp, FaRegTrashAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Badge = styled.div`
	color: #fff !important;
	padding: 5px 10px;
	border-radius: 10px;
	background: ${(props) => (props.type === 'buy' ? '#4b652e' : '#853a1d')};
`

const TextWithMargin = styled.div`
	color: ${(props) =>
		((props.type === 'sell' || props.type === 'withdraw' || props.type === 'send') && props.theme.mainRed) ||
		props.theme.mainGreen};
	font-size: inherit;
	margin: 0 ${(props) => ((props.type === 'sell' || props.theme.english) && '8px') || '13px'};
	margin-bottom: ${(props) => !props.theme.english && '-3px'};
`

const Market = styled.div`
	font-size: 15px;
	font-weight: 600;
	// letter-spacing: 1.2px;
	margin: 0 5px;
	color: ${(props) => props.theme.color};
`

const BuyIcon = styled(FaArrowCircleUp)`
	color: ${(props) => props.theme.mainGreen};
	size: ${(props) => props.size || '14px'};
	filter: drop-shadow(0 0 4px ${(props) => props.theme.mainGreen});
`

const SellIcon = styled(FaArrowCircleDown)`
	color: ${(props) => props.theme.mainRed};
	size: 14;
	filter: drop-shadow(0 0 4px ${(props) => props.theme.mainRed});
`

const DeleteIcon = styled(FaRegTrashAlt)`
	color: ${(props) => props.theme.color};
	size: 14;
	cursor: pointer;
`

const TableWrapper = styled(motion.div)`
	width: 100%;
	// height: ${(props) => props.height || '65%'};
	min-height: 400px;
	padding-bottom: 64px;
	overflow-y: auto;
	overflow-x: auto;
	//display: flex;
	position: relative;

	/* scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	} */

	@media screen and (max-width: 960px) {
		flex-direction: column;
	}
`

export { Badge, Market, TextWithMargin, BuyIcon, SellIcon, TableWrapper, DeleteIcon }
