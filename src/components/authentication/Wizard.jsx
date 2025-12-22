import { FaRegCheckCircle } from 'react-icons/fa'
import Text from '../../core/utils/Text'
import styled from 'styled-components'
import { Fragment } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useMainContext } from '../../core/contexts/main'

const Wizard = ({ items, active }) => {
	const {
		main: { theme },
	} = useMainContext()
	const isDark = theme === 'dark'

	const lines = useRef([])

	useEffect(() => {
		switch (active) {
			case 0:
				break
			case 1:
				lines.current['after-0'].className += ' active'
				lines.current['before-1'].className += ' active'
				break
			case 2:
				lines.current['after-0'].className += ' active'
				lines.current['before-1'].className += ' active'
				lines.current['after-1'].className += ' active'
				lines.current['before-2'].className += ' active'
				break
			case 3:
				lines.current['after-0'].className += ' active'
				lines.current['before-1'].className += ' active'
				lines.current['after-1'].className += ' active'
				lines.current['before-2'].className += ' active'
				lines.current['after-2'].className += ' active'
				lines.current['before-3'].className += ' active'
				break
			case 4:
				lines.current['after-0'].className += ' active'
				lines.current['before-1'].className += ' active'
				lines.current['after-1'].className += ' active'
				lines.current['before-2'].className += ' active'
				lines.current['after-2'].className += ' active'
				lines.current['before-3'].className += ' active'
				lines.current['after-3'].className += ' active'
				lines.current['before-4'].className += ' active'
				break
			default:
				break
		}
	}, [active, theme])

	return (
		<div className='flex justify-center items-center w-1/2 mx-auto'>
			{items.map((item, idx, array) => (
				<Fragment key={item.title}>
					<StepContainer>
						<div className='flex items-center w-full'>
							{idx !== 0 ? (
								<StepLine ref={(el) => (lines.current[`before-${idx}`] = el)} />
							) : (
								<InvisibleStepLine />
							)}
							<StepIcon $active={idx === active}>
								{idx < active ? (
									<FaRegCheckCircle color='#0773F1' />
								) : (
									<item.icon
										color={
											isDark
												? idx === active
													? '#d9d9d9'
													: 'rgba(255, 255, 255, 0.5)'
												: idx === active
												? '#fff'
												: '#A6A9B9'
										}
									/>
								)}
							</StepIcon>
							{idx !== array.length - 1 ? (
								<StepLine ref={(el) => (lines.current[`after-${idx}`] = el)} />
							) : (
								<InvisibleStepLine />
							)}
						</div>

						<div
							className={`text-center text-sm mt-2 ${
								active !== idx ? 'text-pcolor-light dark:text-white/50' : ''
							}`}
						>
							<Text tid={item.title} />
						</div>
					</StepContainer>
				</Fragment>
			))}
		</div>
	)
}

export default Wizard

const StepIcon = styled.div`
	background-color: ${(props) => (props.$active ? '#0773F1' : props.theme.wizardIconBg)};

	display: flex;
	justify-content: center;
	align-items: center;
	width: 45px;
	height: 45px;
	border-radius: 50%;
`

const StepContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex: 1;
`

const StepLine = styled.div`
	height: 8px;
	flex-grow: 1;
	background-color: ${(props) => props.theme.wizardIconBg};

	&.active {
		background-color: #0773f1;
	}
`

const InvisibleStepLine = styled(StepLine)`
	visibility: hidden;
`
