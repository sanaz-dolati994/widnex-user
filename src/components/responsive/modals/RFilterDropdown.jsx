import { AnimatePresence, motion } from 'framer-motion'
import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'
import Text from '../../../core/utils/Text'
import useClickOutside from '../../../core/hooks/useClickOutside'
import { SOCKET_URL } from '../../../core/constants/urls'
import { useMainContext } from '../../../core/contexts/main'
import tw from 'twin.macro'
import { Flex } from '../../../styles/CommonStyles'

const RFilterDropdown = ({
	options,
	defaultOption,
	coinExtraInfo = {},
	onOptionChanged,
	icon,
	activeTab = null,
	width = null,
	height = null,
	isCoin = false,
	margin = null,
	rFontSize = null,
}) => {
	const {
		main: { theme },
	} = useMainContext()

	const ref = useRef()
	const [open, setOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState(defaultOption)

	useEffect(() => {
		setSelectedOption(defaultOption)
	}, [defaultOption])

	useEffect(() => {
		if (activeTab) {
			setSelectedOption(defaultOption)
		}
	}, [activeTab])

	useClickOutside(ref, () => setOpen(false))

	const changeDropdownStatus = () => {
		setOpen((state) => !state)
	}

	const onOptionClicked = (idx) => {
		onOptionChanged(idx)
		setSelectedOption(idx)
	}

	return (
		<Body
			ref={ref}
			margin={margin}
			width={width}
			height={height}
			isCoin={isCoin}
			onClick={changeDropdownStatus}
		>
			<Flex align={'center'} justify={'between'} className={'w-full px-2'}>
				{icon && <IconContainer>{icon}</IconContainer>}
				<Option fontSize={rFontSize}>
					{isCoin && coinExtraInfo?.id && (
						<>
							<Img src={SOCKET_URL + `assets/icon/${coinExtraInfo.id}.png`} alt=' ' />
							<Text tid={coinExtraInfo.fa} />
						</>
					)}
					<Text
						tid={typeof selectedOption === 'number' ? options[selectedOption] : selectedOption}
					/>
				</Option>
				<IconContainer>
					{open ? (
						<FaCaretUp size={16} color={theme === 'dark' ? '#c3c5b7' : '#0d1726'} />
					) : (
						<FaCaretDown size={16} color={theme === 'dark' ? '#c3c5b7' : '#0d1726'} />
					)}
				</IconContainer>
			</Flex>
			<AnimatePresence exitBeforeEnter>
				{open && (
					<DropBody
						width={width}
						isCoin={isCoin}
						variants={variants}
						initial='out'
						animate='in'
						exit='out'
						ref={ref}
					>
						{options.map((option, idx) => (
							<OprionsFlex key={option} onClick={() => onOptionClicked(idx)}>
								{!isCoin && <Checkbox on={idx === selectedOption} />}
								{isCoin && <Img src={SOCKET_URL + `assets/icon/${option}.png`} alt=' ' />}
								<Option className={'justify-start'} fontSize={rFontSize}>
									<Text tid={option} />
								</Option>
							</OprionsFlex>
						))}
					</DropBody>
				)}
			</AnimatePresence>
		</Body>
	)
}

const variants = {
	in: {
		opacity: 1,
		transition: { duration: 0.3 },
	},
	out: {
		opacity: 0,
		transition: { duration: 0.3 },
	},
}

const Body = styled.div`
	//min-width: 150px;
	// margin: ${(props) => props.margin || '0 20px'};
	margin: ${(props) => props.margin || '0'};
	width: ${(props) => props.width || 'fit-content'};
	// height: ${(props) => (props.isCoin && '42px') || props.height || '32px'};
	//border-radius: 6px;
	border: 1px solid #cfcfcf;
	background-color: ${(props) => props.theme.tInputBg};
	display: flex;
	justify-content: space-between;
	cursor: pointer;
	position: relative;

	@media screen and (max-width: 480px) {
		//height: 36px;
	}

	${() => tw`rounded-[6px] text-xs py-2`};
`

const DropBody = styled(motion.div)`
	min-width: 160px;
	position: absolute;
	z-index: 10;
	width: ${(props) => props.width || 'fit-content'};
	height: 150px;
	overflow: auto;
	border-radius: 6px;
	background-color: ${(props) => props.theme.tInputBg};
	top: 120%;
	display: flex;
	flex-direction: column;
`

const IconContainer = styled.div`
	//width: 25px;
	display: flex;
	justify-content: center;
	align-items: center;
`

export const Option = styled.div`
	color: ${(props) => props.theme.color};
	font-size: 14px;
	//width: 64%;
	display: flex;
	justify-content: space-around;
	//margin: 0 12px;
	align-items: center;

	@media screen and (max-width: 480px) {
		font-size: ${(props) => props.fontSize || '0.75rem'};
	}

	width: 100%;

	${() => tw`px-1`};
`

const Img = styled.img`
	width: 32px;
	height: 32px;
	margin-left: 20px;

	@media screen and (max-width: 480px) {
		width: 22px;
		height: 22px;
	}
`

const OprionsFlex = styled.div`
	display: flex;
	align-items: center;
	padding: 10px 15px;
	transition: all 0.3s;

	&:hover {
		background-color: #0d1726;
	}
`

const Checkbox = styled.div`
	background-color: ${(props) => (props.on && props.theme.mainGreen) || 'white'};
	border-radius: 50%;
	width: 12px;
	height: 12px;
	margin: 0 10px;
`

export default RFilterDropdown
