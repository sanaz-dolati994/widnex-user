import styled from 'styled-components'
import tw from 'twin.macro'

export const TreeWrapper = styled.div`
	${() => tw`overflow-x-auto`}
`

export const TreeItem = styled.div`
	margin: 0 0 1em;
	text-align: center;

	&,
	ul,
	li {
		direction: ltr;
		list-style: none;
		margin: 0;
		padding: 0;
		position: relative;
	}

	&,
	ul {
		margin: auto;
		display: table;
	}

	ul {
		width: 100%;
	}

	li {
		display: table-cell;
		padding: 0.5em 0;
		vertical-align: top;

		&:before {
			outline: solid 1px #666;
			content: '';
			left: 0;
			position: absolute;
			right: 0;
			top: 0;
		}

		&:first-child:before {
			left: 50%;
		}

		&:last-child:before {
			right: 50%;
		}
	}

	.node-details {
		border: solid 0.2em ${(props) => props.theme.mainOrange};
		border-radius: 0.2em;
		display: inline-block;
		margin: 0 0.2em 0.5em;
		padding: 0.2em 0.5em;

		${() => tw`relative w-[115px] h-[115px] sm:w-[125px] sm:h-[125px] rounded-full`}

		& > div {
			border: solid 0.25em ${(props) => props.theme.black};
			background: ${(props) => props.theme.input};

			${() =>
				tw`absolute w-full h-full rounded-full left-0 top-0 right-0 bottom-0 flex items-center justify-center flex-col`}

			span {
				color: ${(props) => props.theme.mainOrange};
				word-break: break-word;

				${() => tw`text-xs p-2`}
			}
		}
	}

	ul:before,
	.node-details:before,
	span:before {
		outline: solid 1px #666;
		content: '';
		height: 0.5em;
		left: 50%;
		position: absolute;
	}

	ul:before {
		top: -0.5em;
	}

	.node-details:before,
	span:before {
		top: -0.55em;
	}

	& > li {
		margin-top: 0;
	}

	& > li:before,
	& > li:after,
	& > li > .node-details:before,
	& > li > span:before {
		outline: none;
	}
`
