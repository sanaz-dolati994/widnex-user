import { useState } from 'react'
import Card from '../../../components/common/Card'
import NewLayout from '../../../components/layouts/NewLayout'
import RMarketChanges from '../changes/RMarketChanges'
import TradingChart from '../charts/TradingChart'
import Text from '../../../core/utils/Text'
import AdvanceOrderBook from '../order-book/AdvanceOrderBook'
import LastTrades from '../last-trades/LastTrades'
import { Link } from 'react-router-dom'
import { MdPublishedWithChanges } from "react-icons/md";


const AdvanceTrade = () => {

    const [tab, setTab] = useState('last-orders')
    const tabs = ['last-orders', 'last-trades']

    return (
        <NewLayout>
            <div className={'flex flex-col gap-2 p-2 pb-[120px]'}>
                <Card className={'w-full h-full relative mt-2 rounded-md'} padding={'py-3'}>
                    <div className={'px-3'}>
                        <RMarketChanges />
                    </div>
                    <div className={'w-full h-[300px] mt-4 px-1'}>
                        <TradingChart />
                    </div>
                </Card>

                <Card className={'w-full h-full relative mt-2 rounded-md text-sm'} padding={'p-3'}>
                    <span>سفارشات اسپات</span>
                    <div className={'flex items-center gap-3 mt-2'}>
                        {tabs.map(item => {

                            const active = tab === item

                            return (
                                <div className={`rounded-md  text-xs py-1 px-2 dark:bg-white bg-black
                                ${active ? 'dark:bg-opacity-20 bg-opacity-20' : 'dark:bg-opacity-5 bg-opacity-5'}
                                cursor-pointer transition
                            `} onClick={() => setTab(item)}>
                                    <Text tid={item} />
                                </div>
                            )
                        })}
                    </div>

                    {tab === 'last-orders' ?
                        <AdvanceOrderBook />
                        : null}

                    {tab === 'last-trades' ?
                        <LastTrades withoutCard />
                        : null}
                </Card>
            </div>

            <div className={'fixed bottom-0 left-0 w-screen h-[80px] z-[1000000] bg-white shadow dark:bg-primaryBg text-xs'}>
                <div className={'w-full h-full grid grid-cols-2 gap-2 px-5'}>
                    <Link to={'/otc'} className={'flex items-center h-full gap-1 text-blue-500'}>
                        <MdPublishedWithChanges size={20} />
                        <span>خرید و فروش آنی</span>
                    </Link>
                    <div className={'flex items-center gap-2 text-black font-semibold'}>
                        <Link to={'/trade?type=buy'} className={'flex items-center justify-center bg-green-400 h-[36px] rounded-md w-[100px]'}>
                            خرید
                        </Link>
                        <Link to={'/trade?type=sell'} className={'flex items-center justify-center bg-red-400 h-[36px] rounded-md w-[100px]'}>
                            فروش
                        </Link>
                    </div>
                </div>
            </div>
        </NewLayout>
    )
}

export default AdvanceTrade