import { useState } from 'react'
import { useAuth } from '../../pages/UserAuthentication'
import { Input } from '../../styles/AuthenticationStyles'
import { useWindowSize } from './useWindowSize'
import { TABLET_SIZE } from '../constants/common'


const usePersonalInfo = () => {
	const { width } = useWindowSize()
	const { authData, setAuthData } = useAuth()
	const [selectedDate, setSelectedDate] = useState(null)

	const toggleGender = (gender) => {
		const newState = { ...authData.step2.data }
		newState.gender = gender
		setAuthData({ type: '2-data', payload: newState })
	}

	const DateInput = ({ value, openCalendar, handleValueChange }) => {
		return (
			<div onClick={openCalendar}>
				<Input
					placeholder='     /       /     '
					value={
						value
					}
					onInputChange={handleValueChange}
					textAlign='center'
				/>
			</div>

		)
	}


	const formatAuthDate = (date) => {
		const month = date.month < 10 ? `0${date.month}` : date.month
		const day = date.day < 10 ? `0${date.day}` : date.day
		return `${date.year}-${month}-${day}`
	}

	const setSelectedValue = (date) => {
		setSelectedDate(date)
		const newState = { ...authData.step2.data }
		newState.birthDate = formatAuthDate(date)
		setAuthData({ type: '2-data', payload: newState })
	}

	return {
		authData,
		DateInput,
		setSelectedValue,
		selectedDate,
		toggleGender,
	}
}

export default usePersonalInfo
