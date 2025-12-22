import { forwardRef } from 'react'
import { useMainContext } from '../../core/contexts/main'
import { Flex, FlexCenter, FlexColumn } from '../../styles/CommonStyles'
import {
    DropBody,
    MText,
    NotItem,
    NotText,
} from '../../styles/layout-styles/HeaderStyles'
import Text from '../../core/utils/Text'
import { IoIosClose } from 'react-icons/io'
import { formatDate } from '../../core/utils/common'
import { useReadNotificationMutation } from '../../core/services/react-query/useNotificationsQuery'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../../core/constants/common'
import { HOME } from '../../core/constants/urls'
import { ScaleLoader } from 'react-spinners'

const NotificationDropdown = forwardRef((props, ref) => {
    const { notifications, loading } = props
    const {
        main: { lang },
    } = useMainContext()
    const { width } = useWindowSize()

    const {
        mutate: readNotification,
        isLoading,
    } = useReadNotificationMutation()

    const onNotificationRead = (id) => {
        readNotification(id)
    }

    const onSeeAllClick = () => {
        window.location.href = HOME + 'user/notifications'
    }

    return (
        <DropBody
            style={{
                padding: '10px 20px',
                minWidth: width < TABLET_SIZE ? '240px' : '320px',
                backgroundColor: '#0f1c2e',
            }}
            className='translate-x-[50%]'
            ref={ref}>
            <Flex
                style={{
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #c3c5b770',
                    padding: '10px 0',
                }}>
                <MText>
                    <Text tid='my-notifications' />
                </MText>
                <MText onClick={onSeeAllClick} style={{ color: '#4f31c5' }}>
                    <Text tid='see-all' />
                </MText>
            </Flex>
            {loading || isLoading ? (
                <FlexCenter width='100%' height='200px'>
                    <ScaleLoader height={22} width={2} color='#4f31c5' />
                </FlexCenter>
            ) : (
                <>
                    {notifications?.data?.map((not) => (
                        <NotItem key={not._id}>
                            <IoIosClose
                                onClick={() => onNotificationRead(not._id)}
                                style={{ cursor: 'pointer', margin: '0 4px' }}
                                size={22}
                            />
                            <FlexColumn style={{ width: '70%' }}>
                                <NotText fontSize='0.9rem'>{not.title}</NotText>
                                <Flex>
                                    <NotText
                                        fontSize='0.8rem'
                                        style={{ margin: '0 5px' }}>
                                        {formatDate(
                                            not.createdAt,
                                            'date',
                                            lang === 'en' ? 'en-US' : 'fa-IR'
                                        )}
                                    </NotText>
                                    <NotText fontSize='0.8rem'>
                                        {formatDate(
                                            not.createdAt,
                                            'time',
                                            lang === 'en' ? 'en-US' : 'fa-IR'
                                        )}
                                    </NotText>
                                </Flex>
                            </FlexColumn>
                            <NotText
                                fontSize='0.8rem'
                                color={
                                    not.priority === 'HIGH'
                                        ? 'red'
                                        : not.priority === 'MEDIUM'
                                        ? 'yellow'
                                        : 'green'
                                }>
                                <Text tid={not.priority.toLowerCase()} />
                            </NotText>
                        </NotItem>
                    ))}
                </>
            )}

            {(notifications?.data?.length === 0 || !notifications) && (
                <FlexCenter style={{ height: '100px' }}>
                    <MText fontSize='1rem'>
                        <Text tid='no-notification' />
                    </MText>
                </FlexCenter>
            )}
        </DropBody>
    )
})

export default NotificationDropdown
