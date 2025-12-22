import styled from 'styled-components'

const PairColumn = styled.div`
	display: flex;
	flex-direction: column;
	gap: 5px;
`

const PairHeading = styled.h4`
	font-size: 0.8rem;
	color: #a6a9b9;

	@media screen and (max-width: 1024px) {
		font-size: 12px;
	}
`

const PairBody = styled.p`
	@media screen and (max-width: 1024px) {
		font-size: 14px;
	}
`

const TableColumn = styled.td`
	width: ${(props) => props.width};
`

const Heading = styled.div`
	width: ${(props) => props.width || '100%'};
	display: flex;
	align-items: ${(props) => props.align || 'center'};
	justify-content: ${(props) => props.justify || 'space-between'};
`

export { PairBody, PairColumn, PairHeading, TableColumn, Heading }
