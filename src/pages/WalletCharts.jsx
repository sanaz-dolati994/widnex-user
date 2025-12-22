import MainLayout from "../components/layouts/MainLayout";
import CardLayout from "../components/layouts/CardLayout";
import Text from "../core/utils/Text";
import FilterDropdown from "../components/modals/FilterDropdown";
import React, {useMemo, useState} from "react";
import {useGetDailyBalance, useGetDailyRecords, useMarketQuery} from "../core/services/react-query/useMarketQuery";
import WalletAreaChart from "../components/charts/WalletAreaChart";
import {getIrDate} from "../core/utils/common";


const WalletCharts = () => {

    const { data: records } = useGetDailyRecords({ limit: 30 })
    const { data: changes } = useGetDailyBalance({ limit: 30 })

    const [coin, setCoin] = useState()
    const { data: market } = useMarketQuery()
    const onOptionChanged = (idx) => {
        setCoin(market[idx])
    }

    const chartData = useMemo(() => {
        let dates = []
        let values = []
        if (!!changes) {
            for (let i = 0; i < 30; i++) {
                let change = {}
                let record = {}
                if (changes.length > i) change = changes[i]
                if (records.length > i) record = records[i]
                dates.push(getIrDate(change.recordAt))
                const changeItem = change?.coins?.find(x => x.coin === coin?.id)
                const recordItem = record?.record?.price?.find(x => x.id === coin?.id)
                if (!!changeItem && !!recordItem) values.push(changeItem.amount * recordItem.sell)
                else values.push(0)
            }
        }
        dates.reverse()
        values.reverse()
        return { dates, values }
    }, [coin, changes, records])


    return (
        <MainLayout>
            <CardLayout>
                <div className={'p-6 lg:p-10'}>
                    <Text tid={'wallet-charts'} className={'text-black dark:text-white'} />
                    <div className={'flex flex-col gap-2 mt-4'}>
                        <FilterDropdown
                            options={market}
                            defaultOption='coinFilter'
                            margin={'0 0'}
                            onOptionChanged={onOptionChanged}
                            isCoin
                            type='buy'
                        />
                    </div>
                    <WalletAreaChart data={chartData} height={'400px'} />
                </div>
            </CardLayout>
        </MainLayout>
    )
}

export default WalletCharts
