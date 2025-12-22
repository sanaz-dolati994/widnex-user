import { ReactComponent as Svg } from '../../../assets/images/receipt-search.svg'

const NoData = ({ show = false }) => {

    return (
        <>
            {show ?
                <div className={'min-h-[240px] w-full flex items-center justify-center flex-col gap-2 left-0 top-0'}>
                    <Svg width={64} />
                    <span className={'text-sm'}>در این لحظه شما سفارشی ندارید.</span>
                    <span className={'text-xs text-gray-500'}>سفارش ها پس از ثبت در این بخش نمایش داده می شوند.</span>
                </div>
                : null}
        </>
    )
}

export default NoData