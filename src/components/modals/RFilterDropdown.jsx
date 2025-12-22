import { AnimatePresence, motion } from 'framer-motion'
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import styled from 'styled-components'
import { FaCaretUp, FaCaretDown } from 'react-icons/fa'
import Text from '../../core/utils/Text'
import useClickOutside from '../../core/hooks/useClickOutside'
import { SOCKET_URL } from '../../core/constants/urls'
import { useMainContext } from '../../core/contexts/main'
import { formatNumber } from '../../core/utils/common'
import { FilterTag } from '../../styles/layout-styles/CommonStyles'

const RFilterDropdown = forwardRef((props, ref) => {
	const {
		options,
		defaultOption,
		onOptionChanged,
		icon,
		activeTab = null,
		width = null,
		heigth = null,
		isCoin = false,
		margin = null,
		rFontSize = null,
		type = null,
		onClick,
	} = props

	const {
		main: { theme },
	} = useMainContext()
	const outsideRef = useRef()

	const [open, setOpen] = useState(false)
	const [shownOptions, setShownOptions] = useState(options)
	const [searchValue, setSearchValue] = useState('')
	const [isCoinBorderActive, setIsCoinBorderActive] = useState(false)
	const [selectedOption, setSelectedOption] = useState(null)

	useImperativeHandle(ref, () => ({
		reset() {
			setSelectedOption(defaultOption)
		},
	}))

	useEffect(() => {
		setShownOptions(options)
	}, [options])

	useEffect(() => {
		setSelectedOption(
			typeof defaultOption === 'number' ? shownOptions[defaultOption] : defaultOption
		)
	}, [defaultOption])

	useEffect(() => {
		if (activeTab) {
			setSelectedOption(defaultOption)
		}
	}, [activeTab])

	useClickOutside(outsideRef, () => {
		setOpen(false)
		setIsCoinBorderActive(false)
	})

	const changeDropdownStatus = () => {
		setOpen((state) => !state)
		if (options.length === 0) {
			onClick()
			return
		}
		setIsCoinBorderActive(true)
	}

	const onOptionClicked = (idx) => {
		onOptionChanged(idx)
		setSelectedOption(isCoin ? shownOptions[idx] : idx)
		setSearchValue('')
		setShownOptions(options)
	}

	const onSearchValueChange = (e) => {
		const val = e?.target?.value
		setSearchValue(val)
		const filtered = options.filter(
			(o) => o.coin.includes(val) || o.fa.includes(val) || o.name.toLowerCase().includes(val)
		)
		setShownOptions(filtered)
	}

	return (
		<Body
			ref={outsideRef}
			margin={margin}
			width={width}
			height={heigth}
			isCoin={isCoin}
			active={isCoinBorderActive}
			onClick={changeDropdownStatus}
		>
			{icon && <IconContainer>{icon}</IconContainer>}
			<Option fontSize={rFontSize}>
				{isCoin ? (
					selectedOption?.id ? (
						<CoinOption
							type={type}
							option={selectedOption}
							open={open}
							searchValue={searchValue}
							onSearchValueChange={onSearchValueChange}
						/>
					) : (
						<Text tid={selectedOption} />
					)
				) : (
					<Text
						tid={typeof selectedOption === 'number' ? shownOptions[selectedOption] : selectedOption}
						className='text-pcolor-light dark:text-pColor'
					/>
				)}
			</Option>
			<IconContainer>
				{open ? (
					<FaCaretUp size={14} color={theme === 'dark' ? '#c3c5b7' : '#0d1726'} />
				) : (
					<FaCaretDown size={14} color={theme === 'dark' ? '#c3c5b7' : '#0d1726'} />
				)}
			</IconContainer>
			<AnimatePresence exitBeforeEnter>
				{open && (
					<DropBody
						width={width}
						isCoin={isCoin}
						variants={variants}
						initial='out'
						animate='in'
						exit='out'
						ref={outsideRef}
					>
						{shownOptions?.map((option, idx) =>
							isCoin ? (
								<Padding padding='10px 15px' onClick={() => onOptionClicked(idx)}>
									<CoinOption type={type} option={option} />
								</Padding>
							) : (
								<Flex
									key={option}
									onClick={() => onOptionClicked(idx)}
									style={{ backgroundColor: idx === selectedOption ? 'gray' : 'unset' }}
								>
									{/* <Checkbox on={idx === selectedOption} /> */}
									<Option fontSize={rFontSize}>
										<Text tid={option} />
									</Option>
								</Flex>
							)
						)}
					</DropBody>
				)}
			</AnimatePresence>
		</Body>
	)
})

const CoinOption = ({ option, type, open, searchValue, onSearchValueChange }) => {
	const {
		main: { lang },
	} = useMainContext()

	return (
		<>
			{option ? (
				open ? (
					<Input
						value={searchValue}
						onChange={onSearchValueChange}
						placeholder={
							lang === 'en' ? 'Please choose a coin...' : 'لطفا ارز مورد نظر را انتخاب کنید...'
						}
						autoFocus
					/>
				) : (
					<FlexCenter>
						<FlexCenter width='20%'>
							<Img src={SOCKET_URL + `assets/icon/${option.id}.png`} alt=' ' />
						</FlexCenter>
						<FlexStart width='30%'>
							<DText>{option[lang === 'en' ? 'name' : 'fa']?.toUpperCase()}</DText>
						</FlexStart>
						<FlexEnd width='50%'>
							<DText>{formatNumber(option[type])}</DText>
						</FlexEnd>
					</FlexCenter>
				)
			) : null}
		</>
	)
}

const Input = styled.input`
	width: 100%;
	height: 100%;
	border: none;
	background-color: transparent;
	color: ${(props) => props.theme.color};
	outline: none;
`

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
	min-width: ${(props) => (props.isCoin ? '260px' : '160px')};
	width: 100%;
	height: 48px !important;
	padding: 0 6px;
	/* background-color: #c33; */
	border-radius: 8px;
	border: 1px solid
		${(props) =>
			props.isCoin ? (props.active ? props.theme.mainOrange : 'transparent') : '#757575'};
	display: flex;
	justify-content: space-between;
	cursor: pointer;
	position: relative;
`

const DropBody = styled(motion.div)`
	min-width: ${(props) => (props.isCoin ? '220px' : '160px')};
	position: absolute;
	z-index: 100;
	width: 100%;
	min-height: 100px;
	height: fit-content;
	border-radius: 6px;
	background-color: ${(props) => props.theme.tInputBg};
	top: 120%;
	right: 0;
	display: flex;
	flex-direction: column;
	max-height: 300px;
	overflow-y: auto;
`

const IconContainer = styled.div`
	width: 25px;
	display: flex;
	justify-content: center;
	align-items: center;
`

const Option = styled.div`
	color: ${(props) => props.theme.color};
	font-size: 0.9rem;
	width: 64%;
	display: flex;
	justify-content: flex-start;
	margin: 0 12px;
	padding: 5px 0;
	align-items: center;

	@media screen and (max-width: 768px) {
		font-size: ${(props) => props.fontSize || '0.8rem'};
	}

	@media screen and (max-width: 480px) {
		font-size: ${(props) => props.fontSize || '0.7rem'};
	}
`

const Img = styled.img`
	width: 32px;
	height: 32px;
	margin: 0 20px;

	@media screen and (max-width: 480px) {
		width: 22px;
		height: 22px;
	}
`

const Flex = styled.div`
	display: flex;
	align-items: center;
	padding: 5px 0;
	transition: all 0.3s;

	&:hover {
		background-color: ${(props) => props.theme.mainBg}70;
	}
`

const Checkbox = styled.div`
	background-color: ${(props) => (props.on && props.theme.mainGreen) || 'white'};
	border-radius: 50%;
	width: 12px;
	height: 12px;
	margin: 0 10px;
`

const Padding = styled.div`
	width: 100%;
	height: 100%;
	padding: ${(props) => props.padding};
	display: inherit;
	justify-content: inherit;
	align-items: inherit;
`

const FlexStart = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	width: ${(props) => props.width};
	height: ${(props) => props.height};
`

const FlexEnd = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: ${(props) => props.width};
	height: ${(props) => props.height};
`

const FlexCenter = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: ${(props) => props.width || '100%'};
	height: ${(props) => props.height || 'fit-content'};
`

const DText = styled.div`
	font-size: ${(props) => props.fontSize || '0.8rem'};
	color: ${(props) => props.color || props.theme.color};
	direction: ${(props) => props._type === 'number' && 'ltr'};
	// font-family: ${(props) => props.type === 'number' && 'monospace'};

	@media screen and (max-width: 1400px) {
		font-size: ${(props) => props.fontSize || '0.65rem'};
		// letter-spacing: 0.8px;
	}

	@media screen and (max-width: 480px) {
		font-size: ${(props) => props.fontSize || '0.7rem'};
	}
`

export default RFilterDropdown
