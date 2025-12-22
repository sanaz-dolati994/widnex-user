import React from 'react'
import { ScaleLoader } from 'react-spinners'
import { SpinnerContainer } from '../../styles/CommonStyles'

const AuthLoading = (props) => {
	return (
		<>
			{props.loading && (
				<SpinnerContainer {...props}>
					<ScaleLoader size={15} color='#0773F1' />
				</SpinnerContainer>
			)}
		</>
	)
}

export default AuthLoading
