import Card from '../../../components/common/Card'
import NewLayout from '../../../components/layouts/NewLayout'
import { tourOptions } from '../../../core/constants/tour'
import { useTradePrice } from '../../../core/contexts/trade-price'
import { useWindowSize } from '../../../core/hooks/useWindowSize'
import Tour from '../../../packages/tour/Tour'
import MarketChanges from '../changes/MarketChanges'
import Charts from '../charts/Charts'
import RChart from '../charts/RChart'
import RHistory from '../history/RHistory'
import TradeHistory from '../history/TradeHistory'
import LastTrades from '../last-trades/LastTrades'
import OrderBook from '../order-book/OrderBook'
import ROrderBook from '../order-book/ROrderBook'
import Pairs from '../pairs/Pairs'
import RPairs from '../pairs/RPairs'
import RSpot from '../spot/RSpot'
import Spot from '../spot/Spot'
import { DesktopGrid, GridItem } from '../utils/styled'

const Trade = () => {
	const { setActiveSpotTab } = useTradePrice()
	const { width } = useWindowSize()
	const layout = [
		{ id: 'market-changes', area: 'a', h: 8, pane: MarketChanges },
		{ id: 'pairs', area: 'b', h: 52, pane: Pairs },
		{ id: 'charts', area: 'c', h: 52, pane: Charts },
		{ id: 'order-book', area: 'd', h: 114, pane: OrderBook },
		{ id: 'last-trades', area: 'e', h: 62, pane: LastTrades },
		{ id: 'spot', area: 'f', h: 62, pane: Spot },
		{ id: 'history', area: 'g', h: 52, pane: TradeHistory },
	]

	return (
		<NewLayout>
			{width > 1024 ? (
				<Tour options={tourOptions('fa', setActiveSpotTab)}>
					<DesktopGrid>
						{layout.map((item) => {
							const Pane = item.pane

							return (
								<GridItem key={item.id} area={item.area} h={item.h * 10} id={item.id}>
									<Pane />
								</GridItem>
							)
						})}
					</DesktopGrid>
				</Tour>
			) : (
				<div className={'flex flex-col gap-2 p-3 pb-[140px]'}>
					<div className={'grid grid-cols-6 gap-2'}>
						<div className={'col-span-5'}>
							<RPairs />
						</div>
						<RChart />
					</div>

					<Card className={'rounded-md grid grid-cols-2 gap-2'} padding={'px-3 py-4'}>
						<RSpot />
						<ROrderBook />
					</Card>

					<Card className={'rounded-md'} padding={'px-3 py-4'}>
						<RHistory />
					</Card>
				</div>
			)}
		</NewLayout>
	)
}

export default Trade
