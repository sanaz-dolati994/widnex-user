import { useState } from "react"
import Loading from "../common/Loading"
import { usePersianNames } from "../utils"
import { useCurrentOrders } from "../utils/useHistory"
import { AnimatePresence, motion } from "framer-motion"
import { SOCKET_URL } from "../../../core/constants/urls"
import { formatDate, formatNumber } from "../../../core/utils/common"
import Text from "../../../core/utils/Text"
import { BiChevronDown } from "react-icons/bi"
import NoData from "./NoData"
import MobileModal from "../../../components/modals/MobileModal"


const ROpenOrders = () => {

    const { findPersianName } = usePersianNames()
    const {
        orders,
        deleteModal,
        setDeleteModal,
        onCloseDeleteModal,
        onModalClicked,
        loading,
        isDeleting
    } = useCurrentOrders()

    const [openItem, setOpenItem] = useState(-1)


    return (
        <div className={'flex flex-col gap-2 max-h-[280px] overflow-y-auto overflow-x-hidden relative min-h-[200px] mt-5'}>
            <Loading loading={loading} />
            <NoData
                show={orders?.data?.length === 0}
            />
            {orders?.data?.map((order, idx) => {

                const active = idx === openItem
                const onItem = () => {
                    if (active) setOpenItem(-1)
                    else setOpenItem(idx)
                }

                return (
                    <div key={order._id} className={'border-b-[1px] dark:border-card-border py-2'} onClick={onItem}>
                        <div className={'grid grid-cols-2 gap-2'}>
                            <div className={'flex items-center gap-2'}>
                                <img
                                    width={32}
                                    height={32}
                                    src={SOCKET_URL + `assets/icon/${order?.coin?.toLowerCase()}.png`}
                                    alt={`${order.coin?.toLowerCase()}.png`}
                                />
                                <div className={'flex flex-col'}>
                                    <span className={'text-[0.8rem]'}>
                                        <span>{`${order.coin?.toUpperCase()}`}</span>
                                        <span className={'text-gray-400 dark:text-gray-500'}> / </span>
                                        <span className={'text-gray-400 dark:text-gray-500'}>{`${order.pair?.toUpperCase()}`}</span>
                                    </span>
                                    <span className={'text-gray-400 text-[0.7rem]'}>
                                        <span>{`${findPersianName(order.coin)}`}</span>
                                        <span> / </span>
                                        <span>{`${findPersianName(order.pair)}`}</span>
                                    </span>
                                </div>
                            </div>

                            <div className={'text-xs flex items-center justify-end gap-2'}>
                                <span>{formatNumber(order.amount, { type: order.coin })}</span>
                                <div className={`${order.type === 'buy' ? 'bg-green-400' : 'bg-red-400'}
                                 text-slate-800 px-2 py-[2px] rounded-md bg-opacity-20`}>
                                    <Text tid={order.type} className={` ${order.type === 'buy' ? 'text-green-400' : 'text-red-400'}`} />
                                </div>
                                <div className={`${active ? 'rotate-180' : ''} transition`}>
                                    <BiChevronDown size={18} />
                                </div>
                            </div>
                        </div>
                        <AnimatePresence exitBeforeEnter>
                            {active ?
                                <motion.div
                                    variants={variants}
                                    initial={'out'}
                                    exit={'out'}
                                    animate={'in'}
                                    className={'text-[0.8rem] mt-2 px-2'}
                                >
                                    <div className={'grid grid-cols-2 gap-3'}>
                                        <span className={'dark:text-slate-400'}>وضعیت</span>
                                        <div className={'flex justify-end'}>
                                            <span>{order.status}</span>
                                        </div>
                                        <span className={'dark:text-slate-400'}>تاریخ</span>
                                        <div className={'flex justify-end'}>
                                            {formatDate(order.createdAt, 'date', 'Fa-IR')}
                                        </div>

                                        <span className={'dark:text-slate-400'}>نوع</span>
                                        <div className={'flex justify-end'}>
                                            <span>{order.submit}</span>
                                        </div>
                                        <span className={'dark:text-slate-400'}>مقدار سفارش</span>
                                        <div className={'flex justify-end'}>
                                            <span>{formatNumber(order.amount, { type: order.coin })}</span>
                                        </div>

                                        <span className={'dark:text-slate-400'}>قیمت واحد</span>
                                        <div className={'flex justify-end'}>
                                            <span>{formatNumber(order.priceUnit, { type: order.pair })}</span>
                                        </div>

                                        <span className={'dark:text-slate-400'}>مبلغ کل</span>
                                        <div className={'flex justify-end'}>
                                            <span>{formatNumber(order.price, { type: order.pair })}</span>
                                        </div>

                                        <span className={'dark:text-slate-400'}>مقدار پر شده</span>
                                        <div className={'flex justify-end'}>
                                            <span>{formatNumber(order.tradedAmount, { type: order.coin })}</span>
                                        </div>
                                        <span className={'dark:text-slate-400 mt-2'}>
                                            <Text tid={'operations'} />
                                        </span>
                                        <div className="w-full flex items-center">
                                            <button className="border border-red-500 p-2 rounded-lg w-full" onClick={() => setDeleteModal({ open: true, id: order._id })}>
                                                <Text tid='delete' />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                                : null}
                        </AnimatePresence>

                    </div>

                )
            })}

            <MobileModal width={'470px'} isOpen={deleteModal.open} onClose={onCloseDeleteModal}>
                <div className="flex flex-col gap-10 items-center">
                    <Text tid={'delete-current-order'} />
                    <div className="flex items-center justify-center gap-4 w-full">
                        <button onClick={onModalClicked} className="w-1/2 bg-red-500 rounded-lg flex justify-center items-center p-2">
                            <Text tid={isDeleting ? "deleting" : 'delete'} />
                        </button>
                        <button onClick={onCloseDeleteModal} className="w-1/2 border border-gray-300 dark:border-gray-600 rounded-lg p-2">
                            <Text tid={'cancel'} />
                        </button>
                    </div>
                </div>
            </MobileModal>
        </div>
    )
}

const variants = {
    in: { h: 'auto' },
    out: { h: 0 }
}

export default ROpenOrders