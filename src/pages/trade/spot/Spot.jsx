import Card from '../../../components/common/Card'
import Text from '../../../core/utils/Text'
import { useTradingSpot } from '../utils/spot'
import Invoice from './Invoice'
import TradeType from './TradeType'

const Spot = () => {
	const tabs = ['limit', 'market', 'stop-limit', 'oco']

	const {
		activeTab,
		activeType,
		setActiveTab,
		setActiveType,
		buyInput,
		setBuyInput,
		sellInput,
		setSellInput,
		onOperationClicked,
		invoice,
		onInvoiceClosed,
		validTrade,
		ocoError,
	} = useTradingSpot()

	return (
		<Card className={'w-full h-full relative'} padding={'px-3 py-4'}>
			<div className={'pb-2 border-b-[1px] dark:border-card-border'}>
				<span>معامله اسپات</span>
			</div>

			<div className={'flex items-center gap-5 py-3'}>
				{tabs.map((item, idx) => {
					const active = activeTab === idx
					const ids = ['Limit', 'Market', 'Stop limit', 'Oco']

					return (
						<div
							id={ids[idx]}
							className={`rounded-lg  text-sm py-1 px-5 dark:bg-white bg-black
                            ${active
									? 'dark:bg-opacity-20 bg-opacity-20'
									: 'dark:bg-opacity-5 bg-opacity-5'
								}
                            cursor-pointer transition
                        `}
							onClick={() => setActiveTab(idx)}
						>
							<Text tid={item} />
						</div>
					)
				})}
			</div>

			<div className={'flex items-center gap-4'}>
				<TradeType
					type='buy'
					activeTab={activeTab}
					userInput={buyInput}
					setUserInput={setBuyInput}
					onOperationClicked={(limitsError, limits) =>
						onOperationClicked('buy', limitsError, limits)
					}
					valid={validTrade.buy}
					ocoError={ocoError}
				/>
				<TradeType
					type='sell'
					activeTab={activeTab}
					userInput={sellInput}
					setUserInput={setSellInput}
					onOperationClicked={(limitsError, limits) =>
						onOperationClicked('sell', limitsError, limits)
					}
					valid={validTrade.sell}
					ocoError={ocoError}
				/>
			</div>

			{invoice.visible ? (
				<Invoice
					data={invoice.type === 'buy' ? buyInput : sellInput}
					type={invoice.type}
					tab={activeTab}
					onClose={onInvoiceClosed}
				/>
			) : null}
		</Card>
	)
}

export default Spot
