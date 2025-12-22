import { CFlexCenter, FlexCenter, Padding } from '../../styles/CommonStyles'
import Text from '../../core/utils/Text'
import {
    DetailRow,
    DetailsBody,
    DetailsButton,
    DetailStatus,
    DetailText
} from "../../styles/TransactionHistoryStyles";
import { SOCKET_URL } from "../../core/constants/urls";
import { formatDate, formatNumber } from "../../core/utils/common";
import { useMainContext } from "../../core/contexts/main";


const OtcDetails = ({ data, onClose }) => {
    const { main: { lang } } = useMainContext()

    return (
        <>
            <CFlexCenter style={{ width: '100%' }}>
                <FlexCenter width='100%'>
                    <Padding padding='10px 0' style={{ borderBottom: '1px solid #ffffff15' }}>
                        <DetailText>
                            <Text tid='see-details' />
                        </DetailText>
                        <DetailText className='mr-1'>
                            <Text tid={data.type} className={`${data.type === 'buy' ? 'text-green-500' : 'text-red-500'}`} />
                        </DetailText>
                    </Padding>
                </FlexCenter>

                <FlexCenter width='100%'>
                    <DetailsBody>
                        {data &&
                            <>
                                <DetailRow>
                                    <DetailText>
                                        <Text tid={'id'} />
                                    </DetailText>
                                    <DetailText>
                                        {data._id}
                                    </DetailText>
                                </DetailRow>
                                <DetailRow>
                                    <DetailText>
                                        <Text tid='coin' /> :
                                    </DetailText>
                                    <FlexCenter>
                                        <DetailText style={{ marginTop: '5px' }}>
                                            {data.coin?.toUpperCase()}
                                        </DetailText>
                                        <img
                                            src={SOCKET_URL + `assets/icon/${data.coin}.png`}
                                            alt=' '
                                            width='24px'
                                            height='24px'
                                            style={{ margin: '0 10px 0 0' }}
                                        />
                                    </FlexCenter>
                                </DetailRow>
                                <DetailRow>
                                    <DetailText>
                                        <Text tid='unitPrice' /> :
                                    </DetailText>
                                    <DetailText style={{ direction: 'rtl', textTransform: 'uppercase' }}>
                                        {formatNumber(data.price)} <Text tid='tooman' /> ≈ {data.coin} {formatNumber(data.amount)}
                                    </DetailText>
                                </DetailRow>

                                <DetailRow>
                                    <DetailText>
                                        <Text tid='affiliate-profit' /> :
                                    </DetailText>
                                    <DetailText color='mainGreen' style={{ direction: 'ltr' }}>
                                        {formatNumber(data.affiliate.actorShare || 0)}
                                    </DetailText>
                                </DetailRow>

                                <DetailRow>
                                    <DetailText>
                                        <Text tid='wage' /> :
                                    </DetailText>
                                    <DetailText className='uppercase'>
                                        {data.type === 'sell' ? <>{formatNumber(data.wage)} <Text tid='tooman' /></> : <p style={{ direction: 'ltr' }}>{formatNumber(data.wage)} {data.wage > 0 ? data.coin : ''}</p>}
                                    </DetailText>
                                </DetailRow>
                                <DetailRow>
                                    <DetailText>
                                        <Text tid='amount-to-receive' /> :
                                    </DetailText>
                                    <DetailText className={`text-green-500 uppercase`}>
                                        {data.type === 'sell' ? <>{formatNumber(data.afterWage)} <Text tid='tooman' /></> : <p style={{ direction: 'ltr' }}>{formatNumber(data.afterWage)} {data.coin}</p>}
                                    </DetailText>
                                </DetailRow>
                                <DetailStatus status={data.status}>
                                    <CFlexCenter style={{ width: '100%' }}>
                                        <FlexCenter style={{ justifyContent: 'space-between' }} width='100%'>
                                            <DetailText>
                                                <Text tid='status' />
                                            </DetailText>
                                            <DetailText>
                                                <Text tid={`T${data.status}`} />
                                            </DetailText>
                                        </FlexCenter>
                                        <FlexCenter>
                                            <DetailText>
                                                {formatDate(data.modifiedAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}
                                                -
                                                {formatDate(data.modifiedAt, null, lang === 'en' ? 'en-US' : 'fa-IR')}
                                            </DetailText>
                                        </FlexCenter>
                                    </CFlexCenter>
                                </DetailStatus>
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

export default OtcDetails
