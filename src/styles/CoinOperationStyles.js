import styled, { css } from 'styled-components'
import { IoIosClose, IoIosSearch } from 'react-icons/io'
import { FaSquare } from 'react-icons/fa'
import tw from 'twin.macro'

export const WalletOperationErrorContainer = styled.div`
	// background-color: ${({ theme }) => theme.mainRed};
	${() => tw`p-3 bg-red-300 w-full rounded-xl text-black`}
`

const Wrapper = styled.div`
	display: block;
	margin: 0 10%;
`

const Label = styled.p`
	font-size: 1rem;
	//color: #fff;
	padding: 25px 0 15px 0;
	display: inline-block;

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
	}
`

export const WalletAddressesTabsContainer = styled.div`
	${() => tw`flex items-center justify-center gap-5 w-full py-2 text-xs`}
`

export const WalletAddressesTabItem = styled.button`
	${(props) =>
		!!props.active &&
		css`
			background-color: ${props.theme.mainGreen};
		`}

	${(props) => (props.active ? tw`text-black` : tw`text-white`)}
	
	${(props) => tw`px-2 py-1 rounded-xl`}
`

export const CurrentAmount = styled.span`
	${(props) =>
		css`
			color: ${props.isGreen ? props.theme.mainGreen : props.theme.mainOrange};
		`}
`

const OptionList = styled.div`
	width: 100%;
	display: inherit;
	border-left: ${(props) => (props.length - props.idx === 1 ? 'none' : '1px solid #1ce087')};
	background: ${(props) => (props.selected ? '#1ce087' : '')};
`

const OptionsWrapper = styled.div`
	display: flex;
	width: 100%;
	flex-direction: row;
	background: #f5f6ed;
	height: 43px;
	line-height: 38px;
	border-radius: 20px;
	border-left: none;
`
const Options = styled.div`
	display: flex;
	width: 100%;
	flex-direction: row;
	background: #f5f6ed;
	height: 43px;
	line-height: 38px;
	border-radius: 20px;
	border-left: none;
	border-top-right-radius: ${(props) => (props.idx === 0 ? '20px' : 0)};
	border-bottom-right-radius: ${(props) => (props.idx === 0 ? '20px' : 0)};
	border-top-left-radius: ${(props) => (props.length - props.idx === 1 ? '20px' : 0)};
	border-bottom-left-radius: ${(props) => (props.length - props.idx === 1 ? '20px' : 0)};
`

const AddressBox = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	background: ${(props) => props.theme.tInputBg};
	padding: 5px;
	height: 42px;
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.color};
	${OptionList}:last-child {
		border-left: none;
	}

	@media screen and (max-width: 480px) {
		//height: 36px;
		border-radius: 8px;
	}
`

const OptionItem = styled.a`
	font-size: 1.1rem;
	color: #00002d;
	font-family: sans-serif;
`

const AddressIcon = styled.i`
	font-size: 1.6rem !important;
	color: #f5f6ed;
	align-self: center;
	margin-left: 20px;
	vertical-align: middle;
`

const IconWrapper = styled.div`
	align-items: center;
	margin: 6px 0 0 10px;
	cursor: pointer;

	${() => tw`flex items-center`}
`

const Decoration = styled(FaSquare)`
	width: 10px;
	height: 10px;
	transform: rotate(45deg);
	color: ${(props) => props.theme.mainOrange};
`

const AddressText = styled.p`
	font-size: 1rem;
	//color: #f5f6ed;
	align-self: center;
	padding: 0 20px;

	@media screen and (max-width: 480px) {
		font-size: 0.7rem;
	}
`

const DecorationText = styled.p`
	//color: #c3c5b7;
	margin: 0 10px;
	//font-size: 1rem;
`

const BtnText = styled.h1`
	color: #f5f6ed;
	font-size: 1.1rem;
	margin: 0 10px;
`

const SearchBar = styled.div`
	height: 40px;
	margin-bottom: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 50px;
`

const SearchContainer = styled.div`
	width: 92%;
	height: 100%;
	display: flex;
	background-color: ${(props) => (props.responsiveMode ? props.theme.main : props.theme.search)};
	align-items: center;
	padding: ${(props) => (props.theme.english && '5px') || '2px'};
	border: solid 1px #707070;
	border-radius: 15px;
`

const SearchInput = styled.input`
	height: 100%;
	width: 100%;
	outline: none;
	background-color: transparent;
	color: ${(props) => props.theme.secondary};
	border: none;
	padding: 4px;
	padding-right: 30px;
	color: #cbe3d8;
`

const CloseSearchIcon = styled(IoIosClose)`
	color: ${(props) => props.theme.color};
	width: 22px;
	height: 22px;
	margin: 0 4px;
	cursor: pointer;
`

const SearchIcon = styled(IoIosSearch)`
	color: ${(props) => props.theme.color};
	width: 28px;
	height: 28px;
	margin: 0 15px;
	cursor: pointer;
	transform: rotate(90deg);
`

const TabContainer = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	margin: ${(props) => props.margin || '35px 20px'};
	border-bottom: solid 1px ${(props) => props.theme.color}70;
`

const CoinWrapper = styled.div`
	display: block;
	height: 58%;
	overflow-y: auto;
	margin: 35px 20px;

	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
`

const CoinRow = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding: 15px 25px;
	border-radius: 8px;
	cursor: pointer;
	transition: all 0.3s;
	background-color: ${(props) => props.active && props.theme.hover};

	&:hover {
		background-color: ${(props) => props.theme.hover};
	}
`

export const NetworkOptionsPopUp = styled.div`
	${() =>
		tw`fixed flex items-end bottom-[60px] z-50 left-0 right-0 w-screen h-screen bg-[rgba(0,0,0,0.5)]`}
`

export const NetworkOptionsPopUpContent = styled.div`
	background-color: ${(props) => props.theme.mainBg};

	${() => tw`w-full pb-14 pt-4 px-10 rounded-t-2xl text-xs`}
`

export const NetworkOptionsPopUpHint = styled.div`
	color: ${(props) => props.theme.mainOrange};
`

export const RNetworkOptionsWrapper = styled.div`
	// background-color: ${(props) => props.theme.secondary};
	border-radius: 22px;
	cursor: pointer;

	${() => tw`flex flex-col gap-3`}
`

export const RNetWorkItem = styled.div`
	text-align: center;

	padding: 10px 20px;
	transition: all 0.3s;

	background: ${(props) => props.theme.input};

	border: 1px solid ${(props) => props.theme.color};

	background-color: ${(props) => props.active && props.theme.mainGreen};
	color: ${(props) => props.active && props.theme.mainBg};

	border-radius: 20px;
`

const NetworkOptionsWrapper = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: ${(props) => props.theme.secondary};
	border-radius: 22px;
	cursor: pointer;
`

const NetWorkItem = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => props.active && props.theme.mainGreen};
	color: ${(props) => props.theme.mainBg};
	padding: 10px 20px;
	width: ${(props) => props.width};
	${(props) =>
		props.first &&
		css`
			border-top-left-radius: 22px;
			border-bottom-left-radius: 22px;
		`}

	${(props) =>
		props.last &&
		css`
			border-top-right-radius: 22px;
			border-bottom-right-radius: 22px;
		`}
  transition: all 0.3s;

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
	}
`

const TabContent = styled.a`
	//color: #f5f6ed;
	padding-bottom: 6px;
	font-size: 0.9rem;
	cursor: pointer;
	border-bottom: ${(props) => (props.isActive ? '1px solid #4f31c5' : 'none')};
`

const CoinName = styled.a`
	//color: #c3c5b7;
	width: 95px;
	text-align: center;
	font-size: 1rem;
	// font-family: ${(props) => props.number && 'monospace'};
`

const RadioLabel = styled.label`
	font-size: 1.1rem;
	color: #00002d;
	font-family: sans-serif;
	width: 100%;
	text-align: center;
`

const CoinNameWrapper = styled.div`
	background: transparent;
	width: 20%;
	text-align: center;
`

const NameCoin = styled.div`
	//color: #fff;
	margin: 0 10px;
	font-family: Roboto;

	@media screen and (max-width: 480px) {
		font-size: 0.7rem;
	}
`

const Button = styled.button`
	background: #3f4243;
	color: #f5f6ed;
	border-radius: 20px;
	text-align: center;
	padding: 5px 20px;
	border: 1px solid #3f4243;
`

const RadioInput = styled.input`
	display: none;
	outline: none;
	&:not(:disabled) ~ ${RadioLabel} {
		cursor: pointer;
	}
	&:disabled ~ ${RadioLabel} {
		color: rgba(188, 194, 191, 1);
		border-color: rgba(188, 194, 191, 1);
		box-shadow: none;
		cursor: not-allowed;
	}
	&:checked ~ ${RadioLabel} {
		background: rgba(32, 223, 128, 1);
		color: rgba(255, 255, 255, 1);
		border-radius: inherit;
		border-top-right-radius: ${(props) => (props.idx === 0 ? '20px' : 0)};
		border-bottom-right-radius: ${(props) => (props.idx === 0 ? '20px' : 0)};
		border-top-left-radius: ${(props) => (props.length - props.idx === 1 ? '20px' : 0)};
		border-bottom-left-radius: ${(props) => (props.length - props.idx === 1 ? '20px' : 0)};
	}
`

const WithdrawButton = styled.div`
	min-width: 150px;
	height: 32px;
	background-color: ${(props) => (props.active ? props.theme.mainOrange : props.theme.input)};
	color: ${(props) => (props.active && props.theme.mainBg) || props.theme.color};
	padding: 20px;
	text-align: center;
	border-radius: 12px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1rem;
	cursor: ${(props) => (props.active ? 'pointer' : 'not-allowed')};
`

const WithdrawInput = styled.input`
	background-color: ${(props) => props.theme.tInputBg};
	color: ${(props) => props.theme.color};
	border: none;
	outline: none;
	width: 80%;
	font-size: 1.1rem;
	padding: 0 10px;
	direction: ltr;
	${(props) =>
		props.theme.english &&
		css`
			border-right: 1px solid ${(props) => props.theme.color};
			border-top-left-radius: 22px;
			border-bottom-left-radius: 22px;
		`}
	${(props) =>
		!props.theme.english &&
		css`
			border-left: 1px solid ${(props) => props.theme.color};
			border-top-right-radius: 22px;
			border-bottom-right-radius: 22px;
		`}
`

const PortLogo = styled.div`
	width: 120px;
	height: 100px;
	margin: 15px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 4px;
	border-radius: 8px;
	background-color: ${(props) => props.theme.input};
	transition: all 0.3s;
	cursor: pointer;
	box-shadow: 4px 0 4px ${(props) => props.theme.mainBg};

	${(props) =>
		props.active &&
		css`
			background-color: ${(props) => props.theme.mainOrange}70;
			border: 2px solid ${(props) => props.theme.mainOrange};
		`};

	@media screen and (max-width: 480px) {
		width: 90px;
		height: 80px;
	}
`

const BanksWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
`

export {
	Wrapper,
	Label,
	Options,
	OptionList,
	OptionItem,
	AddressBox,
	AddressIcon,
	IconWrapper,
	AddressText,
	Decoration,
	DecorationText,
	BtnText,
	SearchBar,
	SearchContainer,
	SearchInput,
	CloseSearchIcon,
	SearchIcon,
	TabContainer,
	TabContent,
	CoinRow,
	CoinWrapper,
	CoinName,
	RadioInput,
	RadioLabel,
	OptionsWrapper,
	CoinNameWrapper,
	NameCoin,
	Button,
	NetworkOptionsWrapper,
	NetWorkItem,
	WithdrawButton,
	WithdrawInput,
	PortLogo,
	BanksWrapper,
}
