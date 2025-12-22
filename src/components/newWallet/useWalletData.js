import { useMemo } from "react";
import { useGetDailyBalance, useGetDailyRecords, useMarketQuery } from "../../core/services/react-query/useMarketQuery";
import { useProfileQuery } from "../../core/services/react-query/useProfileQuery";
import { getIrDate } from "../../core/utils/common";


export const useWalletPLData = () => {

    const { data: records } = useGetDailyRecords()
    const { data: changes } = useGetDailyBalance({ limit: 30 })

    const userBalance = useMemo(() => {
        let tooman = 0
        let usdt = 0
        if (!!changes && !!records) {
            try {
                tooman = changes[0].totalMain
                const tetherCoin = records[0]?.record?.price?.find((c) => c.id === 'usdt')
                if (!!tetherCoin && !!tooman) usdt = (tooman / tetherCoin.sell).toFixed(2)
            } catch (_) { }
        }
        return { tooman, usdt }
    }, [changes, records])

    const userChange = useMemo(() => {
        let tooman = 0
        let usdt = 0
        let pc = 0
        if (!!changes && !!records) {
            try {
                if (changes.length > 1 && records.length > 1) {
                    const currAmount = changes[0].totalMain
                    const pastAmount = changes[1].totalMain
                    const currPrice = records[0]?.record?.price?.find((c) => c.id === 'usdt')
                    const pastPrice = records[1]?.record?.price?.find((c) => c.id === 'usdt')
                    tooman = currAmount - pastAmount
                    usdt = ((currAmount / currPrice.sell) - (pastAmount / pastPrice.sell)).toFixed(2)
                    pc = (tooman / currAmount * 100).toFixed(1)
                    if (isNaN(pc)) pc = 0
                }
            } catch (_) { }
        }
        return { tooman, usdt, pc }
    }, [changes, records])

    const coinChange = useMemo(() => {
        let coins = []
        if (!!changes && !!records) {
            if (changes.length && records.length) {
                for (let i = 0; i < changes[0].coins.length; i++) {
                    const curr = changes[0].coins[i]
                    let next
                    if (changes.length > 1) {
                        next = changes[1].coins[i]
                    }
                    try {
                        let item = {}
                        item.id = curr.coin
                        item.amount = curr.amount
                        item.blocked = curr.amountBlocked
                        item.available = curr.amount - curr.amountBlocked

                        const currCoin = records[0]?.record?.price?.find((c) => c.id === curr.coin)
                        const nextCoin = records[1]?.record?.price?.find((c) => c.id === curr.coin)

                        if (!!currCoin) {
                            item.value = item.amount * currCoin.sell
                            item.name = currCoin.name
                            item.fa = currCoin.fa
                        }
                        if (!!next && !!nextCoin) item.change = parseInt((curr.amount * currCoin.sell) - (next.amount * nextCoin.sell))
                        else item.change = 0
                        item.pc = (item.change / (item.value || 1) * 100).toFixed(1)
                        coins.push(item)
                    } catch (_) {
                    }
                }

                try {
                    const curr = changes[0].balance
                    let next
                    if (changes.length > 1) next = changes[1].balance
                    let item = {}
                    item.id = 'irt'
                    item.amount = curr.amount
                    item.blocked = curr.amountBlocked
                    item.available = curr.amount - curr.amountBlocked
                    item.value = curr.amount
                    item.name = 'tooman'
                    item.fa = 'تومان'
                    if (!!next) item.change = curr.amount - next.amount
                    else item.change = 0
                    item.pc = (item.change / (item.value || 1) * 100).toFixed(1)
                    coins.push(item)
                } catch (_) { }
            }
        }
        return coins
    }, [changes, records])

    const areaChartData = useMemo(() => {
        let dates = []
        let values = []
        if (!!changes) {
            for (let i = 0; i < 30; i++) {
                let f = {}
                if (changes.length > i) f = changes[i]
                dates.push(getIrDate(f.recordAt))
                values.push(f?.totalMain || 0)
            }
        }
        dates.reverse()
        values.reverse()
        return { dates, values }
    }, [changes])

    return {
        userBalance,
        userChange,
        coinChange,
        areaChartData
    }
}


export const useWalletRealTimeData = () => {

    const { data: profile } = useProfileQuery()
    const { data: market } = useMarketQuery()

    const myBalance = useMemo(() => {
        let tooman = 0
        let usdt = 0
        let coins = []
        if (!!profile && !!market) {
            tooman = profile.balance
            let item = {}
            item.id = 'irt'
            item.name = 'tooman'
            item.fa = 'تومان'
            item.amount = tooman
            item.value = tooman
            item.blocked = profile.balanceBlocked
            item.available = item.amount - item.blocked

            for (let i = 0; i < profile.coins?.length; i++) {
                const curr = profile.coins[i]
                const item = {}
                const currCoin = market.find(x => x.id === curr.coin)

                item.id = curr.coin
                item.amount = curr.amount
                item.blocked = curr.amountBlocked
                item.available = curr.amount - curr.amountBlocked
                item.value = 0
                if (!!currCoin) {
                    item.value = item.amount * currCoin.sell
                    item.ch24 = currCoin.changes["24h"].changePresent
                    item.name = currCoin.name
                    item.fa = currCoin.fa
                }
                coins.push(item)
                tooman += item.value
            }

            coins.push(item)

            const usdtCoin = market.find(x => x.id === 'usdt')
            if (!!usdtCoin) usdt = (tooman / usdtCoin.sell).toFixed(2)
        }
        return {
            tooman,
            usdt,
            coins
        }
    }, [profile, market])

    return {
        myBalance
    }
}
