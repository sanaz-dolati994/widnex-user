import Text from "../../core/utils/Text";
import { IconWrapper } from "../../styles/CoinOperationStyles";
import { DText } from "../../styles/CommonStyles";
import { IoCloseCircle } from "react-icons/io5";


const MaintenanceModeModal = ({ onClose }) => {

    return (
        <div className="flex flex-col">
            <div className="flex justify-end">
                <IconWrapper onClick={onClose}>
                    <IoCloseCircle size={24} />
                </IconWrapper>
            </div>
            <div className="w-full flex justify-start mt-2" fw justify={'flex-start'}>
                <Text tid={'maintenance-mode-title'} className="text-sm md:text-base" />
            </div>
            <div className="w-full flex flex-col items-start gap-2">
                <Text tid={'maintenance-mode-desc-1'} className="text-sm md:text-base" />
                <Text tid={'maintenance-mode-desc-2'} className="text-sm md:text-base" />
                <Text tid={'maintenance-mode-desc-3'} className="text-sm md:text-base" />
                <Text tid={'maintenance-mode-desc-4'} className="text-sm md:text-base" />
            </div>
        </div>
    )
}

export default MaintenanceModeModal
