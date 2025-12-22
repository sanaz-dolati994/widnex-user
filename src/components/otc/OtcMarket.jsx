import { useEffect, useState } from 'react'
import { SOCKET_URL } from '../../core/constants/urls'
import { useMainContext } from '../../core/contexts/main'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { useMarketQuery } from '../../core/services/react-query/useMarketQuery'
import { formatNumber } from '../../core/utils/common'
import Text from '../../core/utils/Text'
import { Heading } from '../../styles/newStyles/Dashboard.styled'
import { PinIcon } from '../common/icons'
import { FaSearch } from 'react-icons/fa'
import { FlexCenter } from '../../styles/CommonStyles'
import { ScaleLoader } from 'react-spinners'
import { usePinCoins } from '../../core/hooks/usePinCoins'

export default function OtcMarket({ setSelectedCoin }) {
    const [coinsList, setCoinsList] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    const {
        main: { lang },
    } = useMainContext()
    const { width } = useWindowSize()
    const { favs, onFav } = usePinCoins()
    const { data: market, isFetching } = useMarketQuery()

    useEffect(() => {
        !isFetching && setCoinsList(market)
    }, [market, isFetching])

    const handleInputChange = (e) => {
        const value = e?.target?.value
        if (value) {
            setSearchTerm(value)
            const newCoins = market.filter(
                (c) => c.id.includes(value) || c.fa.includes(value)
            )
            setCoinsList(newCoins)
        } else {
            setCoinsList(market)
            setSearchTerm('')
        }
    }

    const renderedCoins =
        !isFetching &&
            coinsList.filter((item) => !favs.includes(item.id)).length > 0 ? (
            coinsList
                .filter((item) => !favs.includes(item.id))
                .map((item) => {
                    return (
                        <div className='flex items-center gap-x-4 p-3 cursor-pointer' key={item.id} onClick={() => { setSelectedCoin(item) }}>
                            <div
                                className='cursor-pointer'
                                onClick={onFav.bind(null, item.id)}>
                                <PinIcon
                                    color={favs.includes(item.id) && '#0773F1'}
                                />
                            </div>

                            <div
                                className={
                                    'flex items-center gap-2 md:gap-5 pr-1'
                                }>
                                <img
                                    src={
                                        SOCKET_URL +
                                        `assets/icon/${item?.coin?.toLowerCase()}.png`
                                    }
                                    width={width > 768 ? 32 : 22}
                                    height={width > 768 ? 32 : 22}
                                    alt={item?.coin}
                                />
                                <div className={'flex flex-col text-xs'}>
                                    <span>{item.id?.toUpperCase()}</span>
                                    <span>{item[lang] || item.name}</span>
                                </div>
                            </div>

                            <div
                                className={
                                    'flex h-full items-center justify-start text-xs md:text-sm mr-auto'
                                }>
                                <span>{`${formatNumber(item.value)} $`}</span>
                            </div>
                        </div>
                    )
                })
        ) : (
            <p className='text-center opacity-80 dark:opacity-60 text-sm my-4'>
                <Text tid='no-data' />
            </p>
        )

    const renderedPinnedCoins =
        !isFetching &&
            favs.length > 0 &&
            coinsList.filter((item) => favs.includes(item.id)).length > 0 ? (
            coinsList
                .filter((item) => favs.includes(item.id))
                .map((item) => {
                    return (
                        <div className='flex items-center gap-x-4 p-3 cursor-pointer' key={item.id} onClick={() => { setSelectedCoin(item) }}>
                            <div
                                className='cursor-pointer'
                                onClick={onFav.bind(null, item.id)}>
                                <PinIcon
                                    color={favs.includes(item.id) && '#0773F1'}
                                />
                            </div>

                            <div
                                className={
                                    'flex items-center gap-2 md:gap-5 pr-1'
                                }>
                                <img
                                    src={
                                        SOCKET_URL +
                                        `assets/icon/${item?.coin?.toLowerCase()}.png`
                                    }
                                    width={width > 768 ? 32 : 22}
                                    height={width > 768 ? 32 : 22}
                                    alt={item?.coin}
                                />
                                <div className={'flex flex-col text-xs'}>
                                    <span>{item.id?.toUpperCase()}</span>
                                    <span>{item[lang] || item.name}</span>
                                </div>
                            </div>

                            <div
                                className={
                                    'flex h-full items-center justify-start text-xs md:text-sm mr-auto'
                                }>
                                <span>{`${formatNumber(item.value)} $`}</span>
                            </div>
                        </div>
                    )
                })
        ) : (
            <p className='text-center opacity-80 dark:opacity-60 text-sm my-4'>
                <Text tid='no-data' />
            </p>
        )

    return (
        <div className=''>
            <Heading>
                <h3 className='text-heading dark:text-pColor font-bold '>
                    <Text tid='coins-list' />
                </h3>
            </Heading>
            <form className='bg-primary dark:bg-white/10 relative flex items-center w-full px-4 py-2 rounded-lg mt-4'>
                <input
                    type='text'
                    className='block w-11/12 bg-transparent placeholder:text-sm'
                    placeholder='جستجو در بازار...'
                    value={searchTerm}
                    onChange={handleInputChange}
                />
                <FaSearch className='w-1/12 text-black/20 dark:text-pColor' />
            </form>

            <div className='relative border-b dark:border-card-border my-4'>
                <Heading className='mb-4'>
                    <h4 className='font-bold text-sm'>
                        <Text tid='pinned-coins' />
                    </h4>
                </Heading>

                {isFetching && (
                    <FlexCenter width='100%' height='auto'>
                        <ScaleLoader size={15} color='#0773F1' />
                    </FlexCenter>
                )}

                {!isFetching && favs.length === 0 && (
                    <p className='text-center opacity-80 dark:opacity-60 text-sm my-4'>
                        <Text tid='no-data' />
                    </p>
                )}

                {!isFetching && favs.length > 0 && renderedPinnedCoins}
            </div>

            <div className=''>
                {isFetching && (
                    <FlexCenter width='100%' height='auto'>
                        <ScaleLoader size={15} color='#0773F1' />
                    </FlexCenter>
                )}
                {!isFetching && coinsList.length > 0 && renderedCoins}
            </div>
        </div>
    )
}
