import { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import styled from 'styled-components'
import { useMainContext } from '../../core/contexts/main'
import { useMarketQuery } from '../../core/services/react-query/useMarketQuery'
import { DText } from '../../styles/CommonStyles'
import Text from '../../core/utils/Text'
import { IconWrapper } from '../../styles/CoinOperationStyles'
import { IoIosClose } from 'react-icons/io'
import OtcInput from './Input'
import CoinSearchRow from './CoinSearchRow'

const deepCopy = (obj) => {
    if (!obj) return null
    return JSON.parse(JSON.stringify(obj))
}

const SelectCoin = ({ onClose, type, onChange, gold }) => {
    const {
        main: { lang },
    } = useMainContext()
    const { data: _prices } = useMarketQuery()

    const [pricesList, setPricesList] = useState([])
    useEffect(() => {
        if (_prices) {
            if (gold) {
                const newPrices = _prices.filter(
                    (i) => i.name === 'Gold' || i.name === 'Dollar'
                )
                setPricesList(newPrices)
            } else {
                setPricesList(_prices)
            }
        }
    }, [_prices])

    const [coins, setCoins] = useState([])

    useEffect(() => {
        if (pricesList?.length) {
            let prices = deepCopy(pricesList)
            if (search)
                prices = prices.filter((item) => {
                    return (
                        item.id.includes(search) ||
                        item.fa.includes(search) ||
                        item.name.toLowerCase().includes(search?.toLowerCase())
                    )
                })

            setCoins(prices)
        }
    }, [pricesList])

    const [search, setSearch] = useState()
    const onSearch = (e) => {
        const value = e?.target?.value
        setSearch(value)
        try {
            const newPrices = pricesList.filter((item) => {
                return (
                    item?.id?.includes(value || '') ||
                    item?.fa?.includes(value || '') ||
                    item?.name
                        ?.toLowerCase()
                        ?.includes(value?.toLowerCase() || '')
                )
            })
            setCoins(newPrices)
        } catch (err) {}
    }

    const onCoinChange = (item) => {
        onChange(item)
        onClose()
    }

    return (
        <div className={'flex flex-col'} dir={lang === 'fa' ? 'rtl' : 'ltr'}>
            <div className={'flex items-center justify-between'}>
                <DText primary>
                    <Text tid={'select-coin'} />
                </DText>
                <IconWrapper onClick={onClose}>
                    <CloseIcon size={24} />
                </IconWrapper>
            </div>
            <OtcInput
                icon={<SearchIcon size={24} />}
                value={search}
                onChange={onSearch}
                label={lang === 'fa' ? 'جستجو' : 'Search'}
                width={'95%'}
            />
            <CoinListWrapper>
                {coins.map((item) => (
                    <CoinSearchRow
                        coin={item}
                        type={type}
                        onClick={() => onCoinChange(item)}
                    />
                ))}
            </CoinListWrapper>
        </div>
    )
}

const SearchIcon = styled(BiSearch)`
    color: ${(props) => props.theme.color};
`

const CoinListWrapper = styled.div`
    height: 65vh;
    width: 100%;
    overflow-y: auto;
`

const CloseIcon = styled(IoIosClose)`
    color: ${(props) => props.theme.primary};
`

export default SelectCoin
