import Text from '../../core/utils/Text'
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
import CustomToggler from '../common/CustomToggler'
import { ItemRow } from '../../styles/newStyles/MobileModal.styled'

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

	const { data: profile, refetch } = useProfileQuery()
	const { profileSettings } = useAuthContext()
	useEffect(() => {
		if (!!profileSettings?.settings) setSettings(profileSettings?.settings?.twoFactor)
	}, [profileSettings])

	const IS_VALID = settings.otp || settings.ga
	const onChangeProfileSettings = (v, type) => {
		// نمایش مقدار و نوع داده `v` قبل از تبدیل به بولین
		console.log(`قبل از تبدیل: ${v} (${typeof v})`)

		// اگر پارامتر `type` مربوط به `onWhiteListAccount` بود، آن را به بولین تبدیل می‌کنیم
		if (type === 'onWhiteListAccount') {
			// تبدیل مقدار به بولین با استفاده از !! که داده را به true/false تبدیل می‌کند
			v = typeof v === 'boolean' ? v : v === 'true' || v === true
		}

		// اگر پارامتر `otp` باشد، مطمئن شویم که آن را به عدد یا رشته‌ی صحیح تبدیل کنیم
		if (type === 'otp') {
			// اگر `otp` به صورت رشته ارسال شده باشد، آن را به عدد تبدیل می‌کنیم
			v = typeof v === 'string' ? parseInt(v) : v
		}

		// نمایش مقدار و نوع داده `v` بعد از تبدیل به بولین یا عدد
		console.log(`بعد از تبدیل: ${v} (${typeof v})`)

		// به‌روزرسانی وضعیت `settings` با مقدار جدید
		setSettings((state) => ({ ...state, [type]: v }))
	}

	// const onChangeProfileSettings = (v, type) => {
	// 	const needValidationTypes = [
	// 		'onDeposit',
	// 		'onWithdraw',
	// 		'onWhiteListWallet',
	// 		'onWhiteListAccount',
	// 		'onSettingsUpdate',
	// 	]
	// 	if (needValidationTypes.includes(type) && !IS_VALID) return
	// 	setSettings((state) => ({ ...state, [type]: v }))
	// }

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
		// اضافه کردن مقادیر OTP و GA به payload
		if (authData?.otp) payload.otp = authData.otp
		if (authData?.ga) payload.ga = authData.ga

		// اینجا باید درخواست POST/PUT ارسال شود
		update(payload)
		refetch()
	}

	// const onOperationClicked = (authData) => {
	// 	const payload = {
	// 		settings: {
	// 			twoFactor: settings,
	// 		},
	// 	}
	// 	if (authData?.otp) payload.otp = authData.otp
	// 	if (authData?.ga) payload.ga = authData.ga
	// 	update(payload)
	// 	refetch()
	// }

	const [authModal, setAuthModal] = useState(false)
	const onSubmitTwoFactorModal = (authData) => {
		onOperationClicked(authData)
	}

	return (
		<div>
			<ItemRow className={profile?.authenticator ? 'mb-2' : 'mb-5'}>
				<h3 className='font-semibold'>
					<Text tid='activate-otp' />
				</h3>
				<CustomToggler
					onClick={() => onChangeProfileSettings(!settings.otp, 'otp')}
					active={settings.otp}
				/>
			</ItemRow>
			<p className='opacity-60 text-xs'>
				<Text tid='otp-hint' />
			</p>
			{settings.otp ? (
				<div className='flex items-center justify-between my-2'>
					<Text tid={'otp-type'} />
					<div className={'flex items-center justify-start gap-2'}>
						{['mobile', 'email'].map((item) => {
							return (
								<OtpTypeWrapper
									className={`${item === settings.otpType ? 'bg-cBlue' : 'text-white bg-gray-400'}`}
									active={item === settings.otpType}
									key={item}
									onClick={() => onChangeProfileSettings(item, 'otpType')}
								>
									<Text tid={item} />
								</OtpTypeWrapper>
							)
						})}
					</div>
				</div>
			) : null}
			{profile?.authenticator && (
				<ItemRow className={profile?.authenticator ? 'mb-5' : ''}>
					<Text tid={'activate-ga'} />

					<CustomToggler
						onClick={() => onChangeProfileSettings(!settings.ga, 'ga')}
						active={settings.ga}
					/>
				</ItemRow>
			)}

			<div className={`${IS_VALID ? 'opacity-100' : 'opacity-50'}`}>
				<ItemRow>
					<Text tid={'update-settings-towfactor'} />

					<CustomToggler
						className={IS_VALID ? 'cursor-pointer' : 'cursor-not-allowed'}
						active={settings.onSettingsUpdate}
						onClick={() => onChangeProfileSettings(!settings.onSettingsUpdate, 'onSettingsUpdate')}
					/>
				</ItemRow>

				<ItemRow>
					<Text tid={'deposit-towfactor'} />

					<CustomToggler
						onClick={() => onChangeProfileSettings(!settings.onDeposit, 'onDeposit')}
						className={IS_VALID ? 'cursor-pointer' : 'cursor-not-allowed'}
						active={settings.onDeposit}
					/>
				</ItemRow>

				<ItemRow>
					<Text tid={'withdraw-towfactor'} />

					<CustomToggler
						onClick={() => onChangeProfileSettings(!settings.onWithdraw, 'onWithdraw')}
						className={IS_VALID ? 'cursor-pointer' : 'cursor-not-allowed'}
						active={settings.onWithdraw}
					/>
				</ItemRow>

				<ItemRow>
					<Text tid={'whitelist-wallet-towfactor'} />

					<CustomToggler
						onClick={() =>
							onChangeProfileSettings(!settings.onWhiteListWallet, 'onWhiteListWallet')
						}
						className={IS_VALID ? 'cursor-pointer' : 'cursor-not-allowed'}
						active={settings.onWhiteListWallet}
					/>
				</ItemRow>

				<ItemRow>
					<Text tid={'whitelist-bank-towfactor'} />

					<CustomToggler
						onClick={() =>
							onChangeProfileSettings(!settings.onWhiteListAccount, 'onWhiteListAccount')
						}
						className={IS_VALID ? 'cursor-pointer' : 'cursor-not-allowed'}
						active={settings.onWhiteListAccount}
					/>
				</ItemRow>
			</div>
			<div
				className={
					'mt-4 rounded-md py-2 px-4 bg-cBlue md:text-sm text-xs text-white cursor-pointer flex items-center justify-center gap-2'
				}
				onClick={onUpdateSettings}
			>
				{isLoading ? <ClipLoader color='white' size={14} /> : null}
				<Text tid={width > TABLET_SIZE ? 'update-towfactor-settings' : 'update'} />
			</div>

			<TwoFactorModal
				open={authModal}
				onSubmit={onSubmitTwoFactorModal}
				onClose={() => setAuthModal(false)}
				cause={'SETTINGS_UPDATE'}
			/>
		</div>
	)
}

const OtpTypeWrapper = styled.div`
	padding: 4px 12px;
	border-radius: 4px;
	font-size: 0.8rem;
	color: #fff;
	/* color: ${(props) => (props.active ? props.theme.primaryBg : props.theme.color)}; */
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
