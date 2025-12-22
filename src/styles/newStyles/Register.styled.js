import styled from 'styled-components'

export const ErrorWrapper = styled.div`
    color: #ff6666;
`

export const Input = styled.input`
    width: 100%;
    height: 38px;
    border: 1px solid
        ${(props) =>
            (props.status === 'valid' && props.theme.mainGreen) ||
            (props.status === 'error' && props.theme.mainRed) ||
            (props.status === 'normal' && props.theme.inputBorder)};
    border-radius: 6px;

    ::placeholder {
        text-align: right;
    }
`
