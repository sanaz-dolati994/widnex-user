import { useState } from "react"
import Text from "../../../core/utils/Text"
import ROpenOrders from "./ROpenOrders"
import ROrdersHistory from "./ROrdersHistory"


const RHistory = () => {

    const tabs = ['open-orders', 'history']
    const [tab, setTab] = useState('open-orders')

    return (
        <div>
            <span className={'text-sm'}>سفارشات اسپات</span>
            <div className={'flex items-center gap-2'}>
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

            {tab === 'open-orders' ?
                <ROpenOrders />
                : null}

            {tab === 'history' ?
                <ROrdersHistory />
                : null}
        </div>
    )
}

export default RHistory