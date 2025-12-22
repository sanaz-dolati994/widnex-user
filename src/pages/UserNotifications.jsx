import MyNotifications from '../components/MyNotifications'
import MainLayout from '../components/layouts/MainLayout'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../core/constants/common'
import React from 'react'
import RMyNotifications from '../components/responsive/notifications/RMyNotifications'

const UserNotifications = () => {
	const { width } = useWindowSize()

	return <MainLayout>{width > TABLET_SIZE ? <MyNotifications /> : <RMyNotifications />}</MainLayout>
}

export default UserNotifications
