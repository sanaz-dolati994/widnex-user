import styled, { css } from 'styled-components'
import tw from 'twin.macro'

export const TextWithColor = styled.div`
	color: ${(props) => props.theme[props.color]};
`

export const RoundedIconButtonWithColor = styled.button`
	background-color: ${(props) => props.theme[props.color]};
	color: ${(props) => props.textColor || props.theme.color};

	${() => tw`p-1 rounded-md text-xs`}
`

export const CardWithColor = styled.div`
	background-color: ${(props) => props.theme[props.color]};

	${() => tw`rounded-lg p-3 w-full text-sm`}
`

export const CardHeaderAlert = styled.div`
	background-color: ${(props) => props.theme[props.bgColor]};
	color: ${(props) => props.theme[props.color]};

	${() => tw`rounded-t-lg p-3 w-full flex items-center justify-center`}

	span {
		background-color: ${(props) => props.theme[props.bgColor]};
		transform: rotate(45deg);

		${() =>
			tw`block relative top-[-20px] w-[75px] h-[75px] shadow-lg m-[-15px] flex items-center justify-center text-4xl text-white`}

		svg {
			transform: rotate(-45deg);
		}
	}
`

export const Input = styled.input`
	background-color: ${(props) => props.theme.input};
	color: ${(props) => props.theme.color};
	/* border: none; */
	outline: none;
	font-size: 1.1rem;
	direction: ltr;

	&::placeholder {
		font-size: 0.8rem;
		text-align: right;
	}

	${() => tw`rounded-lg bg-transparent px-5 py-2 w-full block`}
`
