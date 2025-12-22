import { NewUsersWrapper, QuestionRow, Question, QuestionBox } from '../utils/Styles'
import { questions } from '../utils/new-users-faq'
import { DText, FlexStart } from '../../../../styles/CommonStyles'
import Text from '../../../../core/utils/Text'
import { FiChevronLeft } from 'react-icons/fi'
import { variants } from '../../../../core/utils/common'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Description from './Description'

const NewUsers = () => {
	const [selectedQuestion, setSelectedQuestion] = useState(null)
	const [descOpen, setDescOpen] = useState(false)

	const onDescOpen = (question) => {
		setSelectedQuestion(question)
		setDescOpen(true)
	}
	const onDescClose = () => setDescOpen(false)

	return (
		<>
			<NewUsersWrapper variants={variants} initial={'out'} exit={'out'} animate={'in'}>
				<FlexStart style={{ padding: '8px 14px' }}>
					<DText color={'#00000098'} fontSize={'0.9rem'}>
						<Text tid={'select-subject'} />
					</DText>
				</FlexStart>
				<QuestionBox>
					{questions.map((question) => (
						<QuestionRow onClick={() => onDescOpen(question)}>
							<Question>{question.title}</Question>
							<FiChevronLeft color={'#00000080'} size={18} />
						</QuestionRow>
					))}
				</QuestionBox>
			</NewUsersWrapper>
			<AnimatePresence exitBeforeEnter>
				{descOpen && <Description question={selectedQuestion} onClose={onDescClose} />}
			</AnimatePresence>
		</>
	)
}

export default NewUsers
