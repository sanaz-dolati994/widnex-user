import React from 'react'
import { GoSearch } from 'react-icons/go'
import { IoIosClose } from 'react-icons/io'
import styled from 'styled-components'
import { useMainContext } from '../core/contexts/main'

const SearchBox = (props) => {
	const {
		main: { lang },
	} = useMainContext()

	const {
		width,
		height,
		bgColor,
		searchValue,
		onInputValueChange,
		onCloseSearchClicked,
		onKeyDown,
		className = '',
	} = props

	return (
		<SearchBar className={className} height={height}>
			<SearchContainer width={width} bgColor={bgColor}>
				<SearchIcon />
				<SearchInput
					onKeyDown={onKeyDown ? onKeyDown : () => {}}
					placeholder={lang === 'en' ? 'Search' : 'جستجو'}
					value={searchValue}
					onChange={onInputValueChange}
				/>
				{searchValue !== '' && <CloseSearchIcon onClick={onCloseSearchClicked} />}
			</SearchContainer>
		</SearchBar>
	)
}

const SearchBar = styled.div`
	height: ${(props) => props.height || '40px'};
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
`

const SearchContainer = styled.div`
	width: ${(props) => props.width || '100%'};
	height: 70%;
	border-radius: 5px;
	display: flex;
	background-color: ${(props) => props.bgColor || props.theme.input};
	align-items: center;
	padding: ${(props) => (props.theme.english && '5px') || '2px'};
`

const SearchInput = styled.input`
	height: 75%;
	width: 100%;
	background-color: transparent;
	// color: ${(props) => props.theme.secondary};
	border: none;
	padding: 4px;
	outline: none;
	margin-top: ${(props) => !props.theme.english && '4px'};
`

const SearchIcon = styled(GoSearch)`
	color: ${(props) => props.theme.color};
	width: 16px;
	height: 16px;
	margin: 0 4px;
`

const CloseSearchIcon = styled(IoIosClose)`
	color: ${(props) => props.theme.color};
	width: 22px;
	height: 22px;
	margin: 0 4px;
	cursor: pointer;
`

export default SearchBox
