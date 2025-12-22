import styled from 'styled-components'

const OtcInput = ({ value, onChange, icon, label, ...rest }) => {
    return (
        <Wrapper {...rest}>
            <div className={'flex w-full h-full'}>
                {!!icon && (
                    <div
                        className={'flex items-center justify-center w-[52px]'}>
                        {icon}
                    </div>
                )}
                <TInput value={value} onChange={onChange} placeholder={label} />
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: ${(props) => props.width || '100%'};
    height: ${(props) => props.height || '42px'};
    border: 1px solid ${(props) => props.theme.color}40;
    border-radius: 8px;

    &:hover {
        border: 1px solid ${(props) => props.theme.activeHover}80;
    }
`

const TInput = styled.input`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 1rem;
    color: ${(props) => props.theme.primary};
`

export default OtcInput
