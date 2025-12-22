import Text from '../../core/utils/Text'
import { Body, Title, Header } from '../../styles/layout-styles/CardLayoutStyles'

const CardLayout = (props) => {
	const {
		width,
		height,
		title = null,
		icon,
		children,
		minHeight,
		maxHeight,
		marginTop,
		styleProps = {},
		bgColor,
		...rest
	} = props

	return (
		<Body
			width={width}
			height={height}
			minHeight={minHeight}
			maxHeight={maxHeight}
			marginTop={marginTop}
			bgColor={bgColor}
			{...styleProps}
			{...rest}
		>
			{title && (
				<Header title={title}>
					<Title>
						<Text tid={title} />
					</Title>
					{icon && icon}
				</Header>
			)}
			{children}
		</Body>
	)
}

export default CardLayout
