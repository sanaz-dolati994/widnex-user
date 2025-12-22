import { CloseBtn, DescriptionWrapper, DescHeader, DescContainer } from '../utils/Styles'
import { DText } from '../../../../styles/CommonStyles'
import Text from '../../../../core/utils/Text'

const Description = ({ question, onClose }) => {
	const { title, desc } = question

	return (
		<DescriptionWrapper variants={descVariants} initial={'out'} exit={'out'} animate={'in'}>
			<CloseBtn size={24} onClick={onClose} />

			<DescHeader>
				<Text tid={title} />
			</DescHeader>
			<DescContainer>
				<DText color={'#131212'} fontSize={'0.9rem'}>
					<Text tid={desc} />
				</DText>
			</DescContainer>
		</DescriptionWrapper>
	)
}

const descVariants = {
	in: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.25 },
	},
	out: {
		opacity: 0.4,
		y: '100%',
		transition: { duration: 0.25 },
	},
}

export default Description
