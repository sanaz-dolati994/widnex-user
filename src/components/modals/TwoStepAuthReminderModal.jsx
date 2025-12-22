import { useEffect, useState } from 'react'
import ReminderModalBase from './ReminderModalBase'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'
import { Link } from 'react-router-dom'

export default function TwoStepAuthReminderModal() {
    const { data: profile, isFetching } = useProfileQuery()
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (!isFetching && !!profile && !profile.authenticator) {
            setShowModal(true)
        }
    }, [profile, isFetching])

    const closeModal = () => setShowModal(false)

    if (!showModal) return null

    return (
        <ReminderModalBase onClose={closeModal} className='!fixed h-full'>
            <h3 className='text-lg md:text-xl text-center mb-2'>
                احراز هویت دو مرحله‌ای (2FA)
            </h3>

            <p>
                برای افزایش امنیت حساب کاربری شما، صرافی ما از سیستم احراز هویت
                دو مرحله‌ای (2FA) استفاده می‌کند. این سیستم باعث می‌شود که حتی
                در صورت دسترسی غیرمجاز به رمز عبور شما، فرد مهاجم نتواند به حساب
                کاربری شما وارد شود. ما توصیه می‌کنیم که به محض ورود اولیه به
                حساب کاربری خود، احراز هویت دو مرحله‌ای را فعال کنید.
            </p>

            <h4 className='font-bold'>روش‌های احراز هویت دو مرحله‌ای</h4>
            <h5 className='font-bold'>کد پیامکی (SMS):</h5>
            <p>
                هنگام ورود به حساب کاربری، یک کد احراز هویت به شماره موبایل ثبت
                شده شما ارسال می‌شود که باید آن را در صفحه ورود وارد کنید.
            </p>
            <h5 className='font-bold underline underline-offset-2 text-indigo-500'>
                <Link to={'/security'}>اپلیکیشن‌ احراز هویت:</Link>
            </h5>
            <p>
                علاوه بر کد پیامکی، شما می‌توانید از اپلیکیشن‌ احراز هویت Google
                Authenticator استفاده کنید. این اپلیکیشن‌ به شما امکان می‌دهند
                تا کدهای موقتی و ایمن برای ورود به حساب کاربری خود دریافت کنید.
            </p>
            <p>
                پس از ورود اولیه به حساب کاربری، به بخش تنظیمات امنیتی بروید و
                احراز هویت دو مرحله‌ای را فعال کنید. دستورالعمل‌های لازم برای
                تنظیم و استفاده از اپلیکیشن احراز هویت در این بخش توضیح داده شده
                است.
            </p>

            <h4 className='font-bold'>
                مزایای استفاده از احراز هویت دو مرحله‌ای
            </h4>

            <ol className='list-decimal mr-5 md:mr-8 text-xs md:text-sm'>
                <li>
                    افزایش امنیت: با فعال‌سازی 2FA، حتی اگر رمز عبور شما فاش
                    شود، فرد مهاجم بدون دسترسی به کد احراز هویت نمی‌تواند وارد
                    حساب شما شود.
                </li>
                <li>
                    حفاظت از دارایی‌ها: احراز هویت دو مرحله‌ای مانع از دسترسی
                    غیرمجاز به کیف پول‌ها و دارایی‌های دیجیتال شما می‌شود.
                </li>
                <li>
                    اعتماد بیشتر: استفاده از 2FA به شما و دیگر کاربران اطمینان
                    می‌دهد که حساب‌های کاربری شما در برابر حملات سایبری محافظت
                    شده است.
                </li>
            </ol>

            <h4 className='font-bold'>نکات مهم</h4>

            <ul className='list-disc mr-5 md:mr-8 text-xs md:text-sm'>
                <li>
                    فعال‌سازی اجباری 2FA: برای کاربران با موجودی بالاتر از یک حد
                    مشخص، فعال‌سازی 2FA الزامی است.
                </li>
                <li>
                    پشتیبانی از چندین دستگاه: شما می‌توانید اپلیکیشن احراز هویت
                    را بر روی چندین دستگاه نصب کنید تا در صورت از دست دادن یکی
                    از دستگاه‌ها، به حساب کاربری خود دسترسی داشته باشید.
                </li>
                <li>
                    ما به امنیت حساب‌های کاربری شما اهمیت می‌دهیم و همواره در
                    تلاش هستیم تا بهترین و ایمن‌ترین خدمات را به شما ارائه دهیم.
                    لطفاً احراز هویت دو مرحله‌ای را فعال کنید تا از حساب کاربری
                    و دارایی‌های خود به بهترین نحو ممکن محافظت کنید.
                </li>
            </ul>
        </ReminderModalBase>
    )
}
