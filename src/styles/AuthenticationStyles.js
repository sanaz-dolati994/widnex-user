import styled, { css } from 'styled-components'
import { motion } from 'framer-motion'
import { FaCertificate, FaCheck, FaFacebookMessenger } from 'react-icons/fa'
import tw from 'twin.macro'
import { IoIosCloseCircle } from 'react-icons/io'

const RejectIcon = styled(IoIosCloseCircle)`
	color: ${(props) => props.theme.mainRed};
	position: absolute;
	right: -2px;
	bottom: -2px;
`

const AuthWrapper = styled.div`
	width: 100%;
	//height: 80vh;
	margin-top: 20px;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: flex-start;

	@media screen and (max-width: 480px) {
		margin-top: 10px;
		//height: calc(80vh - 10px);
	}
`

const AnimateBody = styled(motion.div)`
	width: 100%;
	height: 100%;
	position: relative;

	@media screen and (max-width: 480px) {
		${(props) =>
			props.hasPadding &&
			css`
				height: 80vh;
				padding-bottom: 280px;
				overflow-y: auto;
				scrollbar-width: none;
				&::-webkit-scrollbar {
					display: none;
				}
			`}
	}
`

const ButtonContainer = styled.div`
	margin: 40px 0;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`

const Row = styled.div`
	margin: ${(props) => props.margin};
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	position: relative;
	transition: all 0.3s;
`

const Label = styled.div`
	color: ${(props) => props.color || props.theme.color};
	height: 20px;
	font-size: 14px;
	font-weight: 600;
	text-align: start;
	margin: 0 5px;

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
	}
`
export const Select = styled.select`
	width: 100%;
	min-width: 240px;
	height: 38px;
	border: 1px solid
		${(props) =>
			(props.status === 'valid' && props.theme.mainGreen) ||
			(props.status === 'error' && props.theme.mainRed) ||
			props.theme.color};
	background-color: ${(props) => props.theme.input};
	color: ${(props) => props.theme.color};
	border-radius: 12px;
	margin-top: 15px;
	font-size: 0.9rem;
	// letter-spacing: 1.5px;
	font-weight: 500;
	outline: none;
	padding: 10px 20px;
	text-align: ${(props) => props.textAlign && props.textAlign};
	direction: ${(props) => props._type === 'number' && 'ltr'};

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
		height: 32px;
		margin-top: 8px;
		width: ${(props) => props.width || '100%'};
	}
`

const Input = styled.input`
	width: 100%;
	min-width: 240px;
	height: 44px;
	border: 1px solid
		${(props) =>
			(props.status === 'valid' && props.theme.mainOrange) ||
			(props.status === 'error' && props.theme.mainRed) ||
			props.theme.inputBorder};
	background-color: transparent;
	/* background-color: ${(props) => props.theme.input}; */
	color: ${(props) => props.theme.color};
	border-radius: 8px;
	margin-top: 15px;
	font-size: 1rem;
	// letter-spacing: 1.5px;
	font-weight: 500;
	outline: none;
	padding: 10px 20px;
	text-align: ${(props) => props.textAlign && props.textAlign};
	direction: ${(props) => props._type === 'number' && 'ltr'};

	@media screen and (max-width: 480px) {
		font-size: 0.9rem;
		/* height: 32px; */
		margin-top: 8px;
		width: ${(props) => props.width || '100%'};
	}
`

const Error = styled.div`
	width: 100%;
	margin: 4px 8px 0 8px;
	color: ${(props) => props.theme.mainRed};
	font-size: 12px;
	// letter-spacing: 1.2px;
`

const NextStep = styled.div`
	display: flex;
	justify-content: center;
	cursor: ${(props) => (props.active && 'pointer') || 'not-allowed'};
	pointer-events: ${(props) => (props.active ? 'auto' : 'none')};
	align-items: center;
	background-color: ${(props) => (props.active ? props.theme.mainOrange : props.theme.color)};
	color: ${(props) => (props.active ? '#ffffff' : props.theme.mainBg)};
	// width: ${(props) => props.width || '90px'};
	height: 40px;
	border-radius: 8px;
	width: 100%;
	font-size: 1rem;

	${() => tw`px-2`};

	@media screen and (max-width: 480px) {
		font-size: 0.75rem;
	}
`

const Wrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	margin-top: 40px;
`

const Box = styled.div`
	background-color: ${(props) => props.theme.secondaryBg};
	color: ${(props) => props.theme.color};
	font-size: 1.8rem;
	border-radius: 8px;
	box-shadow: 0 0 6px 0
		${(props) => (props.active && props.theme.mainOrange) || 'rgba(0, 0, 0, 0.16)'};
	z-index: 10;
	${(props) =>
		props.active &&
		css`
			border: 2px solid ${(props) => props.theme.mainOrange};
		`}
	${(props) =>
		!props.active &&
		css`
			background-color: ${(props) => props.theme.input}50;
		`}

  ${() => tw`relative transition-all flex flex-col items-center justify-around py-7 px-2`}
`

const ItemText = styled.div`
	color: ${(props) => props.theme.color};
	font-size: 1rem;
	font-weight: 600;
	//// letter-spacing: 1.2px;

	${() => tw`text-xs mt-3 block text-center`}
`

const Step = styled.div`
	position: absolute;
	display: flex;
	top: 8px;
	right: 10px;
	font-size: 13px;
	font-weight: 600;
	color: ${(props) => props.theme.color};
`

const Arrow = styled.div`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	left: -30px;
`

const PersonalBox = styled.div`
	margin: ${(props) => props.margin};
	color: ${(props) => props.theme.mainOrange};
	${(props) =>
		!props.noBorder &&
		css`
			border-bottom: 1px solid ${(props) => props.theme.color}40;
		`}

	${() =>
		tw`flex flex-wrap xl:flex-nowrap w-full items-start xl:items-center justify-center xl:justify-start text-[20px] p-[20px 40px 40px 40px]`}
`

const Flex = styled.div`
	display: flex;
	flex-wrap: wrap;
	width: ${(props) => props.width || '80%'};
`

const PersonalTitle = styled.div`
	text-align: start;
	font-size: 1.2rem;
	color: ${(props) => props.theme.profileTitle};

	@media screen and (max-width: 768px) {
		font-size: 0.8rem;
	}

	${() => tw`whitespace-nowrap text-center w-auto md:w-[20%]`}
`

export const PersonalContent = styled.div`
	${() => tw`gap-5 flex flex-wrap items-start justify-center xl:justify-start`}
`

const Toggle = styled.div`
	width: 90px;
	height: 32px;
	background-color: ${(props) => (props.active && props.theme.mainOrange) || props.theme.textArea};
	color: ${(props) => props.theme.textColor};
	font-size: 14px;
	font-weight: 600;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 5px;
	border-radius: 8px;
	margin-top: 20px;
	box-shadow: 0 0 2px black;
	cursor: pointer;

	@media screen and (max-width: 480px) {
		width: 45%;
		font-size: 0.75rem;
	}
`

const MeliBody = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 20px;

	//@media screen and (max-width: 480px) {
	//	overflow-y: auto;
	//	height: 40vh;
	//}
`

const ImageCollector = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 14px;
	justify-content: center;
	align-items: center;
	height: 170px;
	border-radius: 12px;
	position: relative;
`

const MeliTitle = styled.div`
	font-size: ${(props) => props.fontSize};
	color: ${(props) => props.color || props.theme.color};
	margin: ${(props) => props.margin && props.margin};

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
	}
`

const ImageGetter = styled.input`
	display: block;
	position: absolute;
	height: ${(props) => props.height || '100%;'};
	width: ${(props) => props.width || '100%'};
	opacity: 0;
	top: 0;
	left: 0;
	cursor: pointer;
	outline: none;
`

const MeliImageContainer = styled.div`
	width: 230px;
	height: 80px;
	margin-top: 20px;
	padding: 5px;
	border-radius: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: ${(props) => props.theme.textArea};
	border: 1px solid ${(props) => props.theme.color};
`

const MeliImage = styled.img`
	border-radius: 12px;
	border: 1px solid;
	width: 80px;
	height: 70px;
`

const SelfieDesc = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: start;

	@media screen and (max-width: 480px) {
		margin-top: 20px;
	}
`

const FinalIcon = styled.div`
	position: relative;
	margin-top: 80px;
	width: fit-content;
	height: fit-content;

	@media screen and (max-width: 480px) {
		margin-top: 40px;
	}
`

const CheckBg = styled(FaCertificate)`
	color: ${(props) => props.theme.mainGreen};
	position: absolute;
	right: -12px;
	bottom: -4px;
`

const CheckIcon = styled(FaCheck)`
	color: ${(props) => props.theme.mainBg};
	position: absolute;
	right: -2px;
	bottom: 4px;
`

const ReviewIcon = styled(FaFacebookMessenger)`
	color: ${(props) => props.theme.mainOrange};
	position: absolute;
	right: -2px;
	bottom: 9px;
`

const AuthMobileWrapper = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	padding: 30px 18%;

	@media screen and (max-width: 480px) {
		padding: 20px;
	}
`

const PhoneInputWrapper = styled.div`
	display: flex;
	width: 240px;
	height: 44px;
	border: 1px solid
		${(props) =>
			(props.status === 'valid' && props.theme.mainOrange) ||
			(props.status === 'error' && props.theme.mainRed) ||
			props.theme.inputBorder};
	background-color: transparent;
	color: ${(props) => props.theme.color};
	border-radius: 8px;
	margin-top: 15px;
	text-align: ${(props) => props.textAlign && props.textAlign};
	direction: ltr;

	@media screen and (max-width: 480px) {
		font-size: 0.9rem;
		height: 32px;
		margin-top: 8px;
		width: ${(props) => props.width || '100%'};
	}
`

const PhoneInput = styled.input`
	width: 70%;
	font-size: 1rem;
	// letter-spacing: 1.5px;
	font-weight: 500;
	background-color: transparent;
	border: none;
	outline: none;
	padding: 10px 15px;
`

const PhonePrefix = styled(PhoneInput)`
	width: 30%;
	border-right: 1px solid ${(props) => props.theme.inputBorder};
`

export {
	NextStep,
	AuthWrapper,
	AnimateBody,
	ButtonContainer,
	Error,
	Label,
	Input,
	Row,
	Wrapper,
	Box,
	ItemText,
	Arrow,
	Step,
	PersonalBox,
	Flex,
	PersonalTitle,
	Toggle,
	MeliBody,
	ImageCollector,
	MeliTitle,
	ImageGetter,
	MeliImage,
	MeliImageContainer,
	SelfieDesc,
	FinalIcon,
	CheckIcon,
	CheckBg,
	AuthMobileWrapper,
	ReviewIcon,
	PhoneInputWrapper,
	PhoneInput,
	PhonePrefix,
	RejectIcon,
}
