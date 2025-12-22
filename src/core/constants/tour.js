
import { DText } from "../../styles/CommonStyles";
import Text from "../utils/Text";


export const tourOptions = (lang, setActiveTab, activeLayout) => ([
    {
        id: 'order-book',
        header: 'order-book-tour-header',
        content:
            <div className={'flex relative w-[300px] flex-col gap-1 items-start justify-center'}>
                <DText yekan secondary>
                    <Text tid={'order-book-tour-content-1'} />
                </DText>
                <DText yekan secondary fontSize={'s'}>
                    <Text tid={'order-book-tour-content-2'} />
                </DText>
            </div>
        ,
        steps: [
            {
                id: 'order-book-price',
                header: 'order-book-tour-header',
                content: 'order-book-price-tour-content',
                controller: true,
                position: lang === 'en' && 'right',
                controllerStyle: {
                    zIndex: 201,
                    top: 3
                }
            },
            {
                id: 'order-book-amount',
                header: 'order-book-tour-header',
                content: 'order-book-amount-tour-content',
                controller: true,
                position: lang === 'en' && 'right',
                controllerStyle: {
                    zIndex: 201,
                    top: 3

                }
            },
            {
                id: 'order-book-total',
                header: 'order-book-tour-header',
                content: 'order-book-total-tour-content',
                controller: true,
                position: lang === 'en' && 'right',
                controllerStyle: {
                    zIndex: 201,
                    top: 3
                }
            },
        ],
        controller: true,
        position: lang === 'en' && 'right',
        zIndex: 102
    },
    {
        id: 'pairs',
        header: 'pairs-header',
        content: 'pairs-content',
        steps: [
            {
                id: 'pairs-search',
                header: 'pairs-header',
                content: 'pairs-search'
            },
            {
                id: 'pairs-pair',
                header: 'pairs-header',
                content: 'pairs-pair'
            },
            {
                id: 'pairs-coin',
                header: 'pairs-header',
                content: 'pairs-coin-content'
            },
            {
                id: 'pairs-price',
                header: 'pairs-header',
                content: 'pairs-price-content'
            },
            {
                id: 'pairs-_24change',
                header: 'pairs-header',
                content: 'pairs-change-content'
            }
        ],
        controller: true,
        position: lang === 'en' && 'right'
    },
    {
        id: 'last-trades',
        header: 'last-trades-header',
        content: 'last-trades-content',
        controller: true,
        position: lang === 'en' && 'right'
    },
    {
        id: 'spot',
        header: 'spot-header',
        content: 'spot-content',
        controller: true,
        zIndex: 100,
        steps: [
            {
                id: 'Limit',
                content:
                    <div className={'flex flex-col gap-1 items-start justify-center'}>
                        <DText yekan secondary>
                            <Text tid={'spot-limit-content-1'} />
                        </DText>
                        <DText yekan secondary fontSize={'s'}>
                            <Text tid={'spot-limit-content-2'} />
                        </DText>
                        <DText yekan secondary>
                            <Text tid={'spot-limit-content-3'} />
                        </DText>
                    </div>
                ,
                callback: () => setActiveTab(0),
                steps: [
                    {
                        id: 'spot-price',
                        content: 'limit-price-content',
                    },
                    {
                        id: 'spot-amount',
                        content: 'limit-amount-content',
                    }
                ],
                controller: true,
                controllerStyle: {
                    top: 6
                }
            },
            {
                id: 'Market',
                content: 'spot-market-content',
                callback: () => setActiveTab(1),
                controller: true,
                controllerStyle: {
                    top: 6
                }
            },
            {
                id: 'Stop limit',
                content: 'spot-stop-content',
                callback: () => setActiveTab(2),
                steps: [
                    {
                        id: 'spot-stop',
                        content: 'spot-stop-stop-content',
                    },
                    {
                        id: 'spot-limit',
                        content: 'spot-stop-limit-content',
                    }
                ],
                controller: true,
                controllerStyle: {
                    top: 6
                }
            },
            {
                id: 'Oco',
                content: 'spot-oco-content',
                callback: () => setActiveTab(3),
                controller: true,
                controllerStyle: {
                    top: 6
                },
                steps: [
                    {
                        id: 'spot-price',
                        content: 'spot-oco-price',
                    },
                    {
                        id: 'spot-stop',
                        content: 'spot-oco-stop'
                    },
                    {
                        id: 'spot-limit',
                        content: 'spot-oco-limit'
                    },
                    {
                        id: 'Oco',
                        content:
                            <div className={'flex flex-col gap-1 items-start justify-center'}>
                                <DText yekan secondary>
                                    <Text tid={'oco-last-content-1'} />
                                </DText>
                                <DText yekan color={'#1ce087'}>
                                    <Text tid={'oco-last-content-2'} />
                                </DText>
                                {['oco-last-content-3', 'oco-last-content-4', 'oco-last-content-5'].map(item => (
                                    <DText yekan secondary fontSize={'s'}>
                                        <Text tid={item} />
                                    </DText>
                                ))}
                                <DText yekan color={'#e9106c'}>
                                    <Text tid={'oco-last-content-6'} />
                                </DText>
                                {['oco-last-content-7', 'oco-last-content-8', 'oco-last-content-9'].map(item => (
                                    <DText yekan secondary fontSize={'s'}>
                                        <Text tid={item} />
                                    </DText>
                                ))}
                            </div>
                    }
                ]
            }
        ]
    },
    {
        id: 'history',
        header: 'orders',
        content: 'history-content',
        zIndex: 100,
        steps: [
            {
                id: 'tour-current-orders',
                header: 'current-orders',
                content: 'current-orders-content',
                controller: true,
            },
            {
                id: 'tour-orders-history',
                header: 'orders-history',
                content: 'orders-history-content',
                controller: true,
            }
        ]
    }
])
