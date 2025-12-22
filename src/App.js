import {QueryClientProvider} from 'react-query'
import MainContextProvider from './core/contexts/main'
import Index from './pages/'
import './assets/css/pagination.css'
// import { ReactQueryDevtools } from 'react-query/devtools'
import WalletContextProvider from './core/contexts/wallet'
import {useQueryContext} from "./core/contexts/query";



const App = () => {
	const {queryClient} = useQueryContext()

	return (
		<QueryClientProvider client={queryClient}>
			{/*<ReactQueryDevtools />*/}
			<MainContextProvider>
				<WalletContextProvider>
					<Index />
				</WalletContextProvider>
			</MainContextProvider>
		</QueryClientProvider>
	)
}

export default App
