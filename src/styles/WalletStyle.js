import styled, { css } from 'styled-components'
import tw from 'twin.macro'

const ChartWrapper = styled.div`
	width: ${(props) => props.width || '50%'};
	margin: auto;
	height: auto;

	@media screen and (max-width: 480px) {
		//height: 200px;
	}
`

const VisibilityToggleContainer = styled.div`
	position: absolute;
	top: 20px;
	right: ${(props) => !props.theme.english && '110px'};
	left: ${(props) => props.theme.english && '110px'};
`

export { ChartWrapper, VisibilityToggleContainer }
