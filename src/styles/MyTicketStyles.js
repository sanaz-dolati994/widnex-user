import styled, { css } from 'styled-components'

const TicketBody = styled.div`
	width: 100%;
	height: calc(100% - 60px);
	overflow-y: auto;
	min-height: 400px;
`

const TicketsContainer = styled.div`
	display: flex;
	flex-direction: column;
	max-height: 70vh;

`

const TextFieldContainer = styled.div`
	position: absolute;
	width: 100%;
	height: 80px;
	bottom: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	padding: 10px 30px;
	background-color: ${(props) => props.theme.textArea};
	border-bottom-left-radius: 12px;
	border-bottom-right-radius: 12px;
	box-shadow: 0 0 4px black;
`

const SendBtn = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => props.theme.color};
	color: ${(props) => props.theme.mainBg};
	font-size: 14px;
	font-weight: 600;
	border-radius: 12px;
	width: 92px;
	height: 30px;
	cursor: pointer;
`

const TextField = styled.textarea`
	width: 70%;
	background-color: transparent;
	border: none;
	resize: none;
	color: ${(props) => props.theme.color};
	font-size: 15px;
`

const MessageContainer = styled.div`
	//width: 50%;
	align-self: ${(props) => (props.type === 1 && 'flex-end') || 'flex-start'};
	height: fit-content;
	padding: 20px;
	display: flex;
	flex-direction: ${(props) => props.type === 1 && 'row-reverse'};
`

const Avatar = styled.div`
	min-width: 50px;
	max-width: 50px;
	min-height: 50px;
	max-height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	border-radius: 50%;
	border: 2px solid ${(props) => props.theme.mainOrange};
`

const MessageWrapper = styled.div`
	//width: 80%;
	margin: 0 20px;
	border-radius: 12px;
	${(props) =>
		props.type === 1 &&
		css`
			border-top-left-radius: 0 !important;
		`}
	${(props) =>
		props.type === 2 &&
		css`
			border-top-right-radius: 0 !important;
		`}
    background-color: ${(props) =>
		(props.type === 1 && props.theme.mainOrange) || props.theme.textArea};
`

const MessageContent = styled.div`
	width: ${(props) => props.width || '100%'};
	font-size: 14px;
	font-weight: 500;
	padding: 15px 10px;
	color: ${(props) => (props.type === 1 && props.theme.mainBg) || props.theme.color};
	text-align: start;
	border-bottom: 1px solid
		${(props) => (props.type === 1 && props.theme.mainBg) || props.theme.color}60;
`

const MessageFooter = styled.div`
	padding: 8px 20px;
	font-size: 11px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: ${(props) => (props.type === 1 && props.theme.mainBg) || props.theme.color};
	flex-wrap: wrap;
`

const AdminName = styled.div`
	margin: 0 8px;
`

const AdminFooter = styled.div`
	display: flex;
`

export {
	AdminFooter,
	AdminName,
	TicketBody,
	TextField,
	TicketsContainer,
	MessageContainer,
	MessageContent,
	MessageFooter,
	MessageWrapper,
	Avatar,
	SendBtn,
	TextFieldContainer,
}
