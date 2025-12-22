import styled, { css } from 'styled-components'
import { FaCheck } from 'react-icons/fa'

const WizardIcon = styled.div`
	width: ${(props) => (props.active ? '16px' : '12px')};
	height: ${(props) => (props.active ? '16px' : '12px')};
	background-color: ${(props) => (props.lineActive ? props.theme.mainOrange : props.theme.mainBg)};
	border-radius: 50%;
	border: 2px solid ${(props) => (props.active ? props.theme.mainOrange : props.theme.input)};
	position: relative;
	margin: 0 8px;
	transition: all 0.5 s;

	${(props) =>
		!props.last &&
		css`
			&:after {
				content: ' ';
				position: absolute;
				background-color: ${(props) =>
					props.lineActive ? props.theme.mainOrange : props.theme.input};
				height: 40px;
				${(props) =>
					!props.theme.english &&
					css`
						right: ${(props) => (props.active ? '5px' : '3px')};
					`}
				${(props) =>
					props.theme.english &&
					css`
						left: ${(props) => (props.active ? '5px' : '3px')};
					`}

                width: 2px;
				z-index: -1;
			}
		`}
`

const RWizardWrapper = styled.div`
	width: 100%;
	//position: fixed;
	position: sticky;
	/* bottom: 0; */
	top: 80px;
	left: 0;
	z-index: 10;
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	box-shadow: 0 0 4px ${(props) => props.theme.mainBg};
	background-color: ${(props) => props.theme.mainBg};
	padding: 10px;
`

const Check = styled(FaCheck)`
	color: ${(props) => (props.active ? props.theme.mainBg : 'transparent')};
`

const RFixedButton = styled.div`
	position: fixed;
	bottom: 60px;
	left: 0;
	right: 0;
	padding: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	z-index: 10;
	background-color: ${(props) => props.theme.primaryBg};
`

export { WizardIcon, RWizardWrapper, Check, RFixedButton }
