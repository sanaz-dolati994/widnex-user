import OtcHistory from '../components/OtcHistory'
import MainLayout from '../components/layouts/MainLayout'
import { TABLET_SIZE } from '../core/constants/common'
import ROrdersHistory from '../components/responsive/orders/ROrdersHistory'
import React, { useEffect } from 'react'
import ROtcHistory from '../components/responsive/orders/ROtcHistory'
import { useWindowSize } from '../core/hooks/useWindowSize'

const UserOtcHistory = ({ setDetailsModal }) => {
	const { width } = useWindowSize()

	return width > TABLET_SIZE ? <OtcHistory setDetailsModal={setDetailsModal} /> : <ROtcHistory setDetailsModal={setDetailsModal} />
}

export default UserOtcHistory
