import { createRef, useState } from 'react'
import {
	MeliBody,
	ImageCollector,
	MeliTitle,
	ImageGetter,
	ButtonContainer,
	NextStep,
	MeliImage,
	MeliImageContainer,
	SelfieDesc,
} from '../../styles/AuthenticationStyles'
import { useAuth } from '../../pages/UserAuthentication'
import { FlexAround } from '../../styles/CommonStyles'
import { formatSize } from '../../core/utils/common'
import Text from '../../core/utils/Text'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { TABLET_SIZE } from '../../core/constants/common'
import { RFixedButton } from '../../styles/responsive/Authentication'
import { RButton } from '../../styles/responsive/Common'
import { useQueryContext } from '../../core/contexts/query'
import SelfieGuidePic from '../../assets/images/selfie-guide.png'
import { FaFileAlt } from 'react-icons/fa'
import ModalLayout from '../layouts/ModalLayout'
import { UploadIcon } from '../common/icons'
import { useMainContext } from '../../core/contexts/main'

const GUIDE_TEXT = [
	'برای بهبود عملکرد و دسترسی‌پذیری، لطفاً اطمینان حاصل فرمائید حجم عکس انتخاب شده کمتر از 3.5 مگابایت باشد.',
	'می‌توانید از ابزارهای آنلاین فشرده‌سازی تصویر استفاده کنید.',
	'لطفاً اتصال اینترنت خود را بررسی  کرده و اطمینان حاصل نمایید تا فرآیند بارگذاری یا دانلود به‌درستی انجام شود.',
	'لطفا تا اپلود شدن تصویر منتظر مانده و از انجام فعالیت هایی  مثل کلیک کردن غیرضرروری, خارج شدن از صفحه و... جلوگیری نمایید.',
	'هنگام گرفتن عکس سلفی پوشش مناسبی داشته باشید.',
	'در صورت داشتن سوال یا نیاز به کمک بیشتر، با ما تماس بگیرید.',
]

const SelfiePhoto = ({ onSubmitClicked }) => {
	const [showModal, setShowModal] = useState(false)

	const { authData, setAuthData } = useAuth()
	const { setToast } = useQueryContext()

	const selfieRef = createRef()

	const updateSelfieCard = () => {
		if (selfieRef?.current?.files[0]?.size > 3500000) {
			setToast({ isError: true, message: 'image-size-error', show: true })
		} else {
			setAuthData({
				type: 4,
				payload: { file: selfieRef.current.files[0] },
			})
		}
	}

	const openModal = () => setShowModal(true)
	const closeModal = () => setShowModal(false)

	return (
		<>
			<div className='w-full lg:w-1/2 lg:mx-auto'>
				<div className='my-5'>
					<h2 className='mb-2'>
						<Text tid='step4' className='opacity-90' />
						{' : '}
						<Text tid='step4-heading' className='font-semibold' />
					</h2>
					<p className='text-sm text-pcolor-light dark:text-white/50'>
						<Text tid='step4-body' />
					</p>
				</div>

				<div
					className='w-[182px] h-[182px] mx-auto rounded-full relative mb-20 mt-10'
					onClick={openModal}
				>
					<GuideBox />
				</div>

				<div className='mt-5'>
					<div className='w-2/5 lg:w-1/4 mx-auto relative flex items-center justify-between border border-cBlue rounded-full px-4 py-2 cursor-pointer'>
						<UploadIcon />
						<Text tid='uploadFile' className='text-xs lg:text-sm text-cBlue cursor-pointer' />
						<ImageGetter
							className='border-cBlue cursor-pointer'
							ref={selfieRef}
							accept='image/jpeg, image/jpg'
							onChange={updateSelfieCard}
							type='file'
							id='idCard'
							name='idCard'
						/>
					</div>
				</div>
				{authData.step4.file && (
					<div className='w-full flex justify-center'>
						<MeliImageContainer>
							<div style={{ width: '100%', textAlign: 'center' }}>
								<MeliTitle>{authData.step4.file.name}</MeliTitle>
								<MeliTitle>{formatSize(authData.step4.file.size)}</MeliTitle>
							</div>
							<MeliImage src={URL.createObjectURL(authData.step4.file)} alt=' ' />
						</MeliImageContainer>
					</div>
				)}
				<ButtonContainer>
					<NextStep active={authData.step4.file} onClick={onSubmitClicked}>
						<Text tid='next-step' />
					</NextStep>
				</ButtonContainer>
			</div>
			<ModalLayout width={'580px'} onClose={closeModal} open={showModal}>
				<img src={SelfieGuidePic} alt='Widnex - Guide for Selfie' className='w-full mb-2' />
				<div className='flex justify-center items-center'>
					<button className='px-6 py-1 rounded-md text-white bg-red-500' onClick={closeModal}>
						<Text tid='close' />
					</button>
				</div>
			</ModalLayout>
		</>
	)
}

const GuideBox = () => {
	const {
		main: { theme },
	} = useMainContext()
	return (
		<div className='absolute z-10 top-0 left-0 w-full h-full cursor-pointer'>
			<svg
				width='182'
				height='182'
				viewBox='0 0 182 182'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<circle
					cx='91'
					cy='91'
					r='90'
					fill={theme === 'light' ? '#EFF3F8' : '#ffffff11'}
					stroke='#0773F1'
					stroke-dasharray='8 8'
				/>
			</svg>
			<div className='absolute top-1/2 left-1/2 transfomr -translate-x-1/2 -translate-y-1/2 flex flex-col gap-y-4 items-center'>
				<FaFileAlt size={60} className='text-pcolor-light' />
				<p className='text-xs font-semibold'>
					<Text tid='see-file' />
				</p>
			</div>
		</div>
	)
}

export default SelfiePhoto
