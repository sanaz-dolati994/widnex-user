import { CFlexCenter, FlexCenter, FlexEnd, Padding } from '../../styles/CommonStyles'
import Text from '../../core/utils/Text'
import {
    DetailRow,
    DetailsBody,
    DetailsButton,
    DetailStatus,
    DetailText,
    TxidLink
} from "../../styles/TransactionHistoryStyles";
import { BASE_URL, SOCKET_URL } from "../../core/constants/urls";
import { formatDate, formatNumber } from "../../core/utils/common";
import { useMainContext } from "../../core/contexts/main";
import { useMemo, useState } from "react";
import Description from "../modals/Description";
import { useAvailableCoinsQuery } from '../../core/services/react-query/useAvailableCoinsQuery'
import { useQueryContext } from '../../core/contexts/query';
import TruncateMiddle from '../common/TruncateMiddle';
import CountdownTimer from '../common/CountDownTimer';


const TransactionDetails = ({ transaction, onClose, type, setCancelModal }) => {

    const { main: { lang } } = useMainContext()

    const [showNote, setShowNote] = useState(false)

    const { data: availableCoins } = useAvailableCoinsQuery()

    const coinInfo = useMemo(() => {
        if (!availableCoins?.data?.length) return {}

        const { coin, network } = transaction

        const normalizeNetwork = (net) => {
            switch (net) {
                case 'trc20':
                    return 'trx'
                case 'erc20':
                    return 'eth'
                case 'bep20':
                case 'bep':
                case 'bsc':
                    return 'bnb'
                default:
                    return net
            }
        }

        const findMatchingNetwork = (list) => {
            return list?.length
                ? list.find((item) => {
                    item.network = normalizeNetwork(item.network)
                    return item.network === network
                })
                : {}
        }

        const withdrawListData = findMatchingNetwork(
            availableCoins.data.find((item) => item.symbol === coin)?.withdrawList
        )
        const depositListData = findMatchingNetwork(
            availableCoins.data.find((item) => item.symbol === coin)?.depositList
        )

        return withdrawListData || depositListData
    }, [availableCoins, transaction])

    const scanner = coinInfo?.scanner?.replace('$TXID', transaction.txId)

    const { setToast } = useQueryContext()

    const onCopyToClipboard = (hash) => {
        navigator.clipboard.writeText(hash)
        setToast({
            show: true,
            message: 'copy-success',
        })
    }

    return (
        <>
            <CFlexCenter style={{ width: '100%' }}>
                <FlexCenter width='100%'>
                    <Padding padding='10px 0' style={{ borderBottom: '1px solid #ffffff15' }}>
                        <DetailText>
                            <Text tid='see-details' />
                        </DetailText>
                    </Padding>
                </FlexCenter>

                <FlexCenter width='100%'>
                    <DetailsBody>
                        {transaction &&
                            <>
                                <DetailRow>
                                    <DetailText>
                                        <Text tid={'id'} />
                                    </DetailText>
                                    <DetailText>
                                        {transaction._id}
                                    </DetailText>
                                </DetailRow>
                                {type === 'wallet' ?
                                    <DetailRow>
                                        <DetailText>
                                            <div className='flex'> <Text tid='coin' className='inline' /> :</div>
                                        </DetailText>
                                        <FlexEnd className='relative'>
                                            <DetailText style={{ marginTop: '5px' }}>
                                                {transaction.coin?.toUpperCase()}
                                            </DetailText>
                                            {transaction.type === "tsp" && (
                                                <div className='bg-green-700 text-white absolute -top-1 -left-1 text-[9px] rounded-full h-4 flex items-center justify-center w-6 -rotate-45 shadow-lg pt-1'>
                                                    TSP
                                                </div>
                                            )}
                                            <img
                                                src={SOCKET_URL + `assets/icon/${transaction.coin}.png`}
                                                alt=' '
                                                width='24px'
                                                height='24px'
                                                style={{ margin: '0 10px 0 0' }}
                                            />
                                        </FlexEnd>
                                    </DetailRow>
                                    : null
                                }
                                <DetailRow>
                                    <DetailText>
                                        <Text tid='main-amount' />
                                    </DetailText>
                                    <DetailText style={{ direction: 'ltr' }}>
                                        {formatNumber(transaction.amount)} {type === 'wallet' ? transaction.coin?.toUpperCase() : 'IRT'}
                                    </DetailText>
                                </DetailRow>

                                <DetailRow>
                                    <DetailText>
                                        <Text tid='last-amount' />
                                    </DetailText>
                                    <DetailText color='mainGreen' style={{ direction: 'ltr' }}>
                                        {formatNumber(transaction.totalAmount)} {type === 'wallet' ? transaction.coin?.toUpperCase() : 'IRT'}
                                    </DetailText>
                                </DetailRow>

                                <DetailRow>
                                    <DetailText>
                                        <Text tid='transactionType' />
                                    </DetailText>
                                    <DetailText tid={transaction.flow === 'withdraw' ? 'mainRed' : 'mainGreen'}>
                                        <Text tid={transaction.flow} />
                                    </DetailText>
                                </DetailRow>

                                {type === 'wallet' ?
                                    <DetailRow>
                                        <DetailText>
                                            <Text tid='network' />
                                        </DetailText>
                                        <DetailText>
                                            {transaction.network}
                                        </DetailText>
                                    </DetailRow>
                                    : null
                                }

                                {(type === 'wallet' && transaction.txId) ?
                                    <DetailRow>
                                        <DetailText>
                                            <Text tid='txId' />
                                        </DetailText>
                                        <TruncateMiddle
                                            text={transaction.txId}
                                            frontChars={6}
                                            backChars={6}
                                            onClick={() => {
                                                onCopyToClipboard(transaction.txId)
                                            }}
                                        />
                                    </DetailRow>
                                    : null
                                }

                                {type === 'wallet' ?
                                    <DetailRow>
                                        <DetailText>
                                            <Text tid='address' />
                                        </DetailText>
                                        <DetailText address>
                                            {transaction.address}
                                        </DetailText>
                                    </DetailRow>
                                    : null
                                }

                                {type === 'wallet' ?
                                    <DetailRow
                                        onMouseEnter={() => setShowNote(true)} onMouseLeave={() => setShowNote(false)}
                                        last
                                    >
                                        <DetailText>
                                            <Text tid='note' />
                                        </DetailText>

                                        <DetailText  >
                                            {transaction.note ?
                                                transaction.note.toString().substring(0, 50) +
                                                (transaction.note.toString().length > 50 ? '...' : '')
                                                :
                                                '--'
                                            }
                                        </DetailText>

                                        <Description
                                            show={showNote && transaction.note?.toString()?.length > 50}
                                            note={transaction.note}
                                            onClose={() => setShowNote(false)}
                                        />

                                    </DetailRow>
                                    : null
                                }

                                {type === 'bank' ?
                                    <DetailRow>
                                        <DetailText>
                                            <Text tid={'bankId'} />
                                        </DetailText>
                                        <DetailText>
                                            {transaction.bankId}
                                        </DetailText>
                                    </DetailRow>
                                    : null
                                }

                                <DetailStatus status={transaction.status}>
                                    <CFlexCenter style={{ width: '100%' }}>
                                        <FlexCenter style={{ justifyContent: 'space-between' }} width='100%'>
                                            <DetailText>
                                                <Text tid='status' />
                                            </DetailText>
                                            <DetailText>
                                                <Text tid={`T${transaction.status}`} />
                                            </DetailText>
                                        </FlexCenter>
                                        <FlexCenter>
                                            <DetailText>
                                                {formatDate(transaction.modifiedAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}
                                                -
                                                {formatDate(transaction.modifiedAt, null, lang === 'en' ? 'en-US' : 'fa-IR')}
                                            </DetailText>
                                        </FlexCenter>
                                    </CFlexCenter>
                                </DetailStatus>
                                {transaction.flow === 'withdraw' && transaction.status === 'created' &&

                                    <DetailRow
                                        className={`rounded-l-xl flex flex-col items-center justify-center gap-3 px-2 w-full`}
                                    >
                                        <div className='flex w-full justify-between gap-4 items-center'>
                                            <Text tid={'cancel-withdraw-hint'} />
                                            {
                                                transaction.status === 'created' &&
                                                <CountdownTimer startTime={transaction.modifiedAt} />
                                            }
                                        </div>
                                        <button className={`rounded-lg border w-full border-red-500 text-red-500 px-4 py-1 ${transaction.status === 'created' ? "" : "opacity-50 cursor-not-allowed"}`}
                                            onClick={() => {
                                                // if (transaction.status === 'created') 
                                                setCancelModal({ open: true, type: type, item: transaction })
                                            }}>
                                            <Text tid={'cancel'} />
                                        </button>
                                    </DetailRow>
                                }
                            </>
                        }
                    </DetailsBody>
                </FlexCenter>

                <DetailsButton onClick={onClose} className='bg-gray-light dark:bg-white/10 dark:text-white text-cBlue w-full rounded-lg'>
                    <Text tid='close' />
                </DetailsButton>
            </CFlexCenter>
        </>
    )
}

export default TransactionDetails
