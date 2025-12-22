import { TbInfoHexagonFilled } from 'react-icons/tb'
import Text from '../../core/utils/Text'

export default function HintBox({
    type = 'hint',
    heading = 'hint',
    body,
    className = '',
}) {
    return (
        <div
            className={`${
                type === 'warn'
                    ? 'bg-warnBg dark:bg-warnBg-dark'
                    : 'bg-gray-light dark:bg-hintBg-dark'
            } ${className} rounded-xl p-4 flex flex-col gap-y-2`}>
            <h5
                className={`${
                    type === 'warn' ? 'text-warn' : 'text-cBlue'
                } flex items-center gap-x-2 text-sm`}>
                <TbInfoHexagonFilled size={20} />
                <Text tid={heading} />:
            </h5>
            <p className='text-sm'>
                <Text tid={body} />
            </p>
        </div>
    )
}
