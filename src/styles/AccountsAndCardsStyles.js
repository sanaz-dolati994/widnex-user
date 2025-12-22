import styled from 'styled-components'
import { IoIosClose } from 'react-icons/io'
import tw from 'twin.macro'

const Body = styled.div`
	width: 100%;
	margin-top: 60px;
	display: flex;
	align-items: center;
	padding: 0 20px;
`

const Column = styled.div`
	//width: 100%;
	display: ${(props) => (props.active && 'flex') || 'none'};
	flex-direction: column;
	align-items: flex-start;
	margin: ${(props) => props.margin || '0 20px'};
	position: relative;

	${() => tw`flex-grow`};

	@media screen and (max-width: 768px) {
		margin: 15px 0;
	} ;
`

const Label = styled.div`
	font-size: 14px;
	font-weight: ${(props) => (props.theme.english ? '400' : '600')};
	padding-bottom: ${(props) => props.theme.english && '5px'};
	margin: ${(props) => props.margin || '0 10px'};
	color: ${(props) => props.theme.color};
	// letter-spacing: 1.2px;

	@media screen and (max-width: 768px) {
		font-size: 0.8rem;
	}
`
export const Select = styled.select`
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
	font-size: 0.9rem;
	// letter-spacing: 1.5px;
	font-weight: 500;
	outline: none;
	padding: 4px 12px;
	text-align: ${(props) => props.textAlign && props.textAlign};
	direction: ${(props) => props._type === 'number' && 'ltr'};

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
		margin-top: 8px;
		width: ${(props) => props.width || '100%'};
	}
`


const Input = styled.input`
	background-color: ${(props) => props.theme.tInputBg};
	border-radius: 12px;
	color: ${(props) => props.theme.color};
	width: 100%;
	height: 42px;
	padding: 10px 20px;
	font-size: ${(props) => props.fontSize || '14px'};
	// letter-spacing: ${(props) => props.letterSpacing || '1.2px'};
	direction: ${(props) => props.direction && props.direction};
	// font-family: monospace;
	border: 1px solid
		${(props) =>
			(props.borderColor === 'normal' && props.theme.color) ||
			((props.borderColor === 'error' || props.borderColor === 'bank-error') &&
				props.theme.mainRed) ||
			props.theme.mainGreen}95;
	font-weight: 600;
	outline: none;
	&::-webkit-outer-spin-button,
	::-webkit-inner-spin-button {
		display: none;
	}

	@media screen and (max-width: 768px) {
		height: 36px;
	} ;
`

const AddBtn = styled.div`
	border-radius: 12px;
	margin: 25px 20px 0 0;
	width: 120px;
	height: 36px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 1rem;
	color: ${(props) => props.theme.black};
	background-color: ${(props) => (props.active && props.theme.mainOrange) || props.theme.input};
	cursor: ${(props) => (props.active && 'pointer') || 'not-allowed'};
	pointer-events: ${(props) => (props.active ? 'auto' : 'none')};

	@media screen and (max-width: 768px) {
		font-size: 0.9rem;
	} ;
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
`

const BankInputClose = styled(IoIosClose)`
	color: ${(props) => props.theme.color} !important;
	position: absolute;
	right: 10px;
	top: 50%;
	font-size: 13px;
	cursor: pointer;
	// font-family: monospace;
`

const Prefix = styled.div`
	position: absolute;
	left: 6px;
	top: ${(props) => (props.theme.english ? '50%' : '56%')};
	font-size: 14px;
	color: ${(props) => props.theme.color};
`

export { Prefix, BankInputClose, Error, Body, Column, Label, Input, AddBtn }
