import styled from 'styled-components'
import { ScaleLoader } from 'react-spinners'
import { useMainContext } from '../../../core/contexts/main'

const GlobalLoading = () => {
	const {
		main: { theme },
	} = useMainContext()

	return (
		<Wrapper theme={theme}>
			<ScaleLoader height={26} width={3} color='#0773F1' />
		</Wrapper>
	)
}

const Wrapper = styled.div`
	width: 100%;
	height: 100vh;
	position: fixed;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => (props.theme === 'dark' ? '#0d1726' : '#E5E9F0')};
`

export default GlobalLoading
