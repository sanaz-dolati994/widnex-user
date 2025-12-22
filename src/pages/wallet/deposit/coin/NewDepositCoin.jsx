import Text from '../../../../core/utils/Text'
import HintBox from '../../../../components/common/HintBox'
import { useEffect, useState } from 'react'
import { useAvailableCoinsQuery } from '../../../../core/services/react-query/useAvailableCoinsQuery'
import { useDepositMutation } from '../../../../core/services/react-query/useWalletQuery'
import { useCopyToClipboard } from '../../utils/useCopyToClipboard'
import Select from '../../utils/Select'
import { RxCopy } from 'react-icons/rx'
import FeeContainer from '../../utils/FeeContainer'
import { ClipLoader } from 'react-spinners'
import { getMainTheme } from '../../../../core/utils/theme'
import QRCode from 'react-qr-code'

export default function NewDepositCoin() {
    const [networks, setNetworks] = useState([])
    const [coin, setCoin] = useState('')
    const [network, setNetwork] = useState('')

    const { data: availableCoins } = useAvailableCoinsQuery()

    useEffect(() => {
        if (!!availableCoins && !!coin) {
            const c = availableCoins?.data?.find((x) => x.id === coin.id)
            setNetworks(c?.depositList || [])
            setNetwork('')
        }
    }, [coin, availableCoins])

    const {
        data: depositData,
        mutate: deposit,
        isLoading,
    } = useDepositMutation()
    useEffect(() => {
        if (!!network) {
            let payloadNetwork = network?.network
            if(payloadNetwork === 'erc20') payloadNetwork = 'eth'
            else if(payloadNetwork === 'trc20') payloadNetwork = 'trx'
            else if(payloadNetwork === 'bep20') payloadNetwork = 'bsc'
            
            const payload = { coin: coin.id, network: payloadNetwork }
            deposit(payload)
        }
    }, [network])

    const { copyToClip } = useCopyToClipboard()
    const address = depositData?.data?.data?.address || ''

    const mappedNetworks = networks.length === 0 ? networks : networks.map(option => {
        if(option.network === 'eth') return {...option, network : 'erc20'}
        if(option.network === 'trx') return  {...option, network : 'trc20'}
        if(option.network === 'bsc') return  {...option, network : 'bep20'}
        return option 
    })

    return (
        <div className='py-6 flex flex-col lg:flex-row gap-x-4'>
            <div className='w-full lg:w-1/2'>
                <HintBox
                    type='hint'
                    heading='hint'
                    body='static-wallet-address-hint'
                    className='mb-2'
                />
                <HintBox
                    type='warn'
                    heading='warn'
                    body='direct-deposit-warn'
                />

                <div className={'flex flex-col gap-y-8 mt-2'}>
                    <div className={'flex flex-col gap-1'}>
                        <Text
                            tid={'coin'}
                            className={'text-sm text-secondary mx-1'}
                        />
                        <Select
                            options={availableCoins?.data || []}
                            value={coin}
                            onChange={setCoin}
                            dropdownClass={'min-h-[164px]'}
                            placeholder={'coinFilter'}
                            className={
                                'w-full h-[42px] flex items-center rounded-lg'
                            }
                            isCoin
                        />
                    </div>
                    <div className={'flex flex-col gap-1'}>
                        <Text
                            tid={'network'}
                            className={'text-sm text-secondary mx-1'}
                        />
                        <Select
                            value={network}
                            options={mappedNetworks}
                            onChange={setNetwork}
                            className={
                                'w-full h-[42px] flex items-center rounded-lg'
                            }
                            dropdownClass={'min-h-[164px]'}
                            placeholder={'select-an-option'}
                            selector={'network'}
                        />
                    </div>
                </div>
            </div>
            <div className='w-full lg:w-1/2'>
                <div className=''>
                    {!!network ? (
                        <div
                            className={
                                'rounded-md mx-auto w-[200px] py-5 flex items-center justify-center'
                            }>
                            {isLoading ? (
                                <div
                                    className={
                                        'flex items-center justify-center min-h-[200px] w-full'
                                    }>
                                    <ClipLoader
                                        size={24}
                                        color={getMainTheme().active}
                                    />
                                </div>
                            ) : !!address ? (
                                <div
                                    className={
                                        'flex flex-col gap-2 justify-center'
                                    }>
                                    {/* <Text
                                        tid={'scan-to-deposit'}
                                        className={'text-secondary text-sm'}
                                    /> */}
                                    <div
                                        className={
                                            'self-center rounded-md bg-gray-200 dark:bg-white p-2'
                                        }>
                                        <QRCode
                                            bgColor='#1b1e23'
                                            fgColor='#fff'
                                            size={134}
                                            value={address}
                                        />
                                    </div>

                                    <div
                                        className={
                                            'flex items-center mx-1 cursor-pointer gap-2 text-sm w-full rounded-lg bg-gray-light dark:bg-white/5 p-3'
                                        }
                                        onClick={() => copyToClip(address)}>
                                        <RxCopy
                                            size={20}
                                            className='text-cBlue'
                                        />
                                        {/* <Text tid={'address'} /> <span>:</span> */}
                                        <span
                                            className={
                                                'max-w-[240px] truncate'
                                            }>
                                            {address}
                                        </span>
                                    </div>
                                    <div className={''}>
                                        <FeeContainer
                                            type={'deposit'}
                                            network={network}
                                            coin={coin}
                                            // type={'wallet'}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div
                            className={
                                'flex flex-col gap-y-4 justify-center items-center'
                            }>
                            <img
                                src={require('../../../../assets/newImages/no-wallet-address.png')}
                                alt='select a network for generating address'
                                className='w-44 h-auto'
                            />
                            <Text
                                tid={'select-a-network'}
                                className={'text-gray-500 text-opacity-60'}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
