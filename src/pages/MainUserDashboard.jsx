import { useState } from 'react'

import { MainRow, Grid, MainTab, TabContainer } from '../styles/CommonStyles'

import { useWindowSize } from '../core/hooks/useWindowSize'
import ActivityCard from '../components/ActivityCard'
import ProfileCard from '../components/ProfileCard'
import SymbolOverview from '../components/SymbolOverview'
import CurrentOrders from '../components/CurrentOrders'
import MainLayout from '../components/layouts/MainLayout'
import MyWallets from '../components/my-wallets/MyWallets'
import Text from '../core/utils/Text'
import RCurrentOrders from '../components/responsive/orders/RCurrentOrders'
import TwoStepAuthReminderModal from '../components/modals/TwoStepAuthReminderModal'

const MainUserDashboard = () => {
    const { width } = useWindowSize()
    const [tab, setTab] = useState(0)

    return (
        <MainLayout>
            {width > 1050 ? (
                <>
                    <Grid
                        className={
                            'grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-8'
                        }>
                        <ProfileCard />
                        <SymbolOverview />
                        <ActivityCard
                            width='100%'
                            // height='350px'
                        />
                        <MyWallets showIcon={false} width='100%' />
                    </Grid>
                    <MainRow style={{ marginTop: '32px' }}>
                        <CurrentOrders hasFilters={false} />
                    </MainRow>
                </>
            ) : (
                <>
                    <SymbolOverview />
                    <ProfileCard />
                    <TabContainer>
                        {tabs.map((item, idx) => (
                            <MainTab
                                onClick={() => setTab(idx)}
                                active={idx === tab}>
                                <Text tid={item} />
                            </MainTab>
                        ))}
                    </TabContainer>
                    {tab === 0 && <MyWallets showIcon={false} />}
                    {tab === 1 && <ActivityCard />}
                    {tab === 2 && <RCurrentOrders />}
                </>
            )}
            <TwoStepAuthReminderModal />
        </MainLayout>
    )
}

const tabs = ['wallet', 'activities-devices', 'current-orders']

export default MainUserDashboard
