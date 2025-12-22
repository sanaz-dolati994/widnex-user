import Card from '../components/common/Card'
import NewLayout from '../components/layouts/NewLayout'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { ItemData, ItemRow } from '../styles/newStyles/MobileModal.styled'
import { BuySellIcon } from '../components/common/icons'
import Text from '../core/utils/Text'
import Otc from '../components/otc/Otc'
import { useOtc } from '../components/otc/useOtc'
import OtcMarket from '../components/otc/OtcMarket'
import { useState } from 'react'
import ModalLayout from '../components/layouts/ModalLayout'
import { TABLET_SIZE } from '../core/constants/common'
import OtcDetails from '../components/otc/OtcDetails'
import MobileModal from '../components/modals/MobileModal'
import UserOtcHistory from './UserOtcHistory'

const SUBNAV = [
	{ tid: 'buy', Icon: BuySellIcon },
	{ tid: 'sell', Icon: BuySellIcon },
]

export default function UserOtc() {
	const { type, setType } = useOtc()
	const [selectedCoin, setSelectedCoin] = useState(null)

	const { width } = useWindowSize()
	const [detailsModal, setDetailsModal] = useState({
		open: false,
		item: null,
	})

	const onModalClosed = () => {
		setDetailsModal({ id: null, open: false })
	}

	const renderedItems = SUBNAV.map((navItem, index) => {
		const { Icon, tid } = navItem
		return (
			<ItemRow
				key={tid}
				onClick={() => setType(tid)}
				className={`cursor-pointer text-sm hover:bg-gray-light dark:hover:bg-white/10 transition rounded-lg px-4 ${type === tid ? 'bg-gray-light dark:bg-white/10' : ''
					}`}
			>
				<ItemData className='text-sm'>
					<Icon color={type === tid && '#0773F1'} />
					<Text tid={tid} />
				</ItemData>
			</ItemRow>
		)
	})

	return (
		<NewLayout>
			<div className={'pb-5'}>
				<div className={`grid grid-cols-1 lg:grid-cols-6 lg:gap-4 h-[460px]`}>
					{/* <Card
                    className={`${
                        width < 1024 ? '' : 'col-span-1 space-y-4 self-start '
                    }`}>
                    {renderedItems}
                </Card> */}

					{width >= 1024 ? (
						<Card className={`col-span-1 space-y-4 self-start`}>{renderedItems}</Card>
					) : (
						<Card padding='px-0'>
							<div className='flex items-center justify-start'>
								<TabBar activeTab={type} onTabChange={setType} />
							</div>
						</Card>
					)}

					<Card
						className={`col-span-3 ${width > 1024 ? 'overflow-hidden' : 'self-start'} relative`}
						padding='p-0'
					>
						<h3 className='hidden lg:block bg-gray-light text-heading dark:bg-white/5 dark:text-pColor py-5 text-center text-base font-semibold'>
							<Text tid={`${type}-asset`} />
						</h3>
						<Otc type={type} selectedCoin={selectedCoin} />
					</Card>

					<Card className={'col-span-2 hidden lg:block mt-0 lg:overflow-y-auto'}>
						<OtcMarket setSelectedCoin={setSelectedCoin} />
					</Card>
				</div>

				<Card className={'mt-4 relative'}>
					<UserOtcHistory setDetailsModal={setDetailsModal} />
				</Card>
			</div>

			{
				width > 1024 ? (
					<ModalLayout
						width={width > TABLET_SIZE ? '600px' : '100%'}
						open={detailsModal.open}
						onClose={onModalClosed}>
						<OtcDetails
							data={detailsModal.item}
							onClose={onModalClosed}
						/>
					</ModalLayout>
				) : (
					<MobileModal isOpen={detailsModal.open} onClose={onModalClosed}>
						<OtcDetails
							data={detailsModal.item}
							onClose={onModalClosed}
						/>
					</MobileModal>
				)
			}
		</NewLayout>
	)
}

const TABS = ['buy', 'sell']

const TabBar = ({ onTabChange, activeTab }) => {
	return TABS.map((tab) => {
		return (
			<h3
				key={tab}
				className={`${activeTab === tab ? 'text-cBlue border-cBlue' : 'border-transparent'
					} cursor-pointer border-b-2 transition pb-2 flex-1 text-center pt-3`}
				onClick={onTabChange.bind(null, tab)}
			>
				<Text tid={tab} />
			</h3>
		)
	})
}
