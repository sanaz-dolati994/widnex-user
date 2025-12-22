import styled, { css } from 'styled-components'
import tw from 'twin.macro'

const SearchWrapper = styled.div`
	//position: absolute;
	//top: 15px;
	width: 100%;
`

const BalanceWrapper = styled.div`
	width: 100%;
	height: 250px;
	overflow-y: auto;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
`

const BalanceTable = styled.div`
	display: table;
	table-layout: fixed;
	width: 100%;
	height: 60%;
	padding: 0 20px;
`

const BalanceRow = styled.tr`
	width: 100%;
	color: ${(props) => props.theme.color};
	font-size: ${(props) => (props.idx === 0 && '13px') || '15px'};
`

const HeaderRow = styled.div`
	width: 100%;
	margin-top: 35px;
	padding: 0 20px;
	display: flex;
	font-size: 15px;
`
const HeaderCol = styled.div`
	padding: 10px 5px;
	// width: ${(props) => (props.idx === 0 && '16%') || (props.idx === 5 && '32%') || '13%'};
	// text-align: ${(props) => (props.idx === 5 && props.header && 'center') || 'start'};
	font-size: 0.9rem;
	color: ${(props) => props.theme.color};
	margin: auto;

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
	}

	${() => tw`text-center`}
`

const BalanceCol = styled.td`
	padding: 10px 5px;
	/* border-bottom: 1px solid ${(props) => props.theme.secondary}10; */
	// width: ${(props) => (props.idx === 0 && '16%') || (props.idx === 5 && '32%') || '13%'};
	//text-align: ${(props) => (props.idx === 5 && props.header && 'center') || 'start'};
	// font-family: ${(props) => !props.header && 'monospace'};

	${() => tw`text-center`}
`

const CoinName = styled.div`
	margin: 0 10px;
	white-space: nowrap;
`

const BalanceBtn = styled.div`
	background-color: ${(props) => (props.active ? props.theme.active : props.theme.input)};
	// color: ${(props) => (props.active ? '#000000' : '#ffffff')};
	font-size: 14px;
	cursor: pointer;

	${(props) =>
		props.disabled &&
		css`
			opacity: 0.4;
			cursor: not-allowed;
		`}

	${() => tw`flex w-[50%] items-center justify-center px-2 py-3 rounded-lg m-1`};
	outline: 1px solid ${(props) => props.theme.color}30;
	border-radius: 8px;

	transition: all 0.3s;

	&:hover {
		outline: 1px solid ${(props) => props.theme.mainOrange};
		background-color: transparent;
	}
`

const BtnText = styled.div`
	// color: ${(props) => props.theme.secondary};
	margin: 0 5px;

	${() => tw`flex items-center justify-center`};
`

const HeaderWrapper = styled.div`
	margin-top: 50px;
`

export {
	BtnText,
	BalanceBtn,
	BalanceRow,
	BalanceTable,
	BalanceWrapper,
	HeaderRow,
	HeaderCol,
	SearchWrapper,
	BalanceCol,
	CoinName,
	HeaderWrapper,
}
