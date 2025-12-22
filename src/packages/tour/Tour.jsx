import { useEffect, useMemo, useState } from 'react'
import TourStep from './TourStep'
import {
	InfoIcon,
	QuestionIcon,
	QuestionWrapper,
	StartTutorialWrapper,
	TFlex,
	TText,
	TutorialIcon,
} from './utils/Styles'
import { getControllerInnerRect, getOffset, getQuestionLeft } from './utils/helper'
import Text from '../../core/utils/Text'
import Tooltip from './utils/Tooltip'
import { loadPersistedData, persistData } from '../../core/utils/persistor'

const Tour = (props) => {
	const { options: userOptions, children } = props

	const [fromController, setFromController] = useState(false)
	const [completed, setCompleted] = useState(loadPersistedData('tour-complete'))
	const [step, setStep] = useState(0)
	const [tourComps, setTourComps] = useState([])

	const [options, setOptions] = useState([])

	useEffect(() => {
		const newOptions = []
		for (let i = 0; i < userOptions.length; i++) {
			const option = userOptions[i]
			const connectedDiv = document.getElementById(option.id)
			if (!connectedDiv) continue
			newOptions.push(userOptions[i])
		}

		setOptions(newOptions)
	}, [userOptions])

	const getInnerSteps = (steps) => {
		const innerSteps = []
		for (let j = 0; j < steps.length; j++) {
			const innerStepOption = steps[j]
			const innerStepDiv = document.getElementById(innerStepOption.id)
			let iiSteps = []
			if (innerStepOption.steps) iiSteps = getInnerSteps(innerStepOption.steps)
			innerSteps.push({ div: innerStepDiv, steps: iiSteps })
		}
		return innerSteps
	}

	const getElements = () => {
		const _tourComps = []
		for (let i = 0; i < options.length; i++) {
			const option = options[i]
			const connectedDiv = document.getElementById(option.id)
			if (!connectedDiv) continue
			let steps = []
			if (option.steps) steps = getInnerSteps(option.steps)
			_tourComps.push({ div: connectedDiv, steps })
		}
		setTourComps(_tourComps)
	}

	const onController = (idx) => {
		setStep(idx)
		setFromController(true)
	}

	const onNext = () => {
		setStep((state) => state + 1)
	}

	const onBack = () => {
		setStep((state) => state - 1)
	}

	const onClose = () => {
		if (fromController) setFromController(false)
		else {
			persistData('tour-complete', true)
			setCompleted(true)
		}
	}

	useEffect(() => {
		let interval
		interval = setInterval(() => {
			getElements()
		}, 1000)

		return () => clearInterval(interval)
	}, [options])

	/**
	 * levels / configs - contain comps and options in a straight array
	 */
	const [levels, setLevels] = useState([])
	const [configs, setConfigs] = useState([])

	const buildLevels = (items, stage = [], parentZ) => {
		let res = []
		for (let i = 0; i < items.length; i++) {
			const option = items[i]
			const zIndex = option.zIndex || parentZ || 101
			res.push({
				...option,
				stage: stage.length ? [...stage, i].join('.') : i,
				zIndex,
			})
			if (option.steps?.length) {
				const dipRes = buildLevels(option.steps, [...stage, i], zIndex)
				res = [...res, ...dipRes]
			}
		}
		return res
	}

	useMemo(() => {
		setLevels(buildLevels(tourComps))
		setConfigs(buildLevels(options))
	}, [tourComps])

	const startDemo = () => {
		persistData('tour-complete', false)
		setCompleted(false)
		setStep(0)
	}

	return (
		<>
			{completed ? (
				children
			) : (
				<div>
					{children}
					<TourStep
						step={step}
						comps={tourComps}
						options={options}
						onNext={onNext}
						onBack={onBack}
						onClose={onClose}
						levels={levels}
						configs={configs}
					/>
				</div>
			)}
			{completed &&
				tourComps.length &&
				options.map((option, idx) => {
					if (option.controller) {
						const position = option.position || 'left'
						if (!tourComps[idx]) return <></>
						const rect = getOffset(tourComps[idx].div)
						const questionLeft = getQuestionLeft(position, rect)
						return (
							<QuestionWrapper
								left={questionLeft}
								top={rect.top + 10}
								onClick={() => onController(idx)}
								zIndex={option.zIndex || 101}
							>
								<QuestionIcon size={15} />
							</QuestionWrapper>
						)
					} else return null
				})}

			{completed &&
				levels.length &&
				configs.map((config, idx) => {
					const rect = getOffset(levels[idx].div)
					const VALID = config.controller && typeof config.stage === 'string' && !!rect
					if (!VALID) return <></>

					const position = config.position || 'left'
					let left = position === 'left' ? rect.left - 16 : rect.left + rect.width

					const customStyles = config.controllerStyle || {}
					let top = rect.top + (customStyles.top || rect.height / 2 - 8)

					const isInner = config.controllerStyle?.inner
					const innerPosition = config.controllerStyle?.position || 'top-left'
					if (isInner) {
						const innerRect = getControllerInnerRect(innerPosition, rect)
						if (innerRect) {
							left = innerRect.left
							top = innerRect.top
						}
					}

					return (
						<Tooltip content={config.content}>
							<QuestionWrapper left={left} top={top} zIndex={config.zIndex || 101}>
								<InfoIcon size={15} />
							</QuestionWrapper>
						</Tooltip>
					)
				})}

			{fromController && (
				<TourStep
					step={step}
					comps={tourComps}
					options={options}
					levels={levels}
					configs={configs}
					onClose={onClose}
					fromController={fromController}
				/>
			)}

			<StartTutorialWrapper onClick={startDemo}>
				<TFlex>
					<TutorialIcon size={14} />
					<TText main fontSize={'ss'}>
						<Text tid={'start-tutorial'} />
					</TText>
				</TFlex>
			</StartTutorialWrapper>
		</>
	)
}

export default Tour
