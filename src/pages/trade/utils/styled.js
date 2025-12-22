import styled from "styled-components";


export const DesktopGrid = styled.div`
    width: 100%;
    display: grid;
    grid-template-areas:
        "a a a a"
        "b c c d"
        "e f f d"
        "g g g g"
    ;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
`

export const GridItem = styled.div`
    grid-area: ${props => props.area};
    height: ${props => props.h}px;
`