const { default: styled, css } = require('styled-components')

export default function CustomToggler({ active, onClick = () => {}, className = '' }) {
	return (
		<Toggler
			className={` ${
				active
					? 'bg-cBlue after:bg-white dark:after:bg-pColor'
					: 'dark:bg-white/5 bg-light-border after:bg-pcolor-light'
			} ${className}`}
			$active={active}
			onClick={onClick}
		/>
	)
}

const Toggler = styled.div`
	position: relative;
	width: 3rem;
	height: 1.5rem;
	border-radius: 9999px;
	cursor: pointer;
	border: 1px solid ${(props) => props.theme.inputBorder};

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
		transition: left 0.3s, transform 0.3s;

		${(props) =>
			props.$active
				? css`
						left: calc(100% - 5px);
						transform: translateX(-100%);
				  `
				: css`
						left: 5px;
				  `}
	}
`
