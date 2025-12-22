import React from 'react'
import styled from 'styled-components'
import Text from '../../core/utils/Text'

const DeleteModal = ({ onModalBtnClicked, title }) => {
	return (
		<div style={{ width: '100%' }}>
			<MText>
				<Text tid={title ? title : 'delete-orders'} />
			</MText>
			<BtnContainer>
				<Btn onClick={() => onModalBtnClicked(1)} bgColor='#229b64'>
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
	padding-bottom: 20px;

	@media screen and (max-width: 768px) {
		font-size: 0.75rem;
	}
`

const BtnContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	column-gap: 10px;
`

const Btn = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 8px;
	width: 50%;
	cursor: pointer;
	height: 40px;
	margin-top: 30px;
	background-color: ${(props) => props.bgColor || '#0f1c2e'};
	/* color: ${(props) => props.theme.secondaryBg || 'black'}; */
	color: #fff;
	font-size: 0.95rem;

	@media screen and (max-width: 768px) {
		font-size: 0.75rem;
		width: 80px;
		height: 32px;
	} ;
`

export default DeleteModal
