import styled, { css } from 'styled-components'
import { FaRegCheckCircle, FaRegTimesCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import tw from 'twin.macro'

const SecurityBody = styled(motion.div)`
	/* display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	min-height: 80vh;
	height: 100%;
	position: relative;
	padding-top: 45px; */
`

const SetIcon = styled(FaRegCheckCircle)`
	color: ${(props) => props.theme.mainGreen};
	filter: drop-shadow(0 0 2px ${(props) => props.mainGreen});
`

const NotSetIcon = styled(FaRegTimesCircle)`
	color: ${(props) => props.theme.mainRed};
	filter: drop-shadow(0 0 2px ${(props) => props.mainRed});
`

const FlexAbsolute = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 30px;
`

const State = styled.div`
	display: flex;
	align-items: center;
	width: ${(props) => props.width};
`

const SecurityText = styled.div`
	color: ${(props) => props.color || props.theme.color};
	font-size: ${(props) => props.fontSize || '1rem'};
	// font-family: ${(props) => props.number && 'monospace'};

	${() => tw`mx-2`};

	@media screen and (max-width: 768px) {
		font-size: 0.8rem;
	}
`

const Button = styled.button`
	border-radius: 12px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	color: ${(props) => props.theme.color};
	background-color: ${(props) => props.theme.input};
	font-size: 0.9rem;

	${() => tw`lg:px-7 px-2 py-1.5 `}
`

export const OpenPopUpButton = styled.button`
	border-radius: 12px;
	color: ${(props) => props.theme.color};
	background-color: ${(props) => props.theme.secondaryBg};
	//font-size: 0.9rem;

	${() => tw`flex w-full justify-between items-center px-5 py-3 mt-5 cursor-pointer`}
`

const FlexBetween = styled.div`
	display: flex;
	align-items: center;
	margin: 0 30px;
	padding: 20px 0;
	${(props) =>
		!props.last &&
		css`
			border-bottom: 1px solid ${(props) => props.theme.textArea}80;
		`}
`

const FlexEnd = styled.div`
	display: flex;
	justify-content: end;
	align-items: center;
	width: 20%;
`

const CText = styled.div`
	font-size: ${(props) => props.fontSize || '1.2rem'};
	color: ${(props) => props.color || props.theme.secondary};
	font-weight: 500;
	margin: ${(props) => props.margin};
`

const AppContainer = styled.div`
	padding: 40px 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 15px;
	flex-wrap: wrap;
`

const App = styled.a`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 140px;
	height: 140px;
	border: 2px solid ${(props) => props.theme.mainOrange};
	border-radius: 12px;
	background-color: ${(props) => props.theme.textArea};
	color: ${(props) => props.theme.color};
	margin: 0 40px;
	cursor: pointer;
`

const QrBox = styled.div`
	display: flex;
	padding: 8px;
	margin-top: 20px;
	flex-direction: column;
	align-items: center;
	border-radius: 8px;
	text-align: center;
	font-size: 1.4rem;
	background-color: ${(props) => props.theme.textArea};
	color: ${(props) => props.theme.secondary};
`

const QrWrapper = styled.div`
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: 8px;
`

export {
	SecurityBody,
	SetIcon,
	NotSetIcon,
	State,
	SecurityText,
	FlexAbsolute,
	Button,
	FlexBetween,
	FlexEnd,
	CText,
	AppContainer,
	App,
	QrBox,
	QrWrapper,
}
