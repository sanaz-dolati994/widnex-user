import HintBox from '../../../../components/common/HintBox'
import { useTranslation } from 'react-i18next';

const Hints = () => {
    const { t } = useTranslation();
    return (
        <div className='w-full flex flex-col gap-2'>
            <HintBox type='info' heading={t('hint')}
                body={t('offline-deposit-hint-1')}
            />
            <HintBox type='warn' heading={t('warn')}
                body={t('offline-deposit-warn-1')}
            />

            <HintBox type='warn' heading={t('warn')}
                body={t('offline-deposit-warn-2')}
            />
        </div>
    )
}

export default Hints