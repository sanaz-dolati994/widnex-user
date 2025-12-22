import Card from '../components/common/Card'
import NewLayout from '../components/layouts/NewLayout'
import Notifications from '../components/Notifications'
import RNotifications from '../components/responsive/notifications/RNotifications'
import { useWindowSize } from '../core/hooks/useWindowSize'

export default function NewUserNotifications() {
	const { width } = useWindowSize()

	return (
		<NewLayout>
			<Card className='min-h-[80vh] relative lg:h-full'>
				{width > 1024 ? <Notifications /> : <RNotifications />}
			</Card>
		</NewLayout>
	)
}
