import styled from 'styled-components'
import useClickOutside from "../../core/hooks/useClickOutside";
import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { variants } from "../../core/utils/common";


const ModalLayout = ({ width, children, onClose = () => { }, open, isStatic = false }) => {
	const modalRef = useRef()
	useClickOutside(modalRef, () => {
		if (!isStatic) onClose()
	})

	return (
		<>
			{open ?
				<Body>
					<AnimatePresence exitBeforeEnter>
						{open && (
							<Wrapper
								ref={modalRef}
								variants={variants}
								initial='out'
								animate='in'
								exit='out'
								width={width}
							>
								{children}
							</Wrapper>
						)}
					</AnimatePresence>
				</Body>
				: null
			}
		</>

	)
}

const Body = styled.div`
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 11111111111111;
`

const Wrapper = styled(motion.div)`
	width: 100%;
	max-width: ${(props) => props.width};
	padding: 35px 20px;
	background-color: ${(props) => props.theme.mainBg};
	border-radius: 20px;
	box-shadow: 0 0 10px black;
	z-index: 10;

	@media screen and (max-width: 480px) {
		padding: 30px 20px;
		width: ${props => props.width || '70%'};
		margin: 0 8px;
	}
`

export default ModalLayout
