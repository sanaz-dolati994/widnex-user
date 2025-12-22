import styled, { css } from 'styled-components'
import tw from 'twin.macro'

const TableWrapper = styled.div`
	width: 100%;
	// height: ${(props) => props.height || '210px'};
	overflow-y: auto;
	overflow-x: auto;
	//display: flex;

	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}

	@media screen and (max-width: 960px) {
		flex-direction: column;
	}
`

const Table = styled.table`
	//position: relative;
	// width: ${(props) => props.width || '50%'};

	${() => tw`table table-auto w-full`}
`

const Row = styled.tr`
	//display: flex;
	//width: 100%;
	//padding: 0 10px;
	//margin: 5px 0;
	color: ${(props) => (props.header && props.header.secondary) || props.theme.color};
	background-color: ${(props) => props.header && props.header.bg_second};
	text-align: ${(props) => props.textAlign};
	font-weight: ${(props) => props.header && 600};
	font-size: ${(props) => props.header && '0.95rem'};
	&:nth-child(even) {
		background-color: ${(props) => props.theme.bg_second};
	}
`

export const DIV = styled.div`
	text-align: ${(props) => props.textAlign};
	font-weight: ${(props) => props.header && 600};
	font-size: ${(props) => props.header && '0.95rem'};
	color: ${(props) => (props.header && props.header.secondary) || props.theme.color};

	${() => tw`p-2`}
`

export const TD = styled.td`
	text-align: ${(props) => props.textAlign};
	font-weight: ${(props) => props.header && 600};
	font-size: ${(props) => props.header && '0.8	rem'};
	color: ${(props) => (props.header && props.header.secondary) || props.theme.color};
	&:nth-child(even) {
		background-color: ${(props) => props.theme.bg_second};
	}
	// font-family: ${(props) => !props.header && 'monospace'};

	${() => tw`p-4`};

	@media screen and (max-width: 768px) {
		font-size: 0.8rem;
	}
`

export const TH = styled.td`
	color: ${(props) => props.theme.secondary};
	font-weight: 600;
	font-size: ${(props) => props.fontSize || '0.9rem'};

	${() => tw`p-3 whitespace-nowrap`};

	@media screen and (max-width: 768px) {
		font-size: 0.8rem;
	}
`

const HeaderRow = styled.tr`
	// width: ${(props) => props.width || '100%'};
	//padding: 0 10px;
	//margin: 5px 0;
	//display: flex;
	color: ${(props) => props.theme.secondary};
	font-weight: 600;
	font-size: ${(props) => props.fontSize || '0.8rem'};
`

const HeaderColumn = styled.td`
	// width: ${(props) => props.width || '11.1%'};
	color: ${(props) => props.theme.color};
	padding: 15px 10px;
	text-align: center;
	font-size: ${(props) => props.fontSize || '0.9rem'};
	/* border-bottom: solid 1px ${(props) => props.theme.color}10; */
	border-bottom: solid 1px ${(props) => props.theme.contrastBorder};

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
		padding: 10px 8px;
	}
`

const Column = styled.td`
	transition: all 0.3s;
	padding: 15px 10px;
	// width: ${(props) => props.width || '11%'};
	color: ${(props) => props.color};
	text-align: center;
	font-size: ${(props) => (props.bold && '1.4rem') || '12px'};
	// font-family: ${(props) => props.number && 'monospace'};
	position: relative;

	@media screen and (max-width: 480px) {
		font-size: 0.8rem;
		padding: 10px 8px;
	}
`

const NoDataWrapper = styled.div`
	display: flex;
	position: absolute;
	top: ${(props) => props.top || '300px'};
	width: 100%;
	left: 0;
	text-align: center;
	justify-content: center;
`

export { TableWrapper, Table, HeaderRow, Row, HeaderColumn, Column, NoDataWrapper }
