import React, {useState} from "react";
import ModalLayout from "../../../../components/layouts/ModalLayout";
import { FaInfoCircle } from "react-icons/fa";
import {getMainTheme} from "../../../../core/utils/theme";
import Text from "../../../../core/utils/Text";
import ChooseAccount from "../../utils/ChooseAccount";
import StepBtns from "./StepBtns";


const Step3Id = ({ bankAccount, setBankAccount, onAction, onBack }) => {

    const [modal, setModal] = useState(true)
    const closeModal = () => setModal(false)

    return (
        <>
            <ModalLayout
                width={'400px'}
                open={modal}
                isStatic
            >
                <div className={'px-3 w-full flex flex-col gap-1 text-[0.8rem]'}>
                    <div className={'flex justify-center'}>
                        <div className={'border-[4px] p-1 border-active rounded-[50%]'}>
                            <FaInfoCircle size={42} color={getMainTheme().active} />
                        </div>
                    </div>
                    <Text tid={'deposit-id-note-1'} className={'mt-5'} />
                    <div className={'mx-2 flex flex-col gap-1'}>
                        <Text tid={'deposit-id-note-2'} />
                        <Text tid={'deposit-id-note-3'} />
                        <Text tid={'deposit-id-note-4'} />
                    </div>
                    <Text tid={'deposit-id-note-5'} className={'mt-4'}/>
                    <div className={'text-sm bg-active text-black w-full h-[40px] rounded flex items-center justify-center hover:brightness-110 cursor-pointer text-sm mt-5'} onClick={closeModal}>
                        <Text tid={'i-understand'} />
                    </div>
                </div>
            </ModalLayout>

            <div className={'mx-auto max-w-[520px] flex flex-col gap-10 items-center'}>
                <div className={'mx-auto'}>
                    <ChooseAccount
                        label={'choose-bank-account'}
                        type={'bank'}
                        value={bankAccount}
                        onOptionChange={setBankAccount}
                        depositWithId
                    />
                </div>
                <div className={'w-full'}>
                    <StepBtns
                        onBack={onBack}
                        onNext={onAction}
                        nextTid={'get-deposit-id'}
                    />
                </div>
            </div>
        </>
    )
}


export default Step3Id
