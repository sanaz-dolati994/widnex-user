import MainLayout from "../../../../components/layouts/MainLayout";
import Text from "../../../../core/utils/Text";
import React, {useEffect, useState} from "react";
import {useMarketQuery} from "../../../../core/services/react-query/useMarketQuery";
import {useAvailableCoinsQuery} from "../../../../core/services/react-query/useAvailableCoinsQuery";
import QRCode from "react-qr-code";
import {useDepositMutation} from "../../../../core/services/react-query/useWalletQuery";
import Select from "../../utils/Select";
import {RxCopy} from "react-icons/rx";
import {ClipLoader} from "react-spinners";
import {getMainTheme} from "../../../../core/utils/theme";
import {useCopyToClipboard} from "../../utils/useCopyToClipboard";
import TransactionTable from "../../TransactionsTable";
import FeeContainer from "../../utils/FeeContainer";
import {Link} from "react-router-dom";


const DepositCoin = () => {

    const [networks, setNetworks] = useState([])
    const [coin, setCoin] = useState('')
    const [network, setNetwork] = useState('')

    const {
        data: availableCoins
    } = useAvailableCoinsQuery()


    useEffect(() => {
        if (!!availableCoins && !!coin) {
            const c = availableCoins?.data?.find(x => x.id === coin.id)
            setNetworks(c?.depositList || [])
            setNetwork('')
        }
    }, [coin, availableCoins])


    const { data: depositData, mutate: deposit, isLoading } = useDepositMutation()
    useEffect(() => {
        if (!!network) {
            const payload = { coin: coin.id, network: network?.network }
            deposit(payload)
        }
    }, [network])

    const { copyToClip } = useCopyToClipboard()
    const address = depositData?.data?.data?.address || ''

    return (
        <MainLayout>
            <div className={'max-w-[1200px] mx-auto text-black dark:text-white mt-12'}>
                <div className={'w-full bg-white dark:bg-secondaryBg rounded-md p-6 min-h-[300px] shadow-md relative'}>
                    <Link to={'/wallets/depositFiat'}>
                        <div className={'absolute left-2 cursor-pointer top-2 rounded-md bg-white dark:bg-slate-800 py-2 px-5 w-max'}>
                            <Text tid={'deposit-fiat'} className={'lg:text-sm text-xs'} />
                        </div>
                    </Link>
                    <div className={'flex lg:justify-center text-lg mb-3'}>
                        <Text tid={'deposit-coin'} />
                    </div>
                    <div className={'lg:grid lg:grid-cols-2 '}>
                        <div className={'flex flex-col gap-8 mx-auto'}>
                            <div className={'flex flex-col gap-1'}>
                                <Text tid={'coin'} className={'text-sm text-secondary mx-1'} />
                                <Select
                                    options={availableCoins?.data || []}
                                    value={coin}
                                    onChange={setCoin}
                                    dropdownClass={'min-h-[164px]'}
                                    placeholder={'coinFilter'}
                                    className={'w-full lg:w-[400px] h-[42px] flex items-center'}
                                    isCoin
                                />
                            </div>
                            <div className={'flex flex-col gap-1'}>
                                <Text tid={'network'} className={'text-sm text-secondary mx-1'} />
                                <Select
                                    value={network}
                                    options={networks}
                                    onChange={setNetwork}
                                    className={'w-full lg:w-[400px] h-[42px] flex items-center'}
                                    dropdownClass={'min-h-[164px]'}
                                    placeholder={'select-network'}
                                    selector={'network'}
                                />
                            </div>
                            {!!address ?
                                <div className={'flex items-center mx-1 cursor-pointer gap-2 text-sm w-full'} onClick={() => copyToClip(address)}>
                                    <Text tid={'address'} /> <span>:</span>
                                    <span className={'max-w-[240px] truncate'}>{address}</span>
                                    <RxCopy size={24} />
                                </div>
                            : null}
                            <div className={''}>
                                <FeeContainer type={'deposit'} network={network} coin={coin} type={'wallet'} />
                            </div>
                        </div>
                        <div className={'mt-5 lg:mt-0'}>
                            {(!!network) ?
                                <div className={'rounded-md mx-auto border-[1px] border-main border-opacity-20 w-[300px] py-5 flex items-center justify-center dark:bg-primaryBg'}>
                                    {
                                        isLoading ?
                                            <div className={'flex items-center justify-center min-h-[200px] w-full'}>
                                                <ClipLoader size={24} color={getMainTheme().active} />
                                            </div>
                                            :
                                            !!address ?
                                                <div className={'flex flex-col gap-2 items-center justify-center'}>
                                                    <Text tid={'scan-to-deposit'} className={'text-secondary text-sm'} />
                                                    <div className={'rounded-md bg-gray-200 dark:bg-white p-2'}>
                                                        <QRCode bgColor='#1b1e23' fgColor='#fff' size={144} value={address} />
                                                    </div>
                                                </div>
                                                : null}
                                </div>

                                :
                                <div className={'rounded-md opacity-70 shadow opacity-70 dark:opacity-50 mx-auto border-main border-[1px] border-opacity-10 w-[300px] h-[172px] flex items-center justify-center bg-gray-300 dark:bg-primaryBg'}>
                                    <Text tid={'choose-coin-network-address'} className={'text-justify text-xs max-w-[144px]'} />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={'w-full bg-white dark:bg-secondaryBg rounded-md py-6 px-3 lg:p-6 min-h-[300px] shadow-md mt-6'}>
                    <TransactionTable
                        flow='deposit'
                        coin={coin}
                        type={'wallet'}
                    />
                </div>
            </div>
        </MainLayout>
    )
}

export default DepositCoin
