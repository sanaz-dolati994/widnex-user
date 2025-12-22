import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'
import { DText } from '../../styles/CommonStyles'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { AiFillCloseCircle } from 'react-icons/ai'
import Text from '../../core/utils/Text'
import { useQueryContext } from '../../core/contexts/query'

const variants = {
	in: {
		y: 0,
		transition: { duration: 0.5 },
	},
	out: {
		y: 300,
		transition: { duration: 0.5 },
	},
}

const Toast = () => {
	const { toast, setToast } = useQueryContext()
	const [barSize, setBarSize] = useState(0)

	useEffect(() => {
		let timeout
		let interval
		let delay
		if (toast.show) {
			timeout = setTimeout(() => {
				setToast({ show: false, isError: null, message: '' })
			}, 3000)

			delay = setTimeout(() => {
				interval = setInterval(() => {
					setBarSize((state) => {
						if (state === 100) {
							return 0
						} else {
							return state + 1
						}
					})
				}, 25)
			}, 500)
		}

		return () => {
			setBarSize(0)
			timeout && clearTimeout(timeout)
			delay && clearTimeout(delay)
			interval && clearInterval(interval)
		}
	}, [toast])

	return (
		<AnimatePresence>
			{toast.show && (
				<ToastBody
					initial='out'
					animate='in'
					exit='out'
					variants={variants}
					isError={toast.isError}
				>
					<DText fontSize='0.95rem' style={{ margin: '0 20px' }}>
						<Text tid={toast.message} />
					</DText>
					<IconWrapper>
						{toast.isError ? (
							<AiFillCloseCircle color='#e9106c' size={28} />
						) : (
							<BsFillCheckCircleFill color='#1ce087' size={28} />
						)}
					</IconWrapper>
					<Bar>
						<Fill isError={toast.isError} width={barSize} />
					</Bar>
				</ToastBody>
			)}
		</AnimatePresence>
	)
}

const ToastBody = styled(motion.div)`
	min-width: 220px;
	min-height: 80px;
	max-width: 30%;
	max-height: fit-content;
	position: fixed;
	bottom: 25px;
	left: 0;
	right: 0;
	margin: 0 auto;
	background-image: linear-gradient(
		90deg,
		${({ theme, isError }) => (isError ? theme.mainRed : theme.mainGreen)}15 15%,
		${({ theme, isError }) => (isError ? theme.mainRed : theme.mainGreen)}10 25%,
		${(props) => props.theme.primaryBg}60 35%
	);
	border-radius: 16px;
	backdrop-filter: blur(2.1px);
	-webkit-backdrop-filter: blur(100px);
	padding: 15px 40px;
	z-index: 99999999999999999999999 !important;
	display: flex;
	justify-content: center;
	text-align: center;
	align-items: center;

	@media screen and (max-width: 1050px) {
		max-width: 50%;
	}

	@media screen and (max-width: 768px) {
		max-width: 70%;
	}

	@media screen and (max-width: 480px) {
		max-width: 90%;
		min-height: 60px;
	}

	direction: ${(props) => (props.theme.english ? 'ltr' : 'rtl')};
`

const IconWrapper = styled.div`
	position: absolute;
	${({ english }) =>
		english &&
		css`
			left: 20px;
		`};
	${({ english }) =>
		!english &&
		css`
			right: 20px;
		`};
	top: calc(50% - 14px);
`

const Bar = styled.div`
	width: 96%;
	position: absolute;
	height: 4px;
	bottom: 2px;
	z-index: 11;
	margin: 0 auto;
`

const Fill = styled.div`
	width: 100%;
	position: relative;
	bottom: 0;
	height: 4px;
	border-radius: 8px;
	z-index: 12;

	&::after {
		content: ' ';
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: ${(props) => (props.isError ? props.theme.mainRed : props.theme.mainGreen)};
		width: ${(props) => props.width}%;
		height: 4px;
		border-radius: 8px;
	}
`

export default Toast
