import {useContext, createContext, useState, useEffect} from 'react'

const context = createContext({
	wallet: null,
	setWallet: () => {},
	coin: null,
	setCoin: () => {},
})

export const useWalletContext = () => {
	return useContext(context)
}

const WalletContextProvider = ({ children }) => {
	const [wallet, setWallet] = useState({ op: 'deposit', type: 'coin' })
	const [coin, setCoin] = useState(null)


	return (
		<context.Provider
			value={{
				wallet,
				setWallet,
				coin,
				setCoin,
			}}
		>
			{children}
		</context.Provider>
	)
}

export default WalletContextProvider
