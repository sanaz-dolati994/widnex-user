import React from 'react'
import OrdersHistory from '../components/OrdersHistory'
import MainLayout from '../components/layouts/MainLayout'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../core/constants/common'
import ROrdersHistory from '../components/responsive/orders/ROrdersHistory'

const UserOrdersHistory = () => {
	const { width } = useWindowSize()

	return <MainLayout>{width > TABLET_SIZE ? <OrdersHistory /> : <ROrdersHistory />}</MainLayout>
}

export default UserOrdersHistory
