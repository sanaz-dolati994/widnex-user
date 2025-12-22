import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'
import ReminderModalBase from './ReminderModalBase'

export default function AuthReminderModal() {
    const { data: profile, isLoading } = useProfileQuery()
    const [showModal, setShowModal] = useState(
        isLoading || profile.status === 'VERIFIED' ? false : true
    )

    const closeModal = () => setShowModal(false)

    if (!showModal) return null

    return (
        <ReminderModalBase
            onClose={closeModal}
            className='h-screen sm:h-full md:h-screen'>
            <h3 className='text-lg md:text-xl text-center mb-4'>
                لطفا توجه فرمائید:
            </h3>
            <p className=''>
                برای افزایش امنیت حساب کاربری و انجام تراکنش‌های خود در صرافی
                ویدنکس، لطفاً مراحل احراز هویت خود را تکمیل کنید. این فرآیند
                ضروری است تا ما بتوانیم امنیت حساب شما را تضمین کرده و از هرگونه
                فعالیت مشکوک جلوگیری کنیم.
            </p>

            <h4 className='font-bold'>مراحل احراز هویت:</h4>

            <ol className='list-decimal mr-8 text-xs md:text-sm'>
                <li> وارد حساب کاربری خود شوید.</li>
                <li>از پنل کاربری وارد احراز هویت شوید.</li>
                <li>اطلاعات شخصی خود را به‌طور کامل و صحیح وارد کنید.</li>
                <li>مدارک شناسایی خواسته شده را بارگذاری کنید.</li>
                <li> منتظر بررسی و تایید نهایی مدارک توسط تیم ما باشید.</li>
            </ol>

            <p className=''>
                با تکمیل این مراحل، امنیت حساب شما به‌طور قابل توجهی افزایش
                می‌یابد و می‌توانید با اطمینان خاطر به انجام معاملات خود
                بپردازید.
            </p>

            <p className=''>
                اگر سوالی دارید یا نیاز به کمک دارید، تیم پشتیبانی ما آماده
                پاسخگویی به شما است.
            </p>

            <p className='font-bold'>با تشکر از همکاری شما</p>

            <div className='flex justify-center mt-4 sm:mt-0'>
                <Link
                    className='px-4 py-2 rounded-md bg-primaryBg dark:bg-transparent text-white border dark:border-white hover:bg-opacity-95 dark:hover:bg-white dark:hover:text-primaryBg transition-colors'
                    to={`/authentication`}>
                    برو به احراز هویت
                </Link>
            </div>
        </ReminderModalBase>
    )
}
