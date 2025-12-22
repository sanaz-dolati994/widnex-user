import styled, { css, keyframes } from 'styled-components'
import { FiMessageSquare } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { IoIosClose, IoIosArrowBack } from 'react-icons/io'

const SupportWrapper = styled.div`
	position: fixed;
	bottom: 20px;
	left: 25px;
	direction: ${(props) => (props.theme.english ? 'ltr' : 'rtl')};
	font-family: 'Vazir';
	z-index: 100000;

	@media screen and (max-width: 768px) {
		bottom: 62px;
		left: 20px;

		${(props) =>
			props.boxOpen &&
			css`
				bottom: 20px;
				left: 25px;
			`};
	} ;
`

const SupportButton = styled.div`
	border-radius: 50%;
	width: 56px;
	height: 56px;
	background-color: ${(props) => props.theme.mainOrange};
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
	cursor: pointer;
	position: relative;
`

const SupportIcon = styled(FiMessageSquare)`
	color: whitesmoke;
`

const AnimatedDotsWrapper = styled.div`
	display: flex;
	justify-content: space-around;
	position: absolute;
	margin: auto;
	top: calc(50% - 3px);
`

const animate = (theme, idx) => keyframes`
  ${(idx - 1) * 8}% {                // 0 - 10% - 20%
    transform: translateY(-4px);
  }
  ${idx * 8}% {                      // 10% - 20% - 30%
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
`

const AnimatedDot = styled.div`
	width: 3px;
	height: 3px;
	border-radius: 50%;
	background-color: whitesmoke;
	position: absolute;
	left: ${({ idx }) => {
		switch (idx) {
			case 1:
				return 'calc(50% - 7px)'
			case 2:
				return 'calc(50% - 2px)'
			default:
				return 'calc(50% + 3px)'
		}
	}};
	margin: 0 1px;
	animation: ${(props) => animate(props.theme, props.idx)} 3.5s infinite ease-out;
`

const SupportBoxWrapper = styled(motion.div)`
	position: absolute;
	width: 320px;
	height: 600px;
	overflow-y: hidden;
	border: 1px solid ${(props) => props.theme.color}10;
	background-color: ${(props) => props.theme.mainBg};
	border-radius: 8px;
	bottom: 0;
	left: 0;
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);

	&::after {
		content: ' ';
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		bottom: 0;
		background-color: ${(props) => props.theme.color};
		z-index: 1;
	}

	@media screen and (max-width: 768px) {
		height: 500px;
	} ;
`

const SupportBoxBody = styled.div`
	height: 78%;
	border-radius: 24px 24px 0 0;
	width: 99%;
	position: absolute;
	bottom: 0;
	left: 0.5%;
	z-index: 12;
	background-color: #fafafa;
	box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
	display: flex;
	flex-direction: column;
	padding: 20px 10px;
`

const CloseBtn = styled(IoIosClose)`
	color: #0d1726;
	position: absolute;
	top: 8px;
	left: 8px;
	cursor: pointer;
	z-index: 11;
	&:hover {
		background-color: #00000015;
		border-radius: 50%;
	}
`

const BackBtn = styled(IoIosArrowBack)`
	color: #0d1726;
	position: absolute;
	top: 8px;
	left: 8px;
	cursor: pointer;
	z-index: 11;
`

const CrispNav = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 52px;
	margin: 10px 0;
	width: 100%;
	padding: 0 15px;
	border-radius: 12px;
	box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.2);
	background-color: white;
	cursor: pointer;
	transition: all 0.3s;
	font-size: 1rem;

	&:hover {
		background-color: #0d172630;
	}
`

const NewUsersWrapper = styled(motion.div)`
	display: block;
	width: 100%;
	height: 100%;
	background-color: #fafafa;
	position: absolute;
	border-radius: 24px 24px 0 0;
	z-index: 4;
	left: 0;
	top: 0;
	padding: 30px 0;
`

const QuestionRow = styled.div`
	padding: 10px 12px;
	border-bottom: 1px solid #0d172615;
	margin: 4px 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-radius: 4px;
	cursor: pointer;

	&:hover {
		background-color: #0d172610;
	}
`

const Question = styled.span`
	width: 80%;
	color: #0d1726;
	font-size: 0.9rem;
	line-break: strict;
`

const QuestionBox = styled.div`
	width: 100%;
	height: 100%;
	overflow-y: auto;
	padding: 4px 10px;
`

const DescriptionWrapper = styled(motion.div)`
	display: block;
	width: 100%;
	height: 100%;
	background-color: #fafafa;
	position: absolute;
	border-radius: 24px 24px 0 0;
	z-index: 5;
	left: 0;
	top: 0;
	padding: 30px 16px;
	box-shadow: 0 0 0.3rem rgb(0, 0, 0, 0.2);
`

const DescHeader = styled.div`
	color: #0d1726;
	padding: 4px 0;
	border-bottom: 1px solid #0d172615;
	font-size: 1rem;
	margin: 8px 0;
`

const DescContainer = styled.div`
	height: 85%;
	overflow-y: auto;
	padding: 12px 8px;
`

export {
	SupportWrapper,
	SupportButton,
	SupportIcon,
	AnimatedDotsWrapper,
	AnimatedDot,
	SupportBoxWrapper,
	CloseBtn,
	BackBtn,
	SupportBoxBody,
	CrispNav,
	NewUsersWrapper,
	QuestionRow,
	Question,
	QuestionBox,
	DescriptionWrapper,
	DescHeader,
	DescContainer,
}
