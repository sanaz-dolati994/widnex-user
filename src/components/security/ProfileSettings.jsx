import CardLayout from '../layouts/CardLayout'
import Text from '../../core/utils/Text'
import { CheckBox } from '../../styles/RegisterStyles'
import { GoCheck } from 'react-icons/go'
import { TABLET_SIZE } from '../../core/constants/common'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { useAuthContext } from '../../core/contexts/auth'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
	useProfileQuery,
	useUpdateProfileSettings,
} from '../../core/services/react-query/useProfileQuery'
import { ClipLoader } from 'react-spinners'
import TwoFactorModal from '../modals/TwoFactorModal'

const initial = {
	otp: false,
	otpType: 'mobile',
	ga: false,
	onDeposit: false,
	onWithdraw: false,
	onWhiteListWallet: false,
	onWhiteListAccount: false,
	onSettingsUpdate: false,
}

const ProfileSettings = () => {
	const { width } = useWindowSize()

	const [settings, setSettings] = useState(initial)

	const { data: profile } = useProfileQuery()
	const { profileSettings } = useAuthContext()
	useEffect(() => {
		if (!!profileSettings?.settings) setSettings(profileSettings?.settings?.twoFactor)
	}, [profileSettings])

	const IS_VALID = settings.otp || settings.ga

	const onChangeProfileSettings = (v, type) => {
		const needValidationTypes = [
			'onDeposit',
			'onWithdraw',
			'onWhiteListWallet',
			'onWhiteListAccount',
			'onSettingsUpdate',
		]
		if (needValidationTypes.includes(type) && !IS_VALID) return
		setSettings((state) => ({ ...state, [type]: v }))
	}

	const { mutate: update, isLoading } = useUpdateProfileSettings()
	const onUpdateSettings = () => {
		if (isLoading) return
		if (profileSettings?.settings?.twoFactor?.onSettingsUpdate) {
			setAuthModal(true)
		} else {
			onOperationClicked()
		}
	}

	const onOperationClicked = (authData) => {
		const payload = {
			settings: {
				twoFactor: settings,
			},
		}
		if (authData?.otp) payload.otp = authData.otp
		if (authData?.ga) payload.ga = authData.ga
		update(payload)
	}

	const [authModal, setAuthModal] = useState(false)
	const onSubmitTwoFactorModal = (authData) => {
		onOperationClicked(authData)
	}

	return (
		<CardLayout
			width='100%'
			title='towfactor-settings'
			icon={
				<div
					className={
						'rounded-md py-2 px-4 bg-[#4f31c5] md:text-sm text-xs text-white cursor-pointer flex items-center gap-2'
					}
					onClick={onUpdateSettings}
				>
					{isLoading ? <ClipLoader size={14} /> : null}
					<Text tid={width > TABLET_SIZE ? 'update-towfactor-settings' : 'update'} />
				</div>
			}
		>
			<div
				className={'grid grid-cols-1 md:grid-cols-2 md:gap-0 gap-2 items-start relative text-sm'}
			>
				<div className={'grid grid-cols-2 gap-4 md:px-5'}>
					<Text tid={'activate-otp'} />
					<CheckBox onClick={() => onChangeProfileSettings(!settings.otp, 'otp')}>
						{settings.otp && <GoCheck size={width < TABLET_SIZE ? 18 : 24} color='#1ce087' />}
					</CheckBox>
					{settings.otp ? (
						<>
							<Text tid={'otp-type'} />
							<div className={'flex items-center justify-start gap-2'}>
								{['mobile', 'email'].map((item) => {
									return (
										<OtpTypeWrapper
											active={item === settings.otpType}
											key={item}
											onClick={() => onChangeProfileSettings(item, 'otpType')}
										>
											<Text tid={item} />
										</OtpTypeWrapper>
									)
								})}
							</div>
						</>
					) : null}
					{profile?.authenticator && (
						<>
							<Text tid={'activate-ga'} />
							<CheckBox onClick={() => onChangeProfileSettings(!settings.ga, 'ga')}>
								{settings.ga && <GoCheck size={width < TABLET_SIZE ? 18 : 24} color='#1ce087' />}
							</CheckBox>
						</>
					)}
				</div>
				<div
					className={`grid grid-cols-2 gap-4 md:gap-2 ${IS_VALID ? 'opacity-100' : 'opacity-50'}`}
				>
					<Text tid={'update-settings-towfactor'} />
					<CheckBox
						onClick={() => onChangeProfileSettings(!settings.onSettingsUpdate, 'onSettingsUpdate')}
						className={IS_VALID ? 'cursor-pointer' : 'cursor-not-allowed'}
					>
						{settings.onSettingsUpdate && (
							<GoCheck size={width < TABLET_SIZE ? 18 : 24} color='#1ce087' />
						)}
					</CheckBox>
					<Text tid={'deposit-towfactor'} />
					<CheckBox
						onClick={() => onChangeProfileSettings(!settings.onDeposit, 'onDeposit')}
						className={IS_VALID ? 'cursor-pointer' : 'cursor-not-allowed'}
					>
						{settings.onDeposit && <GoCheck size={width < TABLET_SIZE ? 18 : 24} color='#1ce087' />}
					</CheckBox>
					<Text tid={'withdraw-towfactor'} />
					<CheckBox
						onClick={() => onChangeProfileSettings(!settings.onWithdraw, 'onWithdraw')}
						className={IS_VALID ? 'cursor-pointer' : 'cursor-not-allowed'}
					>
						{settings.onWithdraw && (
							<GoCheck size={width < TABLET_SIZE ? 18 : 24} color='#1ce087' />
						)}
					</CheckBox>
					<Text tid={'whitelist-wallet-towfactor'} />
					<CheckBox
						onClick={() =>
							onChangeProfileSettings(!settings.onWhiteListWallet, 'onWhiteListWallet')
						}
						className={IS_VALID ? 'cursor-pointer' : 'cursor-not-allowed'}
					>
						{settings.onWhiteListWallet && (
							<GoCheck size={width < TABLET_SIZE ? 18 : 24} color='#1ce087' />
						)}
					</CheckBox>
					<Text tid={'whitelist-bank-towfactor'} />
					<CheckBox
						onClick={() =>
							onChangeProfileSettings(!settings.onWhiteListAccount, 'onWhiteListAccount')
						}
						className={IS_VALID ? 'cursor-pointer' : 'cursor-not-allowed'}
					>
						{settings.onWhiteListAccount && (
							<GoCheck size={width < TABLET_SIZE ? 18 : 24} color='#1ce087' />
						)}
					</CheckBox>
				</div>
			</div>

			<TwoFactorModal
				open={authModal}
				onSubmit={onSubmitTwoFactorModal}
				onClose={() => setAuthModal(false)}
				cause={'SETTINGS_UPDATE'}
			/>
		</CardLayout>
	)
}

const OtpTypeWrapper = styled.div`
	background-color: ${(props) => (props.active ? props.theme.active : props.theme.input)};
	padding: 4px 12px;
	border-radius: 4px;
	font-size: 0.8rem;
	color: ${(props) => (props.active ? props.theme.primaryBg : props.theme.secondary)};
	min-width: 92px;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;

	@media screen and (max-width: 480px) {
		padding: 2px 6px;
		font-size: 0.7rem;
		min-width: 72px;
	}
`

export default ProfileSettings
