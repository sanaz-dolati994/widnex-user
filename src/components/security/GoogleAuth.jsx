import React from 'react'
import { useState } from 'react'
import Wizard from '../authentication/Wizard'
import {
	FaApple,
	FaQrcode,
	FaUnlockAlt,
	FaRegCaretSquareRight,
	FaClipboardCheck,
} from 'react-icons/fa'
import { AuthWrapper } from '../../styles/AuthenticationStyles'
import CardLayout from '../layouts/CardLayout'
import AppDownload from './AppDownload'
import ScanQr from './ScanQr'
import SetupApp from './SetupApp'
import AuthLoading from '../authentication/AuthLoading'
import RestoreCode from './RestoreCode'
import ProcessCompletion from './ProcessCompletion'
import { TABLET_SIZE } from '../../core/constants/common'
import Authentication from '../authentication/Authentication'
import RWizard from '../responsive/authentication/RWizard'
import { useWindowSize } from '../../core/hooks/useWindowSize'

const GoogleAuth = ({ loadingState, setGoogleAuth }) => {
	const { loading, setLoading } = loadingState
	const [active, setActive] = useState(0)
	const [active2fa, setActive2fa] = useState(null)
	const { width } = useWindowSize()

	const onSubmitClicked = (type) => {
		if (type === 'valid') {
			setLoading(true)
			setActive((state) => state + 1)
		}
	}

	return (
		<div className='col-span-full'>
			{width > TABLET_SIZE ? (
				<>
					<Wizard active={active} items={wizardData} />
				</>
			) : (
				<>
					<RWizard active={active} items={wizardData} />
				</>
			)}
			<AuthWrapper>
				<CardLayout width='100%' >
					{active === 0 && <AppDownload onSubmitClicked={onSubmitClicked} />}
					{active === 1 && (
						<ScanQr
							onSubmitClicked={onSubmitClicked}
							setLoading={setLoading}
							setActive2fa={setActive2fa}
						/>
					)}
					{active === 2 && (
						<RestoreCode
							onSubmitClicked={onSubmitClicked}
							setLoading={setLoading}
							active2fa={active2fa}
						/>
					)}
					{active === 3 && <SetupApp onSubmitClicked={onSubmitClicked} setLoading={setLoading} />}
					{active === 4 && (
						<ProcessCompletion setLoading={setLoading} setGoogleAuth={setGoogleAuth} />
					)}
				</CardLayout>
				<AuthLoading loading={loading} />
			</AuthWrapper>
		</div>
	)
}

const wizardData = [
	{ title: 'app-download', icon: FaApple },
	{ title: 'scan-qr', icon: FaQrcode },
	{ title: 'restore-code', icon: FaUnlockAlt },
	{ title: 'setup-app', icon: FaRegCaretSquareRight },
	{ title: 'process-completion', icon: FaClipboardCheck },
]

export default GoogleAuth
