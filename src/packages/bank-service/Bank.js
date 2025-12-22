import allBankInfo from './BankInfo'

const getBankInfo = (code) => {
	if (!code) return null

	let prefix = code.replaceAll(' ', '')
	prefix = prefix.substring(0, 6)
	if (prefix.length !== 6) {
		return null
	}

	for (let i = 0; i < allBankInfo.length; i++) {
		const current = allBankInfo[i]
		if (current.prefix.includes(prefix)) {
			return current
		}
	}

	return null
}

export default getBankInfo
