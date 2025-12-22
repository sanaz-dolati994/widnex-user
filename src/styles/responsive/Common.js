import styled from 'styled-components'
import { css } from 'styled-components'

const ScrollWrap = styled.div`
	width: 100%;
	overflow-x: hidden;
	position: relative;
	height: ${(props) => props.height || '100%'};
	max-height: ${(props) => props.maxHeight};
	overflow-y: auto;
`

const RFlex = styled.div`
	display: flex;
	width: ${(props) => props.width || '100%'};
	height: 100%;
`

const RCFlex = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: ${(props) => props.width || '100%'};
`

const RFlexCenter = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`

const RFlexBetween = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const RCFlexEnd = styled.div`
	display: flex;
	flex-direction: column;
	width: ${(props) => props.width || '100%'};
	justify-content: flex-end;
`

const RText = styled.div`
	font-size: ${(props) => props.fontSize || '0.8rem'};
	color: ${(props) => props.color || props.theme.color};
`

const RRow = styled.div`
	width: calc(100% - 20px);
	height: ${(props) => props.height};
	border-bottom: 1px solid ${(props) => props.theme.color}20;
	padding: 10px 0;
	margin: 0 10px;
	display: flex;
	align-items: center;
`

const RButton = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 32px;
	width: ${(props) => props.width || '100%'};
	background-image: linear-gradient(45deg, #c3c5b7 0%, #4a454a 50%);
	color: ${(props) => props.theme.color};
	font-size: 0.8rem;
	border-radius: 8px;
	margin: ${(props) => props.margin || '30px 0 15px 0'};

	${(props) =>
		props.active &&
		css`
			background-image: none;
			background-color: ${(props) => props.theme.mainOrange};
			color: ${(props) => props.theme.mainBg};
		`}
`

export { ScrollWrap, RFlex, RCFlex, RFlexCenter, RText, RRow, RFlexBetween, RCFlexEnd, RButton }
