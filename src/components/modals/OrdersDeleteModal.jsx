import React from 'react'
import styled from 'styled-components'
import Text from '../../core/utils/Text'

const OrdersDeleteModal = ({ onModalBtnClicked }) => {
	return (
		<div style={{ width: '100%' }}>
			<MText>
				<Text tid='delete-orders' />
			</MText>
			<BtnContainer>
				<Btn onClick={() => onModalBtnClicked(1)} bgColor='#1ce087'>
					<Text tid='submit' />
				</Btn>
				<Btn onClick={() => onModalBtnClicked(0)} bgColor='#a12356'>
					<Text tid='cancel' />
				</Btn>
			</BtnContainer>
		</div>
	)
}

const MText = styled.div`
	width: 100%;
	text-align: start;
	color: ${(props) => props.theme.color || '#ffffff95'};
	font-size: 1.1rem;

	@media screen and (max-width: 480px) {
		font-size: 0.75rem;
	}
`

const BtnContainer = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
`

const Btn = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 8px;
	width: 100px;
	cursor: pointer;
	height: 40px;
	margin-top: 30px;
	background-color: ${(props) => props.bgColor || '#0f1c2e'};
	color: ${(props) => props.theme.secondaryBg || 'black'};

	@media screen and (max-width: 480px) {
		font-size: 0.75rem;
		width: 80px;
		height: 32px;
	}
`

export default OrdersDeleteModal
