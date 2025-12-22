
import styled from 'styled-components'

export const ProfileItem = styled.div`
	display: flex;
	row-gap: 5px;
    border: 1px solid ${(props) => props.theme.inputBorder};
    background-color: ${(props) => props.theme.fieldBg};
    border-radius: 8px;
    height: 44px;
    padding: 1rem 1rem;
    align-items: center;
    justify-content: space-between;
`