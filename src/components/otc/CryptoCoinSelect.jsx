import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { DText } from '../../styles/CommonStyles'
import { SOCKET_URL } from '../../core/constants/urls'
import ModalLayout from '../layouts/ModalLayout'
import SelectCoin from './SelectCoin'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import MobileModal from '../modals/MobileModal'

const CoinRow = ({ coin, ...rest }) => {
    const { width } = useWindowSize()

    return (
        <div className={'flex items-center gap-1'} {...rest}>
            {!!coin && (
                <>
                    <img
                        src={SOCKET_URL + `assets/icon/${coin.id}.png`}
                        width={width > 1024 ? 24 : 18}
                        height={width > 1024 ? 24 : 18}
                        style={{ margin: '0 4px' }}
                        alt={coin.id}
                    />
                    <DText main>
                        {/* {`${
                            lang === 'fa' ? coin.fa : coin.name
                        } (${coin?.id?.toUpperCase()})`} */}
                        {coin?.id?.toUpperCase() ?? coin.fa}
                    </DText>
                </>
            )}
        </div>
    )
}

const CryptoCoinSelect = ({ coin, type, onChange, size = 30 }) => {
    const [coinModal, setCoinModal] = useState(false)
    const openCoinModal = () => setCoinModal(true)
    const closeCoinModal = () => setCoinModal(false)

    const { width } = useWindowSize()

    return (
        <>
            <div
                className={'flex justify-around items-center w-full'}
                onClick={openCoinModal}>
                <CoinRow coin={coin} size={size} />
                <FiChevronDown size={18} />
            </div>
            {width >= 1024 ? (
                <ModalLayout
                    open={coinModal}
                    onClose={closeCoinModal}
                    width={'520px'}
                    isPortal>
                    <SelectCoin
                        onClose={closeCoinModal}
                        type={type}
                        onChange={onChange}
                    />
                </ModalLayout>
            ) : (
                <MobileModal isOpen={coinModal} onClose={closeCoinModal}>
                    <SelectCoin
                        onClose={closeCoinModal}
                        type={type}
                        onChange={onChange}
                    />
                </MobileModal>
            )}
        </>
    )
}

export default CryptoCoinSelect
