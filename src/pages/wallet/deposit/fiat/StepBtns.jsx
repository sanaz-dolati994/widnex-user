import Text from "../../../../core/utils/Text";
import {ClipLoader} from "react-spinners";
import {getMainTheme} from "../../../../core/utils/theme";


const StepBtns = ({ onBack, onNext, nextTid = 'next', loading = false }) => {


    return (
        <div className={'flex items-center gap-2'}>
            <div className={'text-sm border-[1px] border-active w-[48%] h-[40px] rounded flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer'} onClick={onBack}>
                <Text tid={'back'} />
            </div>
            <div className={'text-sm bg-active text-black w-[48%] h-[40px] rounded flex items-center justify-center hover:brightness-110 cursor-pointer'} onClick={onNext}>
                {loading ?
                    <ClipLoader color={'#000'} size={26} />
                    :
                    <Text tid={nextTid} />
                }
            </div>
        </div>
    )
}

export default StepBtns
