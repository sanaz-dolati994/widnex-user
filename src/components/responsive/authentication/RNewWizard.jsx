import Text from '../../../core/utils/Text'
import styled from 'styled-components'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useMainContext } from '../../../core/contexts/main'

const RWizard = ({ items, active }) => {
	const {
		main: { theme },
	} = useMainContext()
	const isDark = theme === 'dark'

	const getIconColor = (idx) => {
		let iconColor = ''
		if (theme === 'dark') {
			iconColor = idx === active ? '#d9d9d9' : 'rgba(255, 255, 255, 0.5)'
		} else {
			iconColor = idx === active ? '#fff' : '#A6A9B9'
		}

		return iconColor
	}

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
	}, [active])

	const last = items.length - 1

	return (
		<div className='flex items-center shadow-md'>
			{items.map((item, idx, array) => (
				<div className=' flex-1 flex flex-col gap-y-4 h-28' key={item.title}>
					{/* <FlexCenter width='10%' height='40px'>
						<WizardIcon
							active={idx <= active}
							last={idx === last}
							lineActive={idx <= active - 1 || active === last}
						>
							<FlexCenter width='100%' height='100%'>
								<Check active={idx <= active - 1 || active === last || true} size={12} />
							</FlexCenter>
						</WizardIcon>
					</FlexCenter> */}

					<div className='h-2/3 flex items-center justify-center'>
						{idx !== 0 ? (
							<StepLine ref={(el) => (lines.current[`before-${idx}`] = el)} />
						) : (
							<InvisibleStepLine />
						)}
						{idx === last || idx === active ? (
							<ActiveStepItem $active={idx === active}>
								<item.icon color={getIconColor(idx)} />
							</ActiveStepItem>
						) : (
							<StepItem />
						)}
						{idx !== array.length - 1 ? (
							<StepLine ref={(el) => (lines.current[`after-${idx}`] = el)} />
						) : (
							<InvisibleStepLine />
						)}
					</div>
					<h4
						className={`h-1/3 text-[10px] text-center ${
							idx === last || idx === active ? '' : 'invisible'
						}`}
					>
						<Text tid={item.title} />
					</h4>
				</div>
			))}
		</div>
	)
}

const ActiveStepItem = styled.div`
	background-color: ${(props) => (props.$active ? '#0773F1' : props.theme.wizardIconBg)};

	display: flex;
	justify-content: center;
	align-items: center;
	width: 45px;
	height: 45px;
	border-radius: 50%;
`

const StepItem = styled.div`
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background-color: #0773f1;
	position: relative;

	&::after {
		content: '';
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #d9d9d9;

		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
	}
`

const StepLine = styled.div`
	height: 2px;
	flex-grow: 1;
	background-color: ${(props) => props.theme.wizardIconBg};

	&.active {
		background-color: #0773f1;
	}
`

const InvisibleStepLine = styled(StepLine)`
	visibility: hidden;
`

export default RWizard
