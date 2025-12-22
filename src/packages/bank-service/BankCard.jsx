import { CgChevronDown } from 'react-icons/cg'
import styled, { css } from 'styled-components'

const BankCard = (props) => {
    // const { bankInfo, bankAccount } = props

    const { bankInfo, bankAccount } = props

    let cardNo = bankAccount.cardNo

    cardNo =
        cardNo.substring(12, 16) +
        ' ' +
        cardNo.substring(8, 12) +
        ' ' +
        cardNo.substring(4, 8) +
        ' ' +
        cardNo.substring(0, 4)

    if (!!props.new) {
        return (
            <div
                className='flex items-center justify-between border border-gray-200 w-full cursor-pointer rounded-lg px-5'
                {...props}>
                <img
                    src={require(`./banks/${bankInfo.logo}.svg`)}
                    alt=' '
                    className='w-12 h-12'
                />
                <p className='text-sm'>{cardNo}</p>
                <CgChevronDown />
            </div>
        )
    }

    return (
        <CardWrapper {...props}>
            <TopSection>
                <Img src={require(`./banks/${bankInfo.logo}.svg`)} alt=' ' />
            </TopSection>
            <BottomSecion color={bankInfo.color} primary={bankInfo.primary}>
                <CardText number>{bankAccount.shebaNo}</CardText>
                <CardText number>{cardNo}</CardText>
                <CardText color={bankInfo.color} label>
                    {bankAccount.label}
                </CardText>
            </BottomSecion>
        </CardWrapper>
    )
}

const CardWrapper = styled.div`
    border-radius: 8px 8px 12px 12px;
    background-image: linear-gradient(130deg, #fff -7%, #808080 85%);
    width: 300px;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    cursor: pointer;
    ${(props) =>
        !props.newBank &&
        css`
            box-shadow: 20px 15px 0 0 rgb(0 0 0 / 10%);
        `};
`

const TopSection = styled.div`
    display: flex;
    height: 75px;
    justify-content: center;
    align-items: center;
    width: 100%;
`

const BottomSecion = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    background-image: linear-gradient(
        90deg,
        ${(props) => props.color} 0%,
        ${(props) => props.primary} 75%
    );
    height: 75px;
    width: 100%;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
`

const Img = styled.img`
    height: 75px !important;
`

const CardText = styled.div`
    font-size: 0.9rem;
    color: #f5f6ed;

    ${(props) =>
        props.number &&
        css`
            // font-family: monospace;
        `};

    ${(props) =>
        props.label &&
        css`
            background-color: #ffffff90;
            color: ${(props) => props.color};
            font-size: 0.8rem;
            width: 80%;
            text-align: center;
            padding: 2px 0;
            border-radius: 2px;
        `};
`

export default BankCard
