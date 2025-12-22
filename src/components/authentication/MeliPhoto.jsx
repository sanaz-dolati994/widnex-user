import { createRef } from 'react'
import {
	MeliBody,
	ImageCollector,
	MeliTitle,
	ImageGetter,
	ButtonContainer,
	NextStep,
	MeliImage,
	MeliImageContainer,
} from '../../styles/AuthenticationStyles'
import { useAuth } from '../../pages/UserAuthentication'
import { formatSize } from '../../core/utils/common'
import AuthLoading from './AuthLoading'
import Text from '../../core/utils/Text'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { useQueryContext } from '../../core/contexts/query'
import { PersonalCardIcon } from '../common/icons'

const GUIDE_TEXT = [
	'برای بهبود عملکرد و دسترسی‌پذیری، لطفاً اطمینان حاصل فرمائید حجم عکس انتخاب شده کمتر از 3.5 مگابایت باشد.',
	'می‌توانید از ابزارهای آنلاین فشرده‌سازی تصویر استفاده کنید.',
	'لطفاً اتصال اینترنت خود را بررسی  کرده و اطمینان حاصل نمایید تا فرآیند بارگذاری یا دانلود به‌درستی انجام شود.',
	'لطفا تا اپلود شدن تصویر منتظر مانده و از انجام فعالیت هایی  مثل کلیک کردن غیرضرروری, خارج شدن از صفحه و... جلوگیری نمایید.',
	'در صورت داشتن سوال یا نیاز به کمک بیشتر، با ما تماس بگیرید.',
]

const MeliPhoto = ({ onSubmitClicked }) => {
	const { setToast } = useQueryContext()
	const { authData, setAuthData } = useAuth()
	const { width } = useWindowSize()

	const meliRef = createRef()

	const updateMeliCard = () => {
		if (meliRef?.current?.files[0]?.size > 3500000) {
			setToast({ isError: true, message: 'image-size-error', show: true })
		} else {
			setAuthData({
				type: 3,
				payload: { file: meliRef.current.files[0] },
			})
		}
	}

	return (
		<div className='w-full lg:w-1/2 lg:mx-auto'>
			<div className='my-5'>
				<h2>
					<Text tid='step3' className='opacity-90' />
					{' : '}
					<Text tid='step3-heading' className='font-semibold' />
				</h2>
			</div>
			<MeliBody>
				<ImageCollector className='bg-gray-light dark:bg-white/5 border dark:border-dashed dark:border-card-border border-light-border w-3/4 lg:w-1/2'>
					<PersonalCardIcon color='#0773F1' size={60} />
					<MeliTitle fontSize='15px' color='#0773F1' className='font-semibold'>
						{'+ '}
						<Text tid='uploadFile' />
					</MeliTitle>
					<MeliTitle fontSize='12px' color='#0773F1'>
						<Text tid='fileExtension' />
					</MeliTitle>
					<ImageGetter
						ref={meliRef}
						accept='image/jpeg, image/jpg'
						onChange={updateMeliCard}
						type='file'
						id='idCard'
						name='idCard'
					/>
				</ImageCollector>
				{authData.step3.file && (
					<MeliImageContainer>
						<div style={{ width: '100%', textAlign: 'center' }}>
							<MeliTitle>{authData.step3.file.name}</MeliTitle>
							<MeliTitle>{formatSize(authData.step3.file.size)}</MeliTitle>
						</div>
						<MeliImage src={URL.createObjectURL(authData.step3.file)} alt=' ' />
					</MeliImageContainer>
				)}
				<div className='px-5 mt-8'>
					<ol className='list-decimal'>
						{GUIDE_TEXT.map((guide) => {
							return <li className='text-xs mb-2 last:mb-0'>{guide}</li>
						})}
					</ol>
				</div>

				<ButtonContainer className=''>
					<NextStep active={authData.step3.file} onClick={onSubmitClicked}>
						<Text tid='next-step' />
					</NextStep>
				</ButtonContainer>
			</MeliBody>
		</div>
	)
}

export default MeliPhoto
