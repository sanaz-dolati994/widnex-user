import { FaChevronLeft } from 'react-icons/fa'
import Text from '../../core/utils/Text'
import {
    HorizontalLine,
    ItemData,
    LinkItemRow,
} from '../../styles/newStyles/MobileModal.styled'
import { BottomBarOtcIcon, BottomBarSpotIcon } from '../common/icons'
import { useMainContext } from '../../core/contexts/main'

export default function TradeModal() {
    const {
        main: { theme },
    } = useMainContext()

    return (
        <div className='flex flex-col gap-y-5'>
            <h3 className='text-center'>
                <Text tid='trade' className='text-lg font-bold ' />
            </h3>

            <LinkItemRow to='/otc'>
                <ItemData>
                    <BottomBarOtcIcon color={theme === 'dark' && '#d9d9d9'} />
                    <Text tid='quick-trade' />
                </ItemData>

                <FaChevronLeft />
            </LinkItemRow>

            <HorizontalLine />

            <LinkItemRow to='/trade'>
                <ItemData>
                    <BottomBarSpotIcon color={theme === 'dark' && '#d9d9d9'} />
                    <Text tid='spot-trade' />
                </ItemData>

                <FaChevronLeft />
            </LinkItemRow>
        </div>
    )
}
