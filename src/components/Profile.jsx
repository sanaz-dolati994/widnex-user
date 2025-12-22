import { useEffect, useState, useRef } from 'react'
import CardLayout from './layouts/CardLayout'
import {
	useDeleteProfileAvatar,
	useGetUserStar,
	useProfileQuery,
	useUpdateProfileAvatar,
} from '../core/services/react-query/useProfileQuery'
import {
	ImageGetter,
	PersonalBox,
	PersonalContent,
	PersonalTitle,
} from '../styles/AuthenticationStyles'
import { FlexCenter, Flex, LoaderContainer } from '../styles/CommonStyles'
import { Image } from '../styles/layout-styles/HeaderStyles'
import {
	ProfileImageWrapper,
	ProfileButton,
	ProfileLabel,
	ProfileBadge,
	NoAvatarWrapper,
} from '../styles/ProfileStyles'
import Text from '../core/utils/Text'
import { FaSquare } from 'react-icons/fa'
import { BeatLoader } from 'react-spinners'
import { useQueryContext } from '../core/contexts/query'
import { TABLET_SIZE } from '../core/constants/common'
import { useWindowSize } from '../core/hooks/useWindowSize'
import { FaCopy } from "react-icons/fa";



const Profile = () => {
	const { width } = useWindowSize()
	const { data: profile, isFetching } = useProfileQuery()
	const { mutate: updateAvatar, isLoading: updating } = useUpdateProfileAvatar()
	const { mutate: deleteAvatar, isLoading: deleting } = useDeleteProfileAvatar()
	const { setToast } = useQueryContext()
	const { data: userStar } = useGetUserStar()

	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (updating || deleting) {
			setLoading(true)
		} else {
			if (isFetching) {
				setLoading(true)
			} else {
				setLoading(false)
			}
		}
		//eslint-disable-next-line
	}, [isFetching, updating, deleting])

	const avatarRef = useRef()

	const onUpdateAvatarClicked = () => {
		if (avatarRef?.current?.files[0]?.size > 3500000) {
			setToast({
				isError: true,
				show: true,
				message: 'image-error',
			})
		} else {
			const files = new FormData()
			files.append('avatar', avatarRef?.current?.files[0])
			updateAvatar(files)
		}
	}

	const copyProfileId = () => {
		navigator.clipboard.writeText(profile._id);
	}


	return (
		<CardLayout width='100%' height='100%'>
			<FlexCenter style={{ width: '100%' }}>
				<ProfileImageWrapper>
					{!loading &&
						(profile?.avatar ? (
							<Image src={profile?.avatar} alt=' ' size={width < TABLET_SIZE ? '110px' : '160px'} />
						) : (
							<NoAvatarWrapper>
								{profile?.firstName ? profile?.firstName.substr(0, 1).toUpperCase() : ''}
							</NoAvatarWrapper>
						))}
					{loading && (
						<LoaderContainer>
							<BeatLoader color='#4f31c5' size={22} />
						</LoaderContainer>
					)}
				</ProfileImageWrapper>
			</FlexCenter>
			<FlexCenter style={{ margin: '20px 0' }}>
				<ProfileButton>
					<Text tid='change-avatar' />
					<ImageGetter
						width={'135px'}
						height={'42px'}
						ref={avatarRef}
						accept='image/jpeg, image/jpg'
						onChange={onUpdateAvatarClicked}
						type='file'
						id='idCard'
						name='idCard'
					/>
				</ProfileButton>
				<ProfileButton onClick={() => deleteAvatar()}>
					<Text tid='delete-avatar' />
				</ProfileButton>
			</FlexCenter>

			<FlexCenter style={{ margin: '20px 0' }}>
				<FaSquare style={{ transform: 'rotate(45deg)' }} size={18} color='#4f31c5' />
				<ProfileLabel>
					<Text tid='profile-desc' />
				</ProfileLabel>
			</FlexCenter>

			<PersonalBox className={'gap-5'}>
				<PersonalTitle>
					<Text tid='user-info' />
				</PersonalTitle>
				<PersonalContent>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='user-id' />
						</ProfileLabel>
						<ProfileBadge>
							<div className={'flex items-center gap-2'}>
								<span className={'text-sm'}>
									{profile?._id}
								</span>
								<div onClick={copyProfileId} className={'cursor-pointer'}>
									<FaCopy size={18} />
								</div>
							</div>
						</ProfileBadge>
					</Flex>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='firstName' />
						</ProfileLabel>
						<ProfileBadge>{profile?.firstName}</ProfileBadge>
					</Flex>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='lastName' />
						</ProfileLabel>
						<ProfileBadge>{profile?.lastName}</ProfileBadge>
					</Flex>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='user-level' />
						</ProfileLabel>
						<ProfileBadge>
							<Text className='mx-1' tid='level' />
							{'  '} {userStar?.user?.stars?.stars + 1}
						</ProfileBadge>
					</Flex>
				</PersonalContent>
			</PersonalBox>

			<PersonalBox className={'gap-5'}>
				<PersonalTitle>
					<Text tid='identity-info' />
				</PersonalTitle>
				<PersonalContent>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='birthDate' />
						</ProfileLabel>
						<ProfileBadge number>{profile?.birthDate}</ProfileBadge>
					</Flex>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='idNo' />
						</ProfileLabel>
						<ProfileBadge number>{profile?.idNo}</ProfileBadge>
					</Flex>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='gender' />
						</ProfileLabel>
						<ProfileBadge>
							<Text tid={profile?.gender} />
						</ProfileBadge>
					</Flex>
				</PersonalContent>
			</PersonalBox>

			<PersonalBox className={'gap-5'}>
				<PersonalTitle>
					<Text tid='address' />
				</PersonalTitle>
				<PersonalContent>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='state' />
						</ProfileLabel>
						<ProfileBadge>{profile?.address?.county}</ProfileBadge>
					</Flex>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='city' />
						</ProfileLabel>
						<ProfileBadge>{profile?.address?.city}</ProfileBadge>
					</Flex>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='address' />
						</ProfileLabel>
						<ProfileBadge>
							<Text tid={profile?.address?.line} />
						</ProfileBadge>
					</Flex>
				</PersonalContent>
			</PersonalBox>

			<PersonalBox noBorder={true} className={'gap-5'}>
				<PersonalTitle>
					<Text tid='call-info' />
				</PersonalTitle>
				<PersonalContent>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='phone' />
						</ProfileLabel>
						<ProfileBadge number>{profile?.phone}</ProfileBadge>
					</Flex>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='mobile' />
						</ProfileLabel>
						<ProfileBadge number>{profile?.mobile}</ProfileBadge>
					</Flex>
					<Flex align={'center'} flexDirection={'col'}>
						<ProfileLabel>
							<Text tid='email' />
						</ProfileLabel>
						<ProfileBadge>
							<Text tid={profile?.email} />
						</ProfileBadge>
					</Flex>
				</PersonalContent>
			</PersonalBox>
		</CardLayout>
	)
}

export default Profile
