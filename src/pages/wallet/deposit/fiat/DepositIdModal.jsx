import {useGetFiatDepositAccount} from "../../../../core/services/react-query/useSetting";
import Text from "../../../../core/utils/Text";
import { IoIosInformationCircleOutline } from "react-icons/io";
import {ClipLoader} from "react-spinners";
import {getMainTheme} from "../../../../core/utils/theme";
import {useCopyToClipboard} from "../../utils/useCopyToClipboard";
import React from "react";


const DepositIdModal = ({ onFinish }) => {

    const { data: depositId, isLoading } = useGetFiatDepositAccount()

    return (
        <div className={'flex flex-col'}>
            <div className={'flex justify-center'}>
                <Text tid={'get-deposit-id'} className={'text-sm'} />
            </div>
            <div className={'mt-10 rounded-md w-full bg-yellow-200 p-2 gap-2 text-black text-xs leading-5 tracking-normal'}>
                <div className={'flex items-center gap-1'}>
                    <IoIosInformationCircleOutline size={20} />
                    <Text tid={'get-deposit-note-1'} />
                </div>
                <div className={'flex flex-col gap-1 mx-6 mt-3'}>
                    <Text tid={'get-deposit-note-2'} />
                    <Text tid={'get-deposit-note-3'} />
                </div>
            </div>
            {isLoading ?
                <div className={'mt-8'}>
                    <ClipLoader size={32} color={getMainTheme().active} />
                </div>
            :
                <>
                    <div className={'w-full mt-3 rounded-md bg-gray-300 dark:bg-gray-700 flex items-center justify-between px-3 py-2 dark:text-white text-black text-xs'}>
                        <Text tid={'id-deposit'} />
                        <CT text={depositId?.destinationLabel} />
                    </div>
                    <div className={'w-full mt-3 rounded-md bg-gray-300 dark:bg-gray-700 flex items-center justify-between px-3 py-2 dark:text-white text-black text-xs'}>
                        <Text tid={'sheba-no'} />
                        <CT text={depositId?.destinationIban} />
                    </div>
                    <div className={'flex items-center gap-2 dark:text-white text-black text-xs mt-5'}>
                        <Text tid={'bank-owner'} />
                        <span>{depositId?.destinationOwnerName}</span>
                    </div>
                </>
            }

            <div className={'text-sm bg-active text-black w-full h-[40px] rounded flex items-center justify-center hover:brightness-110 cursor-pointer text-sm mt-5'} onClick={onFinish}>
                <Text tid={'i-understand'} />
            </div>

        </div>
    )
}

const CT = ({ text }) => {

    const { copyToClip } = useCopyToClipboard()

    return (
        <div className={'flex items-center gap-2 '}>
            <span>{text}</span>
            <div className={'border-[1px] p-1 rounded cursor-pointer'} onClick={() => copyToClip(text)}>
                <Text tid={'copy'} />
            </div>
        </div>
    )
}

export default DepositIdModal
