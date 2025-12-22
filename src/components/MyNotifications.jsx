import { useEffect, useState } from 'react'
import CardLayout from './layouts/CardLayout'
import { HeaderColumn, HeaderRow, NoDataWrapper } from '../styles/TableStyle'
import { Table, Row, Column } from '../styles/TableStyle'
import { TableWrapper } from '../styles/OrdersStyle'
import { AnimatePresence } from 'framer-motion'
import { formatDate, variants } from '../core/utils/common'
import {
    DText,
    FlexCenter,
    PaginationContainer,
    ReadAllNotsWrapper,
} from '../styles/CommonStyles'
import Pagination from 'react-js-pagination'
import {
    useNotificationsQuery,
    useReadAllNotificationsMutation,
    useReadNotificationMutation,
    useUnreadNotificationQuery,
} from '../core/services/react-query/useNotificationsQuery'
import Text from '../core/utils/Text'
import { useMainContext } from '../core/contexts/main'
import Description from './modals/Description'
import { ScaleLoader } from 'react-spinners'

const MyNotifications = () => {
    const {
        main: { lang, theme },
    } = useMainContext()

    const [activePage, setActivePage] = useState(1)
    const [totalPages, setTotalPages] = useState(null)

    const [showNote, setShowNote] = useState({
        show: false,
        idx: -1,
    })

    const { data: notifications, isFetching, refetch } = useNotificationsQuery(
        activePage
    )
    const { data: unreadNots } = useUnreadNotificationQuery()
    const { mutate: readNots } = useReadAllNotificationsMutation()
    const { mutate: readANote } = useReadNotificationMutation()

    useEffect(() => {
        if (notifications) {
            setTotalPages(notifications.meta.total)
        }
    }, [notifications])

    useEffect(() => {
        if (notifications?.data?.length) {
            let shouldRefech = false
            try {
                notifications.data.forEach((not) => {
                    if (!not.readAt) {
                        shouldRefech = true
                        readANote(not._id)
                    }
                })
            } catch (err) {
                console.log(err)
            } finally {
                if (shouldRefech) {
                    setTimeout(refetch, 1000)
                }
            }
        }
    }, [notifications, activePage])

    const onPageChange = (p) => {
        setActivePage(p)
    }

    useEffect(refetch, [activePage])

    const readAllNotifications = () => {
        readNots()
    }

    return (
        <CardLayout width='100%' minHeight='60vh'>
            {unreadNots?.data?.length ? (
                <FlexCenter style={{ justifyContent: 'flex-end' }}>
                    <ReadAllNotsWrapper onClick={readAllNotifications}>
                        <DText>
                            <Text tid='read-all-notifications' />
                        </DText>
                    </ReadAllNotsWrapper>
                </FlexCenter>
            ) : null}
            <AnimatePresence exitBeforeEnter>
                {!isFetching && notifications?.data?.length ? (
                    <TableWrapper
                        height='75%'
                        variants={variants}
                        initial='out'
                        animate='in'
                        exit='out'>
                        <Table width='100%'>
                            <HeaderRow>
                                {headers.map((header) => (
                                    <HeaderColumn
                                        fontSize='0.9rem'
                                        width={header.width}>
                                        <Text tid={header.title} />
                                    </HeaderColumn>
                                ))}
                            </HeaderRow>
                            {notifications.data.map((item, index) => {
                                const priority = item.priority.toLowerCase()

                                return (
                                    <Row key={item.createdAt}>
                                        <Column width='15%'>
                                            {item.title}
                                        </Column>
                                        <Column
                                            style={{ cursor: 'pointer' }}
                                            width='25%'
                                            onMouseEnter={() =>
                                                setShowNote({
                                                    show: true,
                                                    idx: index,
                                                })
                                            }
                                            onMouseLeave={() =>
                                                setShowNote({
                                                    show: false,
                                                    idx: -1,
                                                })
                                            }>
                                            {item.body
                                                ? item.body
                                                      .toString()
                                                      .substring(0, 50) +
                                                  (item.body.toString().length >
                                                  50
                                                      ? '...'
                                                      : '')
                                                : '--'}
                                            <Description
                                                show={
                                                    item.body?.toString()
                                                        ?.length > 50 &&
                                                    showNote.show &&
                                                    showNote.idx === index
                                                }
                                                onClose={() =>
                                                    setShowNote({
                                                        show: false,
                                                        idx: -1,
                                                    })
                                                }
                                                note={item.body}
                                            />
                                        </Column>
                                        <Column width='12%'>
                                            <Text
                                                tid={item.type.toLowerCase()}
                                            />
                                        </Column>
                                        <Column
                                            width='12%'
                                            color={
                                                priority === 'high'
                                                    ? '#1ce087'
                                                    : priority === 'medium'
                                                    ? '#4f31c5'
                                                    : '#a12356'
                                            }>
                                            <Text tid={priority} />
                                        </Column>
                                        <Column width='12%' number>
                                            {formatDate(
                                                item.createdAt,
                                                'date',
                                                lang === 'en'
                                                    ? 'en-US'
                                                    : 'fa-IR'
                                            )}
                                        </Column>
                                        <Column width='12%' number>
                                            {formatDate(
                                                item.createdAt,
                                                'time',
                                                lang === 'en'
                                                    ? 'en-US'
                                                    : 'fa-IR'
                                            )}
                                        </Column>
                                        <Column width='12%' number>
                                            {item.readAt ? (
                                                formatDate(
                                                    item.readAt,
                                                    'date',
                                                    lang === 'en'
                                                        ? 'en-US'
                                                        : 'fa-IR'
                                                )
                                            ) : (
                                                <Text tid='did-not-read' />
                                            )}
                                        </Column>
                                    </Row>
                                )
                            })}
                        </Table>
                    </TableWrapper>
                ) : (
                    <FlexCenter height='50vh'>
                        <ScaleLoader
                            color='#4f31c5'
                            height='24px'
                            width='2px'
                        />
                    </FlexCenter>
                )}
            </AnimatePresence>

            {!isFetching && !notifications?.data?.length && (
                <div className={'p-5'}>
                    <NoDataWrapper top='80px'>
                        <img
                            alt=' '
                            src={require('../assets/images/noData.png')}
                        />
                    </NoDataWrapper>
                </div>
            )}
            {totalPages ? (
                <PaginationContainer>
                    <Pagination
                        activePage={activePage}
                        itemsCountPerPage={10}
                        totalItemsCount={totalPages}
                        pageRangeDisplayed={3}
                        onChange={(p) => onPageChange(p)}
                        itemClass={
                            theme === 'light' ? 'd-page-item' : 'page-item'
                        }
                        linkClass={
                            theme === 'light' ? 'd-page-link' : 'page-link'
                        }
                    />
                </PaginationContainer>
            ) : null}
        </CardLayout>
    )
}

const headers = [
    { title: 'title', width: '15%' },
    { title: 'description', width: '25%' },
    { title: 'type', width: '12%' },
    { title: 'priority', width: '12%' },
    { title: 'createdAt', width: '12%' },
    { title: 'timeHour', width: '12%' },
    { title: 'readAt', width: '12%' },
]

export default MyNotifications
