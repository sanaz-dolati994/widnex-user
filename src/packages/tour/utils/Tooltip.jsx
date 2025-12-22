import Tippy from '@tippyjs/react/headless'
import styled from 'styled-components'
import Text from '../../../core/utils/Text'

const Tooltip = (props) => {
	const { children, content, placement, disabled } = props

	return (
		<>
			{disabled ? (
				children
			) : (
				<Tippy
					placement={placement}
					render={(attr) => (
						<TooltipBody animation={false} {...attr}>
							{typeof content === 'string' ? <Text tid={content} /> : content}
						</TooltipBody>
					)}
				>
					{children}
				</Tippy>
			)}
		</>
	)
}

const TooltipBody = styled.div`
	width: ${(props) => (props.width ? props.width : 'fit-content')};
	padding: 6px 12px;
	border: 1px solid ${(props) => props.theme.color}50;
	background-image: linear-gradient(
		to right,
		${(props) => props.theme.g1},
		${(props) => props.theme.g2}
	);
	direction: ${(props) => (props.theme.english ? 'ltr' : 'rtl')};
	font-size: 0.8rem;
	max-width: 320px;
	border-radius: 4px;
	color: ${(props) => props.theme.secondary};
	font-family: YekanBakh;
	background-color: ${(props) => props.theme.input};
`

export default Tooltip
