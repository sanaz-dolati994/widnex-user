import { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { useMainContext } from '../../core/contexts/main'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import Sidebar from './Sidebar'
import {
    MainBody,
    Flex,
    MainWrapper,
    RespWrapper,
} from '../../styles/layout-styles/CommonStyles'
import MasterHeader from './MasterHeader'
import { CLOSE_SIDEBAR_SIZE, TABLET_SIZE } from '../../core/constants/common'
import { useLocation, useNavigate } from 'react-router-dom'
import { getMainTheme } from '../../core/utils/theme'
import BottomBar from './BottomBar'
import Toast from '../modals/Toast'
import SupportChat from './crisp/components/SupportChat'
import { AuthContextProvider } from '../../core/contexts/auth'
import LogoutLoading from './loading/LogoutLoading'
import ModalLayout from './ModalLayout'
import MaintenanceModeModal from '../modals/MaintainanceMode'

const MainLayout = ({ children, hasSidebar = true } = {}) => {
    const navigate = useNavigate()
    const location = useLocation()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { width } = useWindowSize()

    const {
        main: { theme, lang },
        profile: { token },
    } = useMainContext()
    const windowSize = useWindowSize()

    const [maintenanceMode, setMaintenanceMode] = useState(false);

    useEffect(() => {
        const hasSeenMaintenance = localStorage.getItem('maintenanceMode') === 'true';
        if (!hasSeenMaintenance) {
            setMaintenanceMode(true);
        }
    }, []);

    const onCloseMaintenanceMode = () => {
        setMaintenanceMode(false);
        localStorage.setItem('maintenanceMode', 'true'); // Store as a string
    };

    useEffect(() => {
        if (!token && !location.pathname.includes('/register-signin')) {
            navigate('/register-signin')
        }
    }, [])

    const [boxOpen, setBoxOpen] = useState(false)
    const enterSupport = () => setBoxOpen(true)
    const exitSupport = () => setBoxOpen(false)

    return (
        <ThemeProvider theme={getMainTheme(theme, lang)}>
            <AuthContextProvider>
                <MasterHeader setIsMenuOpen={setIsMenuOpen} />
                <MainBody>
                    <Flex>
                        {hasSidebar && (
                            <Sidebar
                                windowSize={windowSize}
                                isOpen={isMenuOpen}
                                setIsMenuOpen={setIsMenuOpen}
                            />
                        )}
                        {windowSize.width < CLOSE_SIDEBAR_SIZE ? (
                            <RespWrapper>{children}</RespWrapper>
                        ) : (
                            <>
                                {hasSidebar ? (
                                    <MainWrapper>{children}</MainWrapper>
                                ) : (
                                    <RespWrapper>{children}</RespWrapper>
                                )}
                            </>
                        )}
                    </Flex>
                    <ModalLayout open={maintenanceMode} onClose={onCloseMaintenanceMode} width={'520px'} >
                        <MaintenanceModeModal onClose={onCloseMaintenanceMode} />
                    </ModalLayout>
                </MainBody>

                {width < TABLET_SIZE && !boxOpen && <BottomBar />}
                <Toast />
                {/* <SupportChat support={boxOpen} enterSupport={enterSupport} exitSupport={exitSupport} /> */}
                <LogoutLoading />
            </AuthContextProvider>
        </ThemeProvider>
    )
}

export default MainLayout
