import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { useSpring, animated } from '@react-spring/web'
import styled from 'styled-components'

export default function MobileModal({ isOpen, children, onClose }) {
	const modalRoot = document.getElementById('mobile-modal-root')

	const animation = useSpring({
		opacity: isOpen ? 1 : 0,
		transform: isOpen ? `translateY(0%)` : `translateY(100%)`,
		config: { tension: 300, friction: 30 },
	})

	useEffect(() => {
		// Lock body scroll when modal is open
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	const handleOverlayClick = (e) => {
		if (e.target.id === 'modal-overlay') {
			onClose()
		}
	}

	if (!isOpen) return null

	return ReactDOM.createPortal(
		<Overlay id='modal-overlay' onClick={handleOverlayClick}>
			<animated.div style={animation}>
				<ModalWrapper className='bg-white dark:bg-dark'>
					<NotchWrapper>
						<Notch />
					</NotchWrapper>
					{children}
				</ModalWrapper>
			</animated.div>
		</Overlay>,
		modalRoot
	)
}

const Overlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: flex-end;
	z-index: 100000000003;
`

const ModalWrapper = styled.div`
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	width: 100vw;
	max-height: 90vh;
	overflow-y: auto;
	position: relative;
	padding-inline: 20px;
	padding-block: 10px 30px;
	direction: rtl;
`
const NotchWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-bottom: 1rem;
`

const Notch = styled.div`
	width: 60px;
	height: 5px;
	border-radius: 20px;
	background-color: #a6b1bf;
`
