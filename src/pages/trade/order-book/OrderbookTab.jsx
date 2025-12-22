

const OrderbookTab = ({ orderBookTab, setOrderBookTab }) => {

    const orderBookTabs = ['all', 'buy', 'sell']

    return (
        <div className={'flex lg:flex-row flex-row-reverse items-center gap-2 lg:mt-5 mt-1'}>
            {orderBookTabs.map(item => {

                const active = item === orderBookTab

                if (item === 'all') {
                    return (
                        <div
                            className={`flex flex-col gap-[2px] ${active ? 'opacity-100' : 'opacity-40'}`}
                            onClick={() => setOrderBookTab('all')}
                        >
                            <div className={'w-[20px] h-[8px] rounded-[2px] border-[1px] border-green-500'} />
                            <div className={'w-[20px] h-[8px] rounded-[2px] border-[1px] border-red-500'} />
                        </div>
                    )
                }

                if (item === 'buy') {
                    return (
                        <div
                            className={`flex flex-col gap-[2px] ${active ? 'opacity-100' : 'opacity-40'}`}
                            onClick={() => setOrderBookTab('buy')}
                        >
                            <div className={'w-[12px] h-[8px] rounded-[2px] border-[1px] border-green-500'} />
                            <div className={'w-[20px] h-[8px] rounded-[2px] border-[1px] border-green-500'} />
                        </div>
                    )
                }

                if (item === 'sell') {
                    return (
                        <div
                            className={`flex flex-col gap-[2px] ${active ? 'opacity-100' : 'opacity-40'}`}
                            onClick={() => setOrderBookTab('sell')}
                        >
                            <div className={'w-[12px] h-[8px] rounded-[2px] border-[1px] border-red-500'} />
                            <div className={'w-[20px] h-[8px] rounded-[2px] border-[1px] border-red-500'} />
                        </div>
                    )
                }
            })}
        </div>
    )
}

export default OrderbookTab