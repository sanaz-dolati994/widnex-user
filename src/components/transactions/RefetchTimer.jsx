import React, { useEffect, useState } from 'react'
import Text from '../../core/utils/Text';

const RefetchTimer = ({ onTimeout = () => { } }) => {
    const [time, setTime] = useState(60);

    useEffect(() => {
        let timer = setInterval(() => {
            setTime((time) => {
                if (time === 0) {
                    onTimeout()
                    setTime(60)
                    return 0;
                } else return time - 1;
            });
        }, 1000);

        return () => clearInterval(timer)

    }, []);

    return (
        <div className='flex items-center gap-2'>
            <Text tid={'update-transaction-till'} className='text-sm md:text-base' />
            <span className='flex items-center justify-center p-1 w-8 h-8 border rounded-lg text-sm'>
                {`${time % 60}`.padStart(2, 0)}
            </span>
            :
            <span className='flex items-center justify-center p-1 w-8 h-8 border rounded-lg text-sm'>
                {`${Math.floor(time / 60)}`.padStart(2, 0)}
            </span>
        </div>
    )
}

export default RefetchTimer