import { useCallback, useEffect, useState } from 'react'
import {
	ChangeStepIcon,
	ContentBody,
	ContentWrapper,
	PortalTarget,
	TBtn,
	TCFlex,
	TCloseIcon,
	TFlex,
	THeader,
	TourSkipWrapper,
	TText,
} from './utils/Styles'
import { getContentPosition, getOffset, getScrollPosition } from './utils/helper'
import InnerStep from './InnerStep'
import Portal from './utils/Portal'
import Text from '../../core/utils/Text'

/**
 * @param {number} step - tour step
 * @param [{{ div: Element, steps: Element[]}}] comps - tour components linked to steps
 * @param {TourOption[]} options - tour options for each step
 * @param {Function} onNext - on Next clicked
 * @param {Function} onBack - on Back clicked
 * @param {Function} onClose - on Finish tour
 * @param { boolean } fromController - is it opened from controller
 * @return {JSX.Element}
 * @constructor
 */
const TourStep = ({
	step,
	comps,
	options,
	levels,
	configs,
	onNext,
	onBack,
	onClose,
	fromController,
}) => {
	const MOUNTED_AND_VALID = comps.length > 0 && !!comps[step].div

	const [details, setDetails] = useState({})

	const [activeOption, setActiveOption] = useState(null)

	const [stage, setStage] = useState(0)

	useEffect(() => {
		if (MOUNTED_AND_VALID) {
			const comp = comps[step].div
			const offset = getOffset(comp)
			setDetails((state) => ({
				...state,
				...offset,
			}))
			// refreshing with element rect refresher
			const scrollPosition = getScrollPosition({ ...details, ...offset })
			window.scroll({
				top: scrollPosition,
				behavior: 'smooth',
			})
		}
	}, [comps, step, options])

	useEffect(() => {
		if (configs[stage]) setActiveOption(configs[stage])
	}, [configs, stage])

	const handleStepRef = useCallback((node) => {
		if (!node) return
		setDetails((state) => ({
			...state,
			nodeWidth: node.offsetWidth,
			nodeHeight: node.offsetHeight,
		}))
		const interval = setInterval(() => {
			setDetails((state) => ({
				...state,
				nodeWidth: node.offsetWidth,
				nodeHeight: node.offsetHeight,
			}))
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	const onNextClicked = () => {
		if (LAST_STEP) {
			onClose()
			return
		}
		setStage((state) => state + 1)
		if (configs[stage + 1]?.callback) configs[stage + 1]?.callback()
		if (typeof levels[stage + 1]?.stage === 'number') {
			try {
				const nextRect = getOffset(comps[step + 1].div)
				window.scroll({
					top: nextRect.top - 150,
					behavior: 'smooth',
				})
				onNext()
			} catch (err) {}
		}
	}

	const onBackClicked = () => {
		setStage((state) => state - 1)
		if (configs[stage - 1]?.callback) configs[stage - 1]?.callback()
		if (typeof levels[stage]?.stage === 'number') {
			const backRect = getOffset(comps[step - 1].div)
			window.scroll({
				top: backRect.top - 150,
				behavior: 'smooth',
			})
			onBack()
		}
	}

	const onBackStep = () => {
		const newStep = step - 1
		const newStage = configs.findIndex((item) => item.stage === newStep)
		setStage(newStage)
		onBack()
	}

	const onNextStep = () => {
		const newStep = step + 1
		const newStage = configs.findIndex((item) => item.stage === newStep)
		setStage(newStage)
		onNext()
	}

	if (!MOUNTED_AND_VALID) return <></>

	const contentPos = getContentPosition(details)
	const HAS_BACK = stage > 0
	const HAS_CHANGE_BACK = step > 0
	const HAS_CHANGE_NEXT = step + 1 < options.length
	const LAST_STEP = stage + 1 === levels.length

	return (
		<>
			<Portal>
				<PortalTarget
					width={details.width}
					height={details.height}
					left={details.left}
					top={details.top}
				/>
				<ContentWrapper top={contentPos.top} left={contentPos.left}>
					<ContentBody ref={handleStepRef}>
						<TCFlex align={'flex-start'} width={`${details.nodeWidth - 40}px`}>
							<THeader>
								{typeof activeOption?.header === 'string' || !activeOption?.header ? (
									<TText primary cFontSize={'1rem'}>
										<Text tid={activeOption?.header || options[step]?.header} />
									</TText>
								) : (
									activeOption?.header
								)}
								<TCloseIcon size={22} onClick={onClose} />
							</THeader>
							<TFlex style={{ margin: '14px 0 20px 0' }}>
								{typeof activeOption?.content === 'string' ? (
									<TText style={{ width: '300px' }} secondary yekan>
										<Text tid={activeOption?.content} />
									</TText>
								) : (
									activeOption?.content
								)}
							</TFlex>

							{!fromController && (
								<>
									<TFlex fw justify={'space-between'}>
										<TFlex>
											{HAS_CHANGE_BACK && <ChangeStepIcon size={16} onClick={onBackStep} />}
											{HAS_BACK && (
												<TBtn onClick={onBackClicked}>
													<Text tid={'back'} />
												</TBtn>
											)}
										</TFlex>

										<TFlex align={'flex-end'}>
											<TText main style={{ margin: '0 2px' }}>
												<Text tid={'step'} />:
											</TText>
											<TFlex align={'flex-end'} style={{ direction: 'ltr', margin: '0 2px' }}>
												{
													<>
														<TText primary fontSize={'b'} style={{ marginBottom: '-3px' }}>
															{step + 1}
														</TText>
														{typeof activeOption?.stage === 'string' && (
															<TText primary fontSize={'m'}>
																.
																{activeOption?.stage
																	?.split('.')
																	?.slice(1)
																	.map((item) => parseInt(item) + 1)
																	?.join('.')}
															</TText>
														)}
													</>
												}
												<TText main>/{options.length}</TText>
											</TFlex>
										</TFlex>
										<TFlex>
											<TBtn onClick={onNextClicked}>
												<Text tid={LAST_STEP ? 'done' : 'next'} />
											</TBtn>
											{HAS_CHANGE_NEXT && <ChangeStepIcon size={16} onClick={onNextStep} next />}
										</TFlex>
									</TFlex>
									<TFlex fw>
										<TourSkipWrapper>
											<TFlex fw>
												<TText fontSize={'ss'} main>
													<Text tid={'skip-content'} />
												</TText>
												<TText
													fontSize={'s'}
													primary
													style={{
														textDecoration: 'underline',
														cursor: 'pointer',
														margin: '0 4px',
													}}
													onClick={onClose}
												>
													<Text tid={'skip'} />
												</TText>
											</TFlex>
										</TourSkipWrapper>
									</TFlex>
								</>
							)}
						</TCFlex>
					</ContentBody>
				</ContentWrapper>
				{typeof levels[stage]?.stage === 'string' && <InnerStep comp={levels[stage].div} />}
			</Portal>
		</>
	)
}

export default TourStep
