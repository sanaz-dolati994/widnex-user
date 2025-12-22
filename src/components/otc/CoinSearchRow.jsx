import styled from 'styled-components'
import { useMainContext } from '../../core/contexts/main'
import { SOCKET_URL } from '../../core/constants/urls'
import Text from '../../core/utils/Text'
import { formatNumber } from '../../core/utils/common'
import { DText, Flex } from '../../styles/CommonStyles'

const CoinSearchRow = ({ coin, type, ...rest }) => {
    const {
        main: { lang },
    } = useMainContext()
    const HAS_BADGE = coin.name === 'Gold' || coin.name === 'Dollar'

    return (
        <Wrapper>
            <Body {...rest}>
                <div className={'grid grid-cols-2 w-full h-full'}>
                    <div className={'flex items-center h-full w-full'}>
                        <img
                            src={SOCKET_URL + `assets/icon/${coin.id}.png`}
                            width={40}
                            height={40}
                            style={{ margin: '0 6px' }}
                            alt={coin.id}
                        />
                        <div align={'flex-start'}>
                            <DText primary>
                                {lang === 'fa' ? coin.fa : coin.name}
                            </DText>
                            {/* <DText main>
                                {`${coin.id.toUpperCase()} ${coin.name}`}
                            </DText> */}
                        </div>
                    </div>
                    <div
                        className={
                            'flex flex-col gap-2 justify-center h-full w-full'
                        }>
                        <DText main>
                            <Text tid={`${type}-price`} />
                        </DText>
                        <DText primary>
                            {formatNumber(coin[type], { type: 'irt' })}
                        </DText>
                    </div>
                    <Flex fw>
                        {HAS_BADGE && (
                            <img
                                src={'/assets/images/logo/badge.png'}
                                width={32}
                                height={32}
                                alt={'badge'}
                            />
                        )}
                    </Flex>
                </div>
            </Body>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    border-bottom: 1px solid ${(props) => props.theme.color}20;
    padding: 8px;
`

const Body = styled.div`
    width: 100%;
    height: 72px;
    padding: 8px;
    background-color: ${(props) =>
        props.active ? `${props.theme.color}20` : 'transparent'};
    border-radius: 8px;
    cursor: pointer;

    &:hover {
        background-color: ${(props) => props.theme.color}20;
    }
`

export default CoinSearchRow
