import React, { useEffect, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import NewSidebar from './NewSidebar'
import NewHeader from './NewHeader'
import NewBottomBar from './NewBottomBar'
import { AuthContextProvider } from '../../core/contexts/auth'
import { getMainTheme } from '../../core/utils/theme'
import { useMainContext } from '../../core/contexts/main'
import Toast from '../modals/Toast'
import ModalLayout from './ModalLayout'
import MaintenanceModeModal from '../modals/MaintainanceMode'

export default function MainLayout({ children }) {
	const {
		main: { theme, lang },
	} = useMainContext()

	const [isSidebarExpanded, setIsSidebarExpanded] = useState(false)
	const { width } = useWindowSize()

	const [maintenanceMode, setMaintenanceMode] = useState(false);

	useEffect(() => {
		localStorage.removeItem('maintenanceMode')

	}, []);

	const onCloseMaintenanceMode = () => {
		setMaintenanceMode(false);
	};


	const toggleSidebar = () => {
		setIsSidebarExpanded((prevState) => !prevState)
	}
	const openSideBar = () => setIsSidebarExpanded(true)
	const closeSideBar = () => setIsSidebarExpanded(false)

	const showSidebar = width > 768

	return (
		<ThemeProvider theme={getMainTheme(theme, lang)}>
			<AuthContextProvider>
				<NewHeader isSidebarExpanded={isSidebarExpanded} showSidebar={showSidebar} />
				<LayoutContainer dir='rtl' mobile={width < 1024}>
					{showSidebar && (
						<>
							<SidebarOverlay isExpanded={isSidebarExpanded} onClick={toggleSidebar} />
							<NewSidebar
								isSidebarExpanded={isSidebarExpanded}
								toggleSidebar={toggleSidebar}
								openSideBar={openSideBar}
								closeSideBar={closeSideBar}
							/>
						</>
					)}

					<MainContent className={isSidebarExpanded && showSidebar ? 'expanded' : 'collapsed'}>
						<div className='main-content'>{children}</div>
					</MainContent>
					<ModalLayout open={maintenanceMode} onClose={onCloseMaintenanceMode} width={'520px'} >
						<MaintenanceModeModal onClose={onCloseMaintenanceMode} />
					</ModalLayout>
				</LayoutContainer>
				{width <= 768 && <NewBottomBar />}
				<Toast />
			</AuthContextProvider>
		</ThemeProvider>
	)
}

const LayoutContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: calc(100vh - 70px - 3rem);
	padding: 0 1rem;
	margin-bottom: ${(props) => (props.mobile ? '80px' : 0)};

	@media screen and (max-width: 1024px) {
		min-height: 100vh;
		height: auto;
		padding: 0;
	}

	@media screen and (max-width: 768px) {
		gap: 0;
	}
`

const SidebarOverlay = styled.div`
	position: fixed;
	top: 0;
	right: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.5);
	transition: opacity 0.3s;
	opacity: ${({ isExpanded }) => (isExpanded ? '1' : '0')};
	pointer-events: ${({ isExpanded }) => (isExpanded ? 'auto' : 'none')};
	z-index: 150;
`

const MainContent = styled.main`
	height: 100%;
	margin-right: ${({ className }) =>
		className === 'expanded' ? 'calc(320px + 1rem)' : 'calc(96px + 1rem)'};
	transition: margin-right 0.3s;
	display: flex;
	flex-direction: row;
	gap: 1rem;

	/* TODO: COMMITING GOOD OLD FRIEND =)) GOODBYE FRIEND */
	/* border: 1px solid red; */

	border-radius: 12px;

	.main-content {
		flex-grow: 1;
		max-width: 1920px;
		margin: 0 auto;
	}

	@media screen and (max-width: 1024px) {
		height: auto;
		flex-grow: 1;
		border-radius: 0;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
		margin: 0;
		padding: 0;
		gap: 0;
	}
`
