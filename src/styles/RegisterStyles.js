import styled from 'styled-components'
import { motion } from 'framer-motion'

const Wrapper = styled.div`
	width: 100%;
	min-height: 80vh;
	//margin-right: ${(props) => !props.theme.english && '-130px'};
	// margin-left: ${(props) => props.theme.english && '-130px'};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	@media screen and (max-width: 480px) {
		margin: 0;
	}
`

const Body = styled.div`
	position: relative;
	background-color: ${(props) => props.theme.secondaryBg};
	min-width: 500px;
	padding: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 20px;
	box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
	transition: all 0.3s 0.3s;

	@media screen and (max-width: 768px) {
		min-width: 90%;
	}
`

const Title = styled.div`
	color: ${(props) => props.theme.secondary};
	font-size: 1.1rem;
	font-weight: 600;
	// letter-spacing: 1.3px;

	@media screen and (max-width: 480px) {
		font-size: 0.9rem;
	}
`

const Row = styled.div`
	width: 80%;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin-top: ${(props) => props.marginTop || '30px'};
	position: relative;
	transition: all 0.3s;

	@media screen and (max-width: 768px) {
		width: 90%;
	}
`

const RulesContainer = styled.div`
	margin-top: 30px;
	display: flex;
	align-items: center;
	color: ${(props) => props.theme.color};

	@media screen and (max-width: 768px) {
		font-size: 0.9rem;
	}
`

const Rules = styled.span`
	color: ${(props) => props.theme.mainOrange};
	font-size: ${(props) => props.fontSize || '1rem'};
	margin: 0 5px;
	cursor: pointer;

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
	}
`

const CheckBox = styled.div`
	width: 24px;
	height: 24px;
	margin: 0 10px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50%;
	cursor: pointer;
	background-color: ${(props) => props.theme.input};
	box-shadow: 0 0 2px black;

	@media screen and (max-width: 768px) {
		width: 18px;
		height: 18px;
	}
`

const Label = styled.div`
	font-size: 0.9rem;
	color: ${(props) => props.theme.mainOrange}98;
	margin: 0 10px;
	white-space: nowrap;

	@media screen and (max-width: 768px) {
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
	height: 38px;
	outline: none;
	border: 1px solid
		${(props) =>
		(props.status === 'valid' && props.theme.mainGreen) ||
		(props.status === 'error' && props.theme.mainRed) ||
		props.theme.color};
	background-color: ${(props) => props.theme.input};
	color: ${(props) => props.theme.color};
	border-radius: 18px;
	margin-top: 5px;
	font-size: 1rem;
	// letter-spacing: 1.5px;
	font-weight: 500;
	padding: 10px 20px;
	direction: ltr;
`

const SubmitBtn = styled.div`
	//position: absolute;
	//bottom: 50px;
	margin-top: 30px;
	width: 120px;
	height: 30px;
	border-radius: 12px;
	// color: ${(props) => props.theme.black};
	color: ${(props) => (props.active ? '#ffffff' : props.theme.black)};
	background-color: ${(props) => (props.active && props.theme.mainOrange) || props.theme.input};
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 0 4px ${(props) => props.theme.primaryBg};
	font-weight: 600;
	cursor: ${(props) => (props.active && 'pointer') || 'not-allowed'};
	pointer-events: ${(props) => (props.active ? 'auto' : 'none')};

	@media screen and (max-width: 480px) {
		font-size: 0.9rem;
	}
`

const Error = styled.div`
	position: absolute;
	bottom: -24px;
	width: 100%;
	margin: 0 auto;
	text-align: center;
	color: ${(props) => props.theme.mainRed};
	font-size: 12px;
	// letter-spacing: 1.2px;

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
	}
`

const TabChanger = styled.div`
	//position: absolute;
	bottom: 15px;
	margin-top: 25px;
	display: flex;
	align-items: center;
	font-size: 1rem;
	// color: ${(props) => props.theme.color};

	@media screen and (max-width: 480px) {
		font-size: 0.9rem;
	}
`

const SingUpRows = styled(motion.div)`
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
`

const Flex = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
`

const ResendCotainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`

const Item = styled.div`
	margin: 0 5px;
	color: ${(props) => (props.active && props.theme.mainOrange) || (props.color && props.color)};
	font-size: ${(props) => props.fontSize || '12px'};
	cursor: ${(props) => props.cursor || ''};

	@media screen and (max-width: 480px) {
		font-size: 0.9rem;
	}
`

export {
	Wrapper,
	Body,
	Item,
	Input,
	ResendCotainer,
	Flex,
	SingUpRows,
	TabChanger,
	Error,
	SubmitBtn,
	Label,
	Title,
	Row,
	Rules,
	RulesContainer,
	CheckBox,
}
