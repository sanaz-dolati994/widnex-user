import styled, { css } from 'styled-components'
import { AiOutlineFileSearch } from 'react-icons/ai'
import tw from 'twin.macro'

export const Grid = styled.div`
	${() => tw`grid`}
`

const Flex = styled.div`
	//width: 100%;
	//height: 100%;

	${() => tw`flex`}

	${({ wrap }) => wrap && tw`flex-wrap`}
	${({ flexDirection }) => flexDirection && (flexDirection === 'col' ? tw`flex-col` : tw`flex-row`)}
	${({ align }) =>
		align &&
		(align === 'center' ? tw`items-center` : align === 'start' ? tw`items-start` : tw`items-end`)}
	${({ justify }) =>
		justify &&
		(justify === 'center'
			? tw`justify-center`
			: justify === 'start'
				? tw`justify-start`
				: justify === 'between'
					? tw`justify-between`
					: tw`justify-end`)}
`

const FlexColumn = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
`

const CFlexBetween = styled.div`
	height: ${(props) => (props.resp ? 'calc(100vh - 140px)' : 'calc(100vh - 80px)')};
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
	justify-content: space-between;
	align-items: center;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
`

const FlexCenter = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	width: ${(props) => props.width};
	height: ${(props) => props.height};
	flex-wrap: wrap;
	gap: ${(props) => props.gap || '6px'};
`

const FlexStart = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	transition: all 0.3s;
	width: ${(props) => props.width};
	height: ${(props) => props.height};
`

const FlexAround = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	width: 100%;

	@media screen and (max-width: 480px) {
		flex-direction: column;
	}
`

const CFlexStart = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	width: ${(props) => props.width};
	height: ${(props) => props.height};
`

const MainWrapper = styled.div`
	position: relative;
	width: 100%;
	padding: 40px 20px;
	margin-right: ${(props) => !props.english && '260px'};
	margin-left: ${(props) => props.english && '260px'};
`

const SpinnerContainer = styled.div`
	position: absolute;
	width: 100%;
	height: ${(props) => props.height || '100%'};
	background-color: ${(props) => props.theme.secondaryBg};
	left: 0;
	top: 0;
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
`

const PaginationContainer = styled.div`
	width: 100%;
	display: flex;
	position: absolute;
	justify-content: center;
	align-items: center;
	bottom: ${(props) => props.bottom || '15px'};
`

const SubmitSearch = styled(AiOutlineFileSearch)`
	margin: 0 10px;
	height: 22px;
	width: 22px;
	color: ${(props) => props.theme.color};
	cursor: pointer;
`

const PercentText = styled.div`
	color: ${(props) =>
		(props.pc < 50 && props.theme.mainRed) ||
		(props.pc < 100 && props.theme.mainOrange) ||
		props.theme.mainGreen};
`

const MainRow = styled.div`
	${() => tw`flex justify-around items-center my-[20px]`}
`

const MainColumn = styled.div`
	width: ${(props) => props.width};
	display: flex;
	flex-direction: column;
	height: ${(props) => props.height};
`

const RowBody = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	margin: 60px 40px 30px 40px;
`

const LoaderContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 8px;
`

const CFlexCenter = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const TabContainer = styled.div`
	width: 100%;
	color: ${(props) => props.theme.color};
	display: flex;
	text-align: center;
	margin: ${(props) => props.margin || '20px 0'};
	padding: 4px 0;
	border-top: 1px solid ${(props) => props.theme.color};
	border-bottom: 1px solid ${(props) => props.theme.color};
`

const MainTab = styled.div`
	width: ${(props) => props.width || '33%'};
	height: 32px;
	font-size: 0.8rem;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.4s;
	border-radius: 4px;
	color: ${(props) => props.theme.color};

	${(props) =>
		props.active &&
		css`
			background-color: ${(props) => props.theme.mainOrange};
			color: ${(props) => props.theme.mainBg};
		`}
`

export const RMainTab = styled.div`
	width: ${(props) => props.width || '33%'};
	//height: 32px;
	font-size: 0.8rem;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.4s;
	color: ${(props) => props.theme.color};
	border-bottom: 2px solid ${(props) => props.theme.mainBg};

	${() => tw`py-3`}

	${(props) =>
		props.active &&
		css`
			color: ${(props) => props.theme.mainOrange};
			border-bottom: 2px solid ${(props) => props.theme.mainOrange};
		`}
`

const LegendItem = styled.div`
	font-size: 0.9rem;
	color: ${(props) => props.color};
`

const LegendIcon = styled.div`
	width: 12px;
	height: 12px;
	margin: 0 8px;
	position: relative;
	border-radius: 50%;
	cursor: pointer;
	background-color: ${(props) => props.color};
`

const LegendWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	flex-wrap: wrap;
`

const ChartTooltip = styled.div`
	background-color: ${(props) => props.theme.color};
	color: ${(props) => props.theme.mainBg};
	font-size: 0.9rem;
	padding: 4px 8px;
	border-radius: 8px;
`

const AmountInput = styled.input`
	border-radius: ${(props) => props.borderRadius || ' 12px'};
	height: 42px;
	outline: none;
	border: 1px solid ${(props) => props.theme.color};
	color: ${(props) => props.theme.color};
	background-color: ${(props) => props.theme.tInputBg};
	padding: 12px;
	width: 100%;
	font-size: 1.1rem;
	direction: ltr;

	@media screen and (max-width: 768px) {
		height: 100%;
		border-radius: 8px;
		padding: 8px 12px;
		font-size: 0.9rem;
		// background-color: transparent;
		// border: none;
	}
`

const DText = styled.div`
	font-size: ${(props) => props.fontSize || '0.8rem'};
	color: ${(props) => props.color || props.theme.color};
	direction: ${(props) => props._type === 'number' && 'ltr'};
	// font-family: ${(props) => props.type === 'number' && 'monospace'};

	@media screen and (max-width: 1400px) {
		font-size: ${(props) => props.fontSize || '0.65rem'};
		// letter-spacing: 0.8px;
	}

	@media screen and (max-width: 480px) {
		font-size: 0.7rem;
	}
`

const ReadAllNotsWrapper = styled.div`
	width: fit-content;
	height: 38px;
	padding: 0 20px;
	border-radius: 8px;
	display: flex;
	align-items: center;
	cursor: pointer;
	border: 2px solid ${(props) => props.theme.input};
	transition: all 0.5s;

	&:hover {
		background-color: ${(props) => props.theme.input};
		border: 2px solid ${(props) => props.theme.mainOrange};
	}
`

const FlexEnd = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: ${(props) => props.width};
	height: ${(props) => props.height};
`

const Padding = styled.div`
	width: 100%;
	height: 100%;
	padding: ${(props) => props.padding};
	display: inherit;
	justify-content: inherit;
	align-items: inherit;
`

export {
	Flex,
	FlexColumn,
	FlexStart,
	CFlexBetween,
	CFlexCenter,
	MainWrapper,
	FlexCenter,
	SpinnerContainer,
	PaginationContainer,
	SubmitSearch,
	PercentText,
	MainRow,
	MainColumn,
	FlexAround,
	RowBody,
	LoaderContainer,
	TabContainer,
	MainTab,
	LegendItem,
	LegendIcon,
	LegendWrapper,
	ChartTooltip,
	AmountInput,
	CFlexStart,
	DText,
	ReadAllNotsWrapper,
	Padding,
	FlexEnd,
}
