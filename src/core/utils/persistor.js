/*
load local storage persisted data
@param {string} key
@return {null|any}
*/
import cookieService from '../services/cookie'

export const loadPersistedData = (key) => {
	try {
		const serializedData = cookieService.get(key)
		if (serializedData === null) {
			return null
		}
		return key === 'theme' || key === 'lang'
			? serializedData
			: JSON.parse(serializedData)
	} catch (err) {
		return null
	}
}

/*
@param {string} key
@param {any} state
@return {void}
*/
export const persistData = (key, state) => {
	try {
		const serializedDate =
			key === 'theme' || key === 'lang' ? state : JSON.stringify(state)
		cookieService.set(key, serializedDate, { path: '/' })
	} catch (err) {
		console.log(err)
	}
}
