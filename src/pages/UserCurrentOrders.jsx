import React from 'react'
import CurrentOrders from '../components/CurrentOrders'
import MainLayout from '../components/layouts/MainLayout'
import { useWindowSize } from '../core/hooks/useWindowSize'
import RCurrentOrders from '../components/responsive/orders/RCurrentOrders'

const UserCurrentOrders = () => {
	const { width } = useWindowSize()

	return (
		<MainLayout>
			{width > 1050 ? (
				<CurrentOrders hasFilters={true} />
			) : (
				<RCurrentOrders hasFilters={true} />
			)}
		</MainLayout>
	)
}

export default UserCurrentOrders
