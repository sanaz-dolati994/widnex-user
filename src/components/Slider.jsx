import { useState } from 'react'
import styled from 'styled-components'
import { css } from 'styled-components'
import tw from 'twin.macro'

const Slider = ({ val, onSliderChange, disabled }) => {
	const [showTooltip, setShowTooltip] = useState(false)

	const onValueChange = (e) => {
		onSliderChange(e?.target?.value)
	}

	return (
		<Wrapper onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
			<Input
				type='range'
				min='0'
				max='100'
				steps='1'
				defaultValue={0}
				onInput={onValueChange}
				val={val}
				value={val}
				disabled={disabled}
			/>
			{/* {pcs.map((pc) => (
				<>
					<Pc pc={pc} onClick={() => onSliderChange(pc)} />
					<PcDesc pc={pc}>{pc}%</PcDesc>
				</>
			))} */}
			<Tooltip val={val} hide={!showTooltip}>
				{val}%
			</Tooltip>
		</Wrapper>
	)
}

const pcs = [25, 50, 75, 100]

const Wrapper = styled.div`
	height: 50px;
	width: 100%;
	position: relative;
`

const Tooltip = styled.div`
	width: 40px;
	height: 30px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: ${(props) => props.theme.color};
	font-size: 0.9rem;
	position: absolute;
	background-color: ${(props) => props.theme.orderHover};
	border-radius: 6px;
	top: -30px;
	right: ${(props) => 100 - props.val - 8}%;

	${(props) =>
		props.hide &&
		css`
			display: none;
		`}
`

const handlePcPosition = (pc) => {
	if (pc === 25) return '75%'
	if (pc === 50) return '50%'
	if (pc === 75) return '25%'
	return '0%'
}

const Pc = styled.div`
	width: 8px;
	height: 8px;
	border-radius: 4px;
	transform: rotate(45deg);
	background-color: ${(props) => props.theme.primary};
	position: absolute;
	top: 10px;
	right: ${({ pc }) => handlePcPosition(pc)};
	cursor: pointer;
	z-index: 1;
`

const PcDesc = styled.div`
	position: absolute;
	//display: inline-block;
	right: ${({ pc }) => `calc(${handlePcPosition(pc)} - 1%)`};
	color: ${(props) => props.theme.color}90;
	font-size: 0.55rem;
`

const Input = styled.input`
	-webkit-appearance: none;
	width: 100%;
	height: 4px;
	background: ${(props) => props.theme.sliderBg};
	border-radius: 32px;
	outline: none;
	border: none;
	direction: ltr;
	position: relative;

	&::after {
		content: ' ';
		position: absolute;
		height: 4px;
		left: 0;
		top: 0;
		width: calc(${(props) => props.val}%);
		/* width: calc(${(props) => props.val}% - ${(props) => (props.val > 50 ? '14px' : '6px')}); */
		background-color: ${(props) => props.theme.mainOrange};
		border-radius: 3px;
	}

	&::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: 1.2rem;
		width: 1.2rem;
		transform: rotate(45deg);
		/* background-color: ${(props) => props.theme.color}; */
		background-color: #0773F1;
		border: 3px solid ${(props) => props.theme.color};
		border-radius: 3px;
		cursor: pointer;
		z-index: 2;
		position: relative;

		${() => tw`rounded-full`}
	}
`

export default Slider
