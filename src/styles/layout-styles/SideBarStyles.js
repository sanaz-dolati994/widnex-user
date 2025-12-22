import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'
import { FaSignOutAlt } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Body = styled.div`
	min-width: 260px;
	max-width: 260px;
	height: 96vh;
	margin-top: 80px;
	border-top-right-radius: 8px;
	border-top-left-radius: 8px;
	background-color: ${(props) => props.theme.mainBg};
	position: fixed;
	box-shadow: 0 0 4px #00000050;
`

const RespBody = styled(motion.div)`
	min-width: 220px;
	max-width: 220px;
	margin-top: 80px;
	z-index: 101;
	border-top-right-radius: 8px;
	border-top-left-radius: 8px;
	background-color: ${(props) => props.theme.mainBg};
	position: fixed;
	right: 0;
	top: 0;
`

const LinkWrapper = styled.div`
	margin: 35px 0;
`

const MLink = styled.div`
	width: 100%;
	margin: 8px 0;
	padding: 12px 8px;
	cursor: pointer;
	text-decoration: none;
	transition: all 0.3s;
	position: relative;
	font-size: 0.9rem;

	color: ${(props) => (props.active ? '#ffffff' : props.theme.color)};

	${(props) =>
		props.active &&
		css`
			background-color: ${(props) =>
				props._theme === 'light' ? `${props.theme.active}` : props.theme.active};

			&::after {
				content: '';
				position: absolute;
				${(props) =>
					props.theme.english &&
					css`
						left: 0;
					`};
				${(props) =>
					!props.theme.english &&
					css`
						right: 0;
					`};
				top: 0;
				bottom: 0;
				height: 100%;
				width: 8px;
				background-color: ${(props) => props.theme.primary};
			}
		`}

	&:hover {
		background-color: ${(props) =>
			props._theme === 'light' ? `${props.theme.active}90` : props.theme.hover};
	}

	@media screen and (max-width: 768px) {
		font-size: 0.8rem;
	}
`

const NavItemWrapper = styled.div`
	width: 80%;
	margin: 0 auto;
	display: flex;
	align-items: center;
`

const NavText = styled.div`
	margin: 0 14px;
`

const ExitWrapper = styled.div`
	display: flex;
	width: 100%;
	padding-bottom: 20px;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s;
	&:hover {
		transform: translateY(-3px);
	}
`

const ExitText = styled.div`
	color: ${(props) => props.theme.exitRed};
	font-size: 1.4rem;
	font-weight: 600;
	margin: 0 8px;
	// letter-spacing: 1.5px;

	@media screen and (max-width: 480px) {
		font-size: 1.1rem;
	}
`

const ExitIcon = styled(FaSignOutAlt)`
	width: 20px;
	height: 20px;
	color: ${(props) => props.theme.exitRed};

	@media screen and (max-width: 480px) {
		width: 18px;
		height: 18px;
	}
`

const SubLink = styled.div`
	cursor: pointer;
	width: 100%;
	padding: 12px;
	margin-top: -8px;
	transition: all 0.3s;
	position: relative;
	font-size: 0.9rem;
	color: ${(props) => (props.active && props.theme.mainOrange) || props.theme.color};
	background-color: ${(props) => props.theme.hover};

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
	}
`

const SubLinkContainer = styled.div`
	margin: 0 30px;
	display: flex;
	align-items: center;
`

export {
	Body,
	LinkWrapper,
	MLink,
	NavItemWrapper,
	NavText,
	ExitWrapper,
	ExitText,
	ExitIcon,
	SubLink,
	SubLinkContainer,
	RespBody,
}
