import styled from 'styled-components'
import { motion } from 'framer-motion'
import { FaChevronUp } from 'react-icons/fa'
import tw from 'twin.macro'

const variants = {
	in: {
		opacity: 0,
		transition: { duration: 0.3 },
	},
	out: {
		opacity: 1,
		transition: { duration: 0.3 },
	},
}

const SymbolContainer = styled.div`
	position: absolute;
	right: ${(props) => !props.theme.english && '15px'};
	left: ${(props) => props.theme.english && '15px'};
	top: 15px;
`

const Image = styled.img`
	width: 72px;
	height: 72px;

	@media screen and (max-width: 480px) {
		width: 40px;
		height: 40px;
	}
`

const PriceContainer = styled.div`
	${() => tw`flex flex-row-reverse sm:flex-col items-center justify-between`}
	${() => tw`w-full sm:w-auto h-[45px] sm:h-[90px]`}
	${() => tw`sm:p-[5px 25px] p-0 mx-[25px] sm:m-0`}

	${(props) =>
		props.theme.english && !props.lastItem && tw`sm:border-r-[1px] border-r-0 border-r-[#f5f6ed90]`}
	${(props) =>
		!props.theme.english &&
		!props.lastItem &&
		tw`sm:border-l-[1px] border-l-0 border-l-[#f5f6ed90]`}

  ${() => tw`border-b-[1px] sm:border-b-0 border-b-[#f5f6ed90]`}
`

const Price = styled.div`
	width: ${(props) => props.width};
	font-size: 1rem;
	color: ${(props) => props.color || props.theme.color};
	// font-family: monospace;
	font-weight: 600;
	text-align: center;

	@media screen and (max-width: 960px) {
		font-size: 0.8rem;
	}
`

const ChangeBadge = styled.div`
	font-size: 1rem;
	color: #f5f6ed;
	// font-family: monospace;
	font-weight: 600;
	background-color: ${(props) => props.bgColor || 'transparent'};
	border-radius: 8px;
	padding: 5px 12px;
	direction: ltr;

	@media screen and (max-width: 480px) {
		font-size: 0.9rem;
	}
`

const PriceDesc = styled.h1`
	font-size: 1.1rem;
	color: ${(props) => props.theme.color};

	@media screen and (max-width: 480px) {
		font-size: 0.75rem;
	}
`

const ButtonContainer = styled.div`
	// width: ${(props) => props.width || '195px'};
	// height: ${(props) => props.height || '55px'};
	background-image: linear-gradient(
		180deg,
		${(props) => props.color}90 0%,
		${(props) => props.color} 60%,
		${(props) => props.color}90 100%
	);
	backdrop-filter: blur(17px);
	box-shadow: 2px 4px 15px ${(props) => props.color}60;
	-webkit-backdrop-filter: blur(17px);
	border-radius: 21px;
	// margin: ${(props) => props.margin || '0 20px'};
	cursor: pointer;

	${() => tw`flex py-1.5 sm:py-3 px-3 sm:px-7 items-center justify-start`}
`

const BtnText = styled.h1`
	color: #f5f6ed;
	font-size: 1.1rem;

	${() => tw`pr-3`}

	@media screen and (max-width: 480px) {
		font-size: 0.9rem;
	}
`

const Dropdown = styled(motion.div)`
	width: 100%;
	height: 100%;
	margin: 0 auto;
	padding-top: 40px;
	position: absolute;
	background-color: ${(props) => props.theme.secondaryBg};
	top: 0;
	left: 0;
	border-radius: 8px;
`

const DropdownContainer = styled.div`
	width: 100%;
	height: 80%;
	overflow-y: auto;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
`

const DropdownItem = styled.div`
	color: ${(props) => props.theme.color};
	padding: 15px 25px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	transition: all 0.4s;
	cursor: pointer;
	position: relative;

	&::after {
		content: ' ';
		position: absolute;
		width: 80%;
		left: ${(props) => props.right && '15%'};
		right: ${(props) => !props.right && '15%'};
		bottom: 0;
		height: 1px;
		background: ${(props) => props.theme.color}20;
	}

	&:hover {
		background-color: ${(props) => props.theme.hover};
	}
`

const DropdownImage = styled.img`
	width: 28px;
	height: 28px;
`

const Header = styled.div`
	width: ${(props) => props.width};
	font-size: 1rem;
	color: ${(props) => props.theme.color};
	font-weight: 600;
	text-align: center;

	@media screen and (max-width: 960px) {
		font-size: 0.8rem;
	}
`

const ModalDismissBtn = styled(FaChevronUp)`
	width: 20px;
	height: 20px;
	color: ${(props) => props.theme.mainOrange};
	position: absolute;
	top: 22px;
	right: ${(props) => props.theme.english && '20px'};
	left: ${(props) => !props.theme.english && '20px'};
	cursor: pointer;
`

export {
	variants,
	PriceContainer,
	PriceDesc,
	Price,
	ModalDismissBtn,
	SymbolContainer,
	ChangeBadge,
	Image,
	Dropdown,
	DropdownImage,
	Header,
	DropdownContainer,
	DropdownItem,
	BtnText,
	ButtonContainer,
}
