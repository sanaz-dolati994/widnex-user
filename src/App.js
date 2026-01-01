import React from 'react'
import { QueryClientProvider } from 'react-query'
import MainContextProvider from './core/contexts/main'
import WalletContextProvider from './core/contexts/wallet'
import Index from './pages/'
import { useQueryContext } from './core/contexts/query'
import './assets/css/pagination.css'

const App = () => {
	const { queryClient } = useQueryContext()

	return (
		<QueryClientProvider client={queryClient}>
			<MainContextProvider>
				<WalletContextProvider>
					<Index />
				</WalletContextProvider>
			</MainContextProvider>
		</QueryClientProvider>
	)
}

export default App
