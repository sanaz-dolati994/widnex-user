import { DText } from '../../styles/CommonStyles'
import Text from '../../core/utils/Text'

const ToomanRow = ({ className = '' }) => {
    return (
        <div className={`flex items-center gap-1 ${className} `}>
            {/* <img
                src={require('../../assets/images/tooman.png')}
                width={30}
                height={30}
                alt={'tooman'}
            /> */}
            <DText main margin={'0 8px'}>
                <Text tid={'tooman'} />
            </DText>
        </div>
    )
}

export default ToomanRow
