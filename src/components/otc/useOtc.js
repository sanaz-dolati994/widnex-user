import { useSearchParams } from 'react-router-dom'
import { useMainContext } from '../../core/contexts/main'
import { useMarketQuery } from '../../core/services/react-query/useMarketQuery'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { normalFetch } from '../../core/services/fetch-api/get'
import { formatNumber } from '../../core/utils/common'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'

export const useOtc = () => {
    const [params] = useSearchParams()
    const preCoin = params.get('coin')
    const {
        profile: { token },
    } = useMainContext()

    const { data: _prices } = useMarketQuery()

    const [pricesList, setPricesList] = useState([])
    useEffect(() => {
        setPricesList(_prices)
    }, [_prices])

    const { data: profile } = useProfileQuery()
    const { data: coinSetting } = useGetCoinSettings()
    const { data: bankSetting } = useGetBankSettings()

    const [coin, setCoin] = useState()
    const [volume, setVolume] = useState('1')
    const [price, setPrice] = useState('')
    const [type, setType] = useState('buy')

    /* updating price when socket refresh */
    useEffect(() => {
        if (!!coin) {
            const newPrice = pricesList.find((x) => x.id === coin.id)
            if (!!newPrice)
                setPrice(
                    formatNumber(newPrice[type] * deformatNumber(volume), {
                        type: type === 'buy' ? 'irt' : coin.id,
                    })
                )
        }
    }, [pricesList])

    // types: close - login - min - max - otc - balance
    const [modal, setModal] = useState('close')
    const [limits, setLimits] = useState()

    // setting coin from params
    useEffect(() => {
        if (!!preCoin && pricesList?.length && !coin) {
            const exist = pricesList.find((item) => item.id === preCoin)
            if (!!exist) setCoin(exist)
        }
    }, [pricesList])

    const initialCoinLoaded = useRef(false)
    useEffect(() => {
        if (pricesList?.length && !initialCoinLoaded.current && !preCoin) {
            initialCoinLoaded.current = true
            setCoin(pricesList[0])
        }
    }, [pricesList])

    useEffect(() => {
        if (!!coin) {
            const _price = deformatNumber(volume) * coin[type]
            setPrice(formatNumber(_price, { type: 'irt' }))
        }
    }, [coin, type])

    const onPriceChange = (v) => {
        const _volume = deformatNumber(v) / coin[type]
        setVolume(formatNumber(_volume, { type: coin.id }))
        setPrice(v)
    }

    const onVolumeChange = (v) => {
        const _price = deformatNumber(v) * coin[type]
        setVolume(v)
        setPrice(formatNumber(_price, { type: 'irt' }))
    }

    const onAction = (action) => {
        let curr, min, max
        if (action === type) {
            if (!coin || !coinSetting || !bankSetting) return
            if (!token || !profile) {
                setModal('login')
                return
            }

            let balanceError
            if (type === 'buy')
                balanceError = profile.balance < deformatNumber(price)
            else {
                const currWallet = profile.coins.find(
                    (item) => item.coin === coin.id
                )
                if (currWallet)
                    balanceError = currWallet.amount < deformatNumber(volume)
                else balanceError = true
            }
            if (balanceError) {
                setModal('balance')
                return
            }

            if (type === 'buy')
                curr = coinSetting.find((item) => item.id === coin.id)
            else curr = bankSetting
            if (!curr) return
            min = curr.otc.min
            max = curr.otc.max

            let maxError, minError
            if (type === 'buy') {
                maxError = max && deformatNumber(volume) > max
                minError =
                    (min && deformatNumber(volume) < min) ||
                    deformatNumber(volume) === 0 ||
                    !volume
            } else {
                maxError = max && deformatNumber(price) > max * coin.sell
                minError =
                    (min && deformatNumber(price) < min) ||
                    deformatNumber(price) === 0 ||
                    !volume
            }

            if (maxError) {
                setLimits(max)
                setModal('max')
                return
            }
            if (minError) {
                setLimits(min ? min : '0.000001')
                setModal('min')
                return
            }

            setModal('otc')
        } else setType(action)
    }

    const onClose = () => {
        setModal('close')
        setLimits(null)
    }

    const toomanCoin = {
        coin: 'irt',
        id: 'irt',
        name: 'toman',
    }

    const balance = useMemo(() => {
        let b = '0'
        if (!!profile) {
            if (type === 'buy') b = `${formatNumber(profile.balance)} تومان`
            else
                b = `${
                    formatNumber(
                        profile.coins.find((i) => i.coin === coin.id)?.amount
                    ) || 0
                } ${coin.id?.toUpperCase()}`
        }
        return b
    }, [profile, type, coin])

    const onBalanceClick = () => {
        try {
            let value = balance.split(' ')
            const fn = type === 'buy' ? onPriceChange : onVolumeChange
            fn(value[0])
        } catch (err) {}
    }

    const coinLimits = useMemo(() => {
        const temp = coinSetting?.filter((item) => item.id === coin?.id)
        let setting = {}
        if (temp?.length) setting = temp[0].otc
        return setting
    }, [coin, coinSetting])

    return {
        profile,
        balance,
        onBalanceClick,
        coin,
        price,
        onPriceChange,
        volume,
        onVolumeChange,
        setCoin,
        onAction,
        modal,
        toomanCoin,
        onClose,
        limits,
        type,
        setType,
        coinLimits,
    }
}

const useGetCoinSettings = () => {
    const {
        profile: { token },
    } = useMainContext()
    return useQuery(
        'coin-settings',
        () => normalFetch(token, 'settings/coins'),
        {
            select: (res) => res?.data?.data,
        }
    )
}

const useGetBankSettings = () => {
    const {
        profile: { token },
    } = useMainContext()
    return useQuery(
        'bank-settings',
        () => normalFetch(token, 'settings/banks'),
        {
            select: (res) => res?.data?.data,
        }
    )
}

const deformatNumber = (str) => {
    try {
        let numParts = str.split('.')
        numParts[0] = numParts[0].replaceAll(',', '')
        return parseFloat(numParts.join('.'))
    } catch (err) {
        return null
    }
}
