import styled from 'styled-components'

const Header = styled.header`
    height: 70px;

    position: sticky;
    margin-block: 1rem;
    top: 0;
    left: 1rem;
    z-index: 100;

    width: ${({ className }) =>
        className.includes('expanded')
            ? 'calc(100% - 320px - 3rem)'
            : 'calc(100% - 96px - 3rem)'};
    margin-inline-start: auto;
    border-radius: 12px;
    padding: 1rem;
    transition: width 0.3s ease;

    display: flex;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: 768px) {
        width: 100%;
        top: 0;
        left: 0;
        margin-block: 0;
        border-bottom: 1px solid ${(props) => props.theme.horizontalLine};
        border-radius: 0;
    }
`

const AvatarWrapper = styled.div`
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid white;
`
const VerticalLine = styled.div`
    height: ${(props) => props.height || '20px'};
    width: 2px;
    border-radius: 8px;
`

export { Header, AvatarWrapper, VerticalLine }
