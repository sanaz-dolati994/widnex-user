import {Decoration} from "../../../styles/CoinOperationStyles";
import Text from "../../../core/utils/Text";
import {formatNumber, stringToNumber} from "../../../core/utils/common";
import {useMemo} from "react";
import useAvailableBanks from "../../../core/hooks/useAvailableBanks";
import { TbInfoCircle } from "react-icons/tb";


const FeeContainer = ({ network, flow, type, coin, amount }) => {

    const isWithdraw = flow === 'withdraw'
    const isToman = type === 'bank'

    const { availableBanks } = useAvailableBanks()

    const fee = useMemo(() => {
        let f = {
            max: 0,
            min: 0,
            fee: 0,
            finalAmount: 0
        }
        if (!!network) {
            f.max = network.max
            f.min = network.min
            if (!!amount) {
                let fee = network.feeFactor * stringToNumber(amount) / 100
                fee = Math.min(fee, network.feeMax)
                f.fee = fee
                f.finalAmount = stringToNumber(amount) - f.fee
            }

        }
        if (!!availableBanks && flow === 'withdraw' && type === 'bank') {
            const withdrawFees = availableBanks.data?.withdraw
            f.max = withdrawFees.max
            f.min = withdrawFees.min
            if (!!amount) {
                let fee = withdrawFees.feeFactor * stringToNumber(amount) / 100
                fee = Math.min(fee, withdrawFees.feeMax)
                f.fee = fee
                f.finalAmount = stringToNumber(amount) - f.fee
            }
        }
        return f
    }, [network, type, flow, coin, amount, availableBanks])

    return (
        <div className={'flex flex-col gap-2 text-sm text-secondary'}>
            <div className={'flex items-center gap-2 text-xs'}>
                {/* <Decoration /> */}
                <TbInfoCircle className="text-cBlue" size={16}/>
                <Text tid={isWithdraw ? 'maxWithdraw' : 'maxDeposit'} />:{' '}
                <span dir={isToman ? 'rtl' : 'ltr'}>
                    {formatNumber(fee.max)} {!!isToman ? <Text tid='toman' /> : coin?.id?.toUpperCase()}
                </span>
            </div>
            <div className={'flex items-center gap-2 text-xs'}>
                {/* <Decoration /> */}
                <TbInfoCircle className="text-cBlue" size={16}/>
                <Text tid={isWithdraw ? 'minWithdraw' : 'minDeposit'} />:{' '}
                <span dir={isToman ? 'rtl' : 'ltr'}>
                    {formatNumber(fee.min)} {!!isToman ? <Text tid='toman' /> : coin?.id?.toUpperCase()}
                </span>
            </div>
            {!!amount ?
                <>
                    <div className={'flex items-center gap-2 text-xs'}>
                        {/* <Decoration /> */}
                        <TbInfoCircle className="text-cBlue" size={16}/>
                        <Text tid={'transaction-fee'} />:{' '}
                        <span dir={isToman ? 'rtl' : 'ltr'}>
                            {formatNumber(fee.fee)} {!!isToman ? <Text tid='toman' /> : coin?.id?.toUpperCase()}
                        </span>
                    </div>
                    <div className={'flex items-center gap-2 text-xs'}>
                        {/* <Decoration /> */}
                        <TbInfoCircle className="text-cBlue" size={16}/>
                        <Text tid={'final-amount'} />:{' '}
                        <span dir={isToman ? 'rtl' : 'ltr'}>
                            {formatNumber(fee.finalAmount)} {!!isToman ? <Text tid='toman' /> : coin?.id?.toUpperCase()}
                        </span>
                    </div>
                </>
            : null}
        </div>
    )
}

export default FeeContainer
