import styled from 'styled-components'
import { motion } from 'framer-motion'

const Flex = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
`

const MainWrapper = styled.div`
	position: relative;
	width: calc(100vw - 260px);
	padding: 20px 20px 60px 20px;
	margin-top: 82px;
	margin-right: ${(props) => !props.theme.english && '260px'};
	margin-left: ${(props) => props.theme.english && '260px'};
`

const RespWrapper = styled.div`
	position: relative;
	width: 100%;
	padding: 10px 10px 60px 10px;
	margin-top: 80px;
`

const MainBody = styled.div`
	background-color: ${(props) => props.theme.primaryBg};
	color: ${(props) => props.theme.color};
	direction: ${(props) => (props.theme.english ? 'ltr' : 'rtl')};
	font-family: ${(props) => (props.theme.english ? 'Roboto' : 'Vazir')};
	// letter-spacing: ${(props) => (props.theme.english ? '1.2px' : '1px')};
	height: 100%;
	min-height: 100vh;
	width: 100%;
	overflow: hidden;

	@media screen and (max-width: 768px) {
		padding-bottom: 60px;
	}
`

const FiltersWrapper = styled(motion.div)`
	width: 100%;
	height: calc(100vh - 5rem);
	position: fixed;
	bottom: 0;
	z-index: 5000000000;
	padding: 20px;
	left: 0;
	background-color: ${(props) => props.theme.mainBg};
	border-top-right-radius: 12px;
	border-top-left-radius: 12px;
	box-shadow: 0 0 4px black;
	border: 1px solid #ffffff15;
`

const FiltersRow = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: flex-start;
	width: 100%;
	// border-bottom: ${(props) => !props.last && '1px solid #ffffff15'};
	padding: 15px 0;
`

const FiltersText = styled.div`
	font-size: 1rem;
	color: ${(props) => (props.color ? props.theme[props.color] : props.theme.color)};

	@media screen and (max-width: 1050px) {
		font-size: 0.9rem;
	} ;
`

const FilterContent = styled.div`
	max-height: 400px;
	height: 100%;
	margin-bottom: auto;
	overflow-y: auto;
	width: 100%;
`

const FilterButton = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 12px 20px;
	min-width: 100px;
	width: 100%;
	border-radius: 8px;
	cursor: pointer;
	color: ${(props) => (props.active ? 'black' : '#c3c5b7')};
	background-color: ${(props) => (props.active ? props.theme.mainOrange : props.theme.tInputBg)};
	font-size: 0.8rem;
	box-shadow: 0 0 4px black;
`

const FilterCheckBox = styled.div`
	width: 14px;
	height: 14px;
	margin: 0 8px;
	position: relative;
	border-radius: 50%;
	cursor: pointer;
	background-color: ${(props) => (props.active ? props.theme.mainOrange : props.theme.color)};
`

const SelectDropdown = styled.select`
  width: 100%;
  padding: 8px;
  margin: 5px 0;
  border-radius: 4px;
  background-color: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};
  border: 1px solid #ccc;
  cursor: pointer;
`;


const Filters = styled.div`
	border-radius: 5px;
	border: 1px solid #ffffff15;
	background-color: ${(props) => (props.active ? props.theme.mainGreen : props.theme.tInputBg)}70;
	width: 45px;
	height: 45px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.75rem;
`

const FilterTag = styled.div`
	background-color: ${(props) => props.theme.tInputBg};
	border: 1px solid #ffffff15;
	border-radius: 12px;
	color: #c3c5b7;
	display: flex;
	padding: 4px 5px;
	font-size: 0.7rem;
	margin: 0 5px;
`

export {
	Flex,
	MainWrapper,
	MainBody,
	RespWrapper,
	FiltersWrapper,
	FiltersRow,
	FiltersText,
	FilterContent,
	FilterButton,
	FilterCheckBox,
	Filters,
	FilterTag,
	SelectDropdown
}
