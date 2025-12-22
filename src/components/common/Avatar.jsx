import { BeatLoader } from 'react-spinners'
import { AvatarWrapper } from '../../styles/newStyles/Header.styled'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../../core/constants/common'
import { Image } from '../../styles/layout-styles/HeaderStyles'

export default function Avatar({ profile, loading }) {
    const { width } = useWindowSize()
    return (
        <>
            {loading ? (
                <BeatLoader color='#0773f1' size={5} />
            ) : (
                <AvatarWrapper className='bg-gray-light dark:bg-heading dark:border-transparent'>
                    {profile?.avatar ? (
                        <Image
                            src={profile?.avatar}
                            alt='avatar'
                            size={width < TABLET_SIZE ? '20px' : '50px'}
                        />
                    ) : (
                        <p className='text-cBlue dark:text-white'>
                            {profile?.firstName
                                ? profile?.firstName.substr(0, 1).toUpperCase()
                                : 'U'}
                        </p>
                    )}
                </AvatarWrapper>
            )}
        </>
    )
}
