import { BiChevronDown } from "react-icons/bi"
import Text from "../../../core/utils/Text"
import { useTradingSpot } from "../utils/spot"
import { useEffect, useState } from "react"
import RespModal from "../common/RespModal"
import TradeType from "./TradeType"
import Invoice from "./Invoice"
import { useSearchParams } from "react-router-dom"



const RSpot = () => {

    const tabs = ['limit', 'market', 'stop-limit', 'oco']

    const {
        activeTab, activeType,
        setActiveTab, setActiveType,
        buyInput, setBuyInput,
        sellInput, setSellInput,
        onOperationClicked,
        invoice, onInvoiceClosed,
        validTrade, ocoError
    } = useTradingSpot()

    const [typeModal, setTypeModal] = useState(false)

    const [searchParams] = useSearchParams()
    useEffect(() => {
        const preType = searchParams.get('type')
        if (!!preType) setActiveType(preType)
    }, [searchParams])


    return (
        <div className={'flex flex-col gap-3'}>
            <div
                className={'rounded-md text-sm flex h-[36px] w-full shadow'}
            >
                <div className={`rounded-r-md w-[50%] h-full
                     flex items-center justify-center
                     ${activeType === 'buy' ?
                        'bg-[#4FCB6A] dark:bg-[#4FCB6A] text-slate-800 font-semibold' :
                        'bg-primary dark:bg-white/10'} transition
                     `}
                    onClick={() => setActiveType('buy')}
                >
                    <span>خرید</span>
                </div>

                <div className={`rounded-l-md w-[50%] h-full
                     flex items-center justify-center
                     ${activeType === 'sell' ?
                        'bg-[#4FCB6A] dark:bg-[#CB4F4F] text-slate-800 font-semibold' :
                        'bg-primary dark:bg-white/10'} transition
                     `}
                    onClick={() => setActiveType('sell')}
                >
                    <span>فروش</span>
                </div>
            </div>

            <div
                className={'bg-primary dark:bg-white/10 rounded-md flex items-center justify-between h-[36px] px-5 text-sm'}
                onClick={() => setTypeModal(true)}
            >
                <Text tid={tabs[activeTab]} />
                <BiChevronDown size={20} />
            </div>

            <TradeType
                type={activeType}
                activeTab={activeTab}
                userInput={activeType === "buy" ? buyInput : sellInput}
                setUserInput={activeType === "buy" ? setBuyInput : setSellInput}
                onOperationClicked={(limitsError, limits) => onOperationClicked(activeType, limitsError, limits)}
                valid={validTrade[activeType]}
                ocoError={ocoError}
            />

            <RespModal
                show={typeModal}
                onClose={() => setTypeModal(false)}
            >
                <div className={'p-5'}>
                    <span>انتخاب نوع معامله</span>
                    <div className={'flex flex-col gap-3 mt-3'}>
                        {tabs.map((tab, idx) => {

                            const active = idx === activeTab

                            return (
                                <div className={`border-b-[1px] dark:border-card-border 
                                ${active ? 'bg-green-400' : ''}  rounded-md p-2 bg-opacity-30`}
                                    key={tab}
                                    onClick={() => {
                                        setActiveTab(idx)
                                        setTypeModal(false)
                                    }}
                                >
                                    <Text tid={tab} className={'text-sm'} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </RespModal>

            {invoice.visible ?
                <Invoice
                    data={invoice.type === "buy" ? buyInput : sellInput}
                    type={invoice.type}
                    tab={activeTab}
                    onClose={onInvoiceClosed}
                />
                : null}
        </div>
    )
}

export default RSpot