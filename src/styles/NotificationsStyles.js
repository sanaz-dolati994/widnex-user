import styled from 'styled-components'
import tw from 'twin.macro'

export const Badge = styled.span`
	border-radius: 12px;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	color: ${(props) => props.theme.color};
	font-size: 0.65rem;
	
	${() => tw`px-2 py-0 mt-1 `}
`

export const Indicator = styled.span`
	background-color: ${(props) => props.color};

	${() => tw`p-0 mr-2 inline-block w-[7.5px] h-[7.5px] rounded-full`}
`
