import styled from 'styled-components'
import { ClipLoader } from 'react-spinners'
import { useAuthContext } from '../../../core/contexts/auth'
import Text from '../../../core/utils/Text'
import { DText } from '../../../styles/CommonStyles'

const LogoutLoading = () => {
	const { loading } = useAuthContext()

	return (
		<>
			{loading && (
				<Wrapper>
					<Body>
						<ClipLoader size={24} color={'#4f31c5'} />
						<DText primary style={{ margin: '0 10px' }} fontSize={'0.9rem'}>
							<Text tid={'exiting'} />
						</DText>
					</Body>
				</Wrapper>
			)}
		</>
	)
}

const Wrapper = styled.div`
	width: 100vw;
	height: 100vh;
	background: #00000040;
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	left: 0;
	top: 0;
	direction: ${(props) => (props.theme.english ? 'ltr' : 'rtl')};
`

const Body = styled.div`
	width: 220px;
	height: 58px;
	background: ${(props) => props.theme.mainBg};
	border-radius: 8px;
	border: 1px solid ${(props) => props.theme.color}20;
	display: flex;
	justify-content: center;
	align-items: center;
`

export default LogoutLoading
