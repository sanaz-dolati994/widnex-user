import { useState, useEffect } from 'react'
import { FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { TABLET_SIZE } from '../core/constants/common'
import { useMainContext } from '../core/contexts/main'
import { useWindowSize } from '../core/hooks/useWindowSize'
import CardLayout from './layouts/CardLayout'
import {
    useGetUserStar,
    useProfileQuery,
} from '../core/services/react-query/useProfileQuery'
import {
    AuthBtn,
    Title,
    ProfileItem,
    ProfileBody,
} from '../styles/ProfileStyles'
import Text from '../core/utils/Text'

const ProfileCard = () => {
    const { data: profile } = useProfileQuery()
    const {
        main: { lang },
    } = useMainContext()

    const [details, setDetails] = useState([])

    const { data: userStar } = useGetUserStar()

    useEffect(() => {
        if (profile) {
            const newDetails = [
                { first: 'username', second: profile?.firstName },
                { first: 'email', second: profile?.email },
                { first: 'mobileNumber', second: profile?.mobile },
                { first: 'authState', second: <Text tid={profile?.status} /> },
            ]
            setDetails(newDetails)
        }
    }, [profile])

    const navigate = useNavigate()
    const goToAuth = () => {
        navigate('/authentication')
    }

    const onMoreClicked = () => {
        navigate('/profile')
    }

    return (
        <CardLayout
            width={'100%'}
            // height={width > TABLET_SIZE ? '350px' : '300px'}
            title='profile'
            icon={
                lang === 'en' ? (
                    <FaArrowCircleRight
                        onClick={onMoreClicked}
                        style={{ cursor: 'pointer' }}
                        size={24}
                        color='#4f31c5'
                    />
                ) : (
                    <FaArrowCircleLeft
                        onClick={onMoreClicked}
                        style={{ cursor: 'pointer' }}
                        size={24}
                        color='#4f31c5'
                    />
                )
            }>
            {profile && (
                <ProfileBody>
                    {details.map((item, idx) => (
                        <ProfileItem>
                            <Title>
                                <Text tid={item.first} />
                            </Title>
                            <Title
                                number={idx === 2}
                                color={
                                    idx === 3 &&
                                    (profile.status === 'VERIFIED'
                                        ? '#1ce087'
                                        : profile.status === 'PROCESSING'
                                        ? '#4f31c5'
                                        : '#e9106c')
                                }>
                                {item.second}
                            </Title>
                        </ProfileItem>
                    ))}
                    {userStar && (
                        <ProfileItem>
                            <Title>
                                <Text tid={'user-level'} />
                            </Title>
                            <Title>
                                <Text className='mx-1' tid='level' />
                                {'  '} {userStar?.user?.stars?.stars + 1}
                            </Title>
                        </ProfileItem>
                    )}

                    {profile?.status === 'pending' && (
                        <AuthBtn onClick={goToAuth}>
                            <Text tid='finishAuth' />
                        </AuthBtn>
                    )}
                </ProfileBody>
            )}
        </CardLayout>
    )
}

export default ProfileCard
