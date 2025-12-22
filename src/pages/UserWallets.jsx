import MainLayout from '../components/layouts/MainLayout'
import UserBalance from '../components/my-wallets/UserBalance'
import MyWallets from '../components/my-wallets/MyWallets'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../core/constants/common'
import RUserBalance from '../components/responsive/user-wallet/RUserBalance'
import { useState } from 'react'
import RUserWalletItem from '../components/responsive/user-wallet/RUserWalletItem'
import { MainRow } from '../styles/CommonStyles'
import React from 'react'

const UserWallets = () => {
	const { width } = useWindowSize()

	const [showModal, setShowModal] = useState(false)
	const [activeItem, setActiveItem] = useState({})

	return (
		<MainLayout>
			{!!showModal ? (
				<RUserWalletItem
					setActiveItem={setActiveItem}
					showModal={showModal}
					setShowModal={setShowModal}
					data={activeItem}
				/>
			) : (
				<>
					<MainRow>
						<MyWallets hasIcon={false} />
					</MainRow>
					<MainRow>
						{width > TABLET_SIZE ? (
							<UserBalance />
						) : (
							<RUserBalance
								setActiveItem={setActiveItem}
								showModal={showModal}
								setShowModal={setShowModal}
							/>
						)}
					</MainRow>
				</>
			)}
		</MainLayout>
	)
}

export default UserWallets
