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
import useCoinExtraInfo from '../../../core/hooks/useCoinExtraInfo'
import {
	CloseSearchIcon,
	SearchBar,
	SearchContainer,
	SearchIcon,
	SearchInput,
} from '../../../styles/CoinOperationStyles'
import { useMarketQuery } from '../../../core/services/react-query/useMarketQuery'

const RCoinDropdown = ({
	options: initialOptions,
	defaultOption,
	coinExtraInfo: selectedCoinExtraInfo,
	onOptionChanged,
	icon,
	activeTab = null,
	width = null,
	height = null,
	isCoin = false,
	margin = null,
	rFontSize = null,
}) => {
	const { data: market } = useMarketQuery()

	const [options, setOptions] = useState(market)

	const {
		main: { lang },
	} = useMainContext()
	const { getExtraInfo } = useCoinExtraInfo()

	const {
		main: { theme },
	} = useMainContext()

	const ref = useRef()
	const [open, setOpen] = useState(false)
	const [selectedOption, setSelectedOption] = useState(defaultOption)

	const [searchValue, setSearchValue] = useState('')

	const onInputValueChange = (e) => {
		const val = e?.target?.value
		setSearchValue(val || '')

		if (val?.length) {
			const filtered = market.filter(
				(c) => c?.fa?.includes(val) || c?.id?.includes(val) || c?.name?.toLowerCase()?.includes(val)
			)
			setOptions(filtered)
		} else {
			setOptions(market)
		}
	}

	const onCloseSearchClicked = () => {
		setSearchValue('')
		setOptions(market)
	}

	useEffect(() => {
		setSelectedOption(defaultOption)
	}, [defaultOption])

	useEffect(() => {
		if (activeTab) {
			setSelectedOption(defaultOption)
		}
	}, [activeTab])

	useEffect(() => {
		onInputValueChange()
		setOptions(market)
	}, [market, initialOptions])

	useClickOutside(ref, () => {
		setOpen(false)
	})

	const changeDropdownStatus = () => {
		setOpen((state) => !state)
	}

	const onOptionClicked = (idx) => {
		onOptionChanged(idx)
		setSelectedOption(idx)
		setOpen(false)
	}

	return (
		<Body ref={ref} margin={margin} width={width} height={height} isCoin={isCoin}>
			<Flex
				align={'center'}
				justify={'between'}
				className={'w-full px-5'}
				onClick={changeDropdownStatus}
			>
				{icon && <IconContainer>{icon}</IconContainer>}
				<Option fontSize={rFontSize}>
					{!!(isCoin && selectedCoinExtraInfo?.id) && (
						<>
							<Img src={SOCKET_URL + `assets/icon/${selectedCoinExtraInfo.id}.png`} alt=' ' />
							<Text tid={selectedCoinExtraInfo?.fa} />
						</>
					)}
					<Text tid={selectedCoinExtraInfo?.id} />
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
					>
						<SearchBar className={'mt-[15px]'}>
							<SearchContainer responsiveMode>
								<SearchInput
									placeholder={lang === 'en' ? 'Search' : 'جست و جو رمزارز ...'}
									value={searchValue}
									onChange={onInputValueChange}
								/>
								{searchValue !== '' ? (
									<CloseSearchIcon onClick={onCloseSearchClicked} />
								) : (
									<SearchIcon />
								)}
							</SearchContainer>
						</SearchBar>
						{options?.map((option, idx) => {
							// const coinExtraInfo = getExtraInfo(option)

							return (
								<OprionsFlex
									className={'justify-around text-xs'}
									key={option}
									onClick={() => onOptionClicked(market.indexOf(option))}
								>
									{!isCoin && <Checkbox on={idx === selectedOption} />}
									{isCoin && <Img src={SOCKET_URL + `assets/icon/${option.id}.png`} alt=' ' />}
									<Text tid={option.fa} />
									<Option className={'justify-start w-auto'} fontSize={rFontSize}>
										<Text tid={option.name} />
									</Option>
								</OprionsFlex>
							)
						})}
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
	min-width: 160px;
	margin: ${(props) => props.margin || '0 20px'};
	width: ${(props) => props.width || 'fit-content'};
	height: ${(props) => (props.isCoin && '42px') || props.height || '32px'};
	//border-radius: 6px;
	border: 1px solid #cfcfcf;
	background-color: ${(props) => props.theme.dropdown};
	display: flex;
	justify-content: space-between;
	cursor: pointer;
	position: relative;

	@media screen and (max-width: 480px) {
		height: 36px;
	}

	${() => tw`rounded-full md:rounded-[6px]`};
`

const DropBody = styled(motion.div)`
	min-width: 160px;
	position: absolute;
	z-index: 1002;
	width: ${(props) => props.width || 'fit-content'};
	height: 300px;
	overflow: auto;
	border-radius: 6px;
	background-color: ${(props) => props.theme.dropdown};
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

export default RCoinDropdown
