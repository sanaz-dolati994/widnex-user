import { Link } from 'react-router-dom'

const { default: styled, css } = require('styled-components')

const ItemColumn = styled.div`
	display: flex;
	flex-direction: column;
	row-gap: 8px;
	padding-inline: 10px;
`

const ItemRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-block: 10px;
`

const LinkItemRow = styled(Link)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-block: 10px;
`

const ItemData = styled.div`
	display: flex;
	gap: 10px;
	align-items: center;

	font-weight: 600;
`

const HorizontalLine = styled.div`
	width: ${(props) => props.width || '100%'};
	height: 1px;
	border-radius: 8px;
	background-color: ${(props) => props.theme.horizontalLine};
`

const Toggler = styled.div`
	position: relative;
	width: 3rem;
	height: 1.5rem;
	border-radius: 9999px;
	background-color: ${(props) => (props.$isDark ? '#0773f1' : '#555')};

	::after {
		content: '';
		position: absolute;
		display: block;
		z-index: 10;
		top: 3px;
		bottom: 3px;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background-color: white;
		transition: left 0.3s, transform 0.3s;

		${(props) =>
			props.$isDark
				? css`
						left: calc(100% - 5px);
						transform: translateX(-100%);
				  `
				: css`
						left: 5px;
				  `}
	}
`

export { HorizontalLine, ItemData, ItemColumn, ItemRow, LinkItemRow, Toggler }
