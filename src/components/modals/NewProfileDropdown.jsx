import { forwardRef } from 'react'
import styled from 'styled-components'
import Card from '../common/Card'
import { FaChevronLeft } from 'react-icons/fa'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'
import Text from '../../core/utils/Text'
import { SecurityIcon, VerifyIcon } from '../common/icons'
import { IoIosExit } from 'react-icons/io'
import { useAuthContext } from '../../core/contexts/auth'
import {
	HorizontalLine,
	ItemData,
	ItemRow,
	LinkItemRow,
} from '../../styles/newStyles/MobileModal.styled'
import { useMainContext } from '../../core/contexts/main'
import { ScaleLoader } from 'react-spinners'

export const ProfileDropdown = forwardRef((props, ref) => {
	const {
		main: { theme },
	} = useMainContext()
	const { data: profile, isFetching: profileLoading } = useProfileQuery()
	const { logout } = useAuthContext()

	return (
		<Wrapper ref={ref}>
			<Card
				className='rounded-xl shadow-sm shadow-black/50 dark:shadow-white/50 flex flex-col gap-y-2 border text-sm'
				padding='p-4'
			>
				{profileLoading ? (
					<div className='flex items-center justify-center'>
						<ScaleLoader color='#0773F1' height='18px' width='2px' />
					</div>
				) : (
					<>
						<LinkItemRow
							to='/profile'
							onClick={props.onClose}
							className='hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition px-2'
						>
							<ItemData>
								<Text tid='profile' />
							</ItemData>
							<FaChevronLeft />
						</LinkItemRow>
						<HorizontalLine />

						<ItemRow className='px-2'>
							<ItemData>
								<VerifyIcon color={theme === 'dark' && '#d9d9d9'} />
								<Text tid='authentication' />
							</ItemData>
							<Text
								tid={profile?.status}
								className={`${statusColors[profile?.status] || ''} px-4 py-1 rounded-lg`}
							/>
						</ItemRow>
						<LinkItemRow
							to='/profile/security'
							onClick={props.onClose}
							className='hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition px-2'
						>
							<ItemData>
								<SecurityIcon color={theme === 'dark' && '#d9d9d9'} />
								<Text tid='security-settings' />
							</ItemData>
							<FaChevronLeft />
						</LinkItemRow>
						<HorizontalLine />

						<button className='text-red-500 flex items-center gap-x-2 py-1 px-2' onClick={logout}>
							<IoIosExit size={24} />
							<Text tid='logout' />
						</button>
					</>
				)}
			</Card>
		</Wrapper>
	)
})

const Wrapper = styled.div`
	position: absolute;
	z-index: 103;
	top: calc(100% + 1rem);
	left: 50%;
	width: 300px;

	@media screen and (max-width: 1024px) {
		left: 1rem;
	}
`

const statusColors = {
	CREATED: 'text-blue-500 bg-blue-500/10',
	PENDING: 'text-orange-500 bg-orange-500/10',
	VERIFIED: 'text-green-500 bg-green-500/10',
	REJECTED: 'text-red-500 bg-red-500/10',
}
