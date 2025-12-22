import {Fragment, useState} from "react";
import styled from "styled-components"
import { css } from "styled-components";


const Slider = ({ val, onSliderChange, disabled }) => {

    const [showTooltip, setShowTooltip] = useState(false)

    const onValueChange = (e) => {
        onSliderChange(e?.target?.value)
    }


    return (
        <Wrapper onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            <Input
                type="range"
                min="0"
                max="100"
                steps="1"
                defaultValue={0}
                onInput={onValueChange}
                val={val}
                value={val}
                disabled={disabled}
            />
            {pcs.map(pc => (
                <Fragment key={pc}>
                    <Pc pc={pc} onClick={() => onSliderChange(pc)} />
                    <PcDesc pc={pc}>{pc}%</PcDesc>
                </Fragment>
            ))}
            <Tooltip val={val} hide={!showTooltip}>
                {val}%
            </Tooltip>
        </Wrapper>
    )
}

const pcs = [
    25, 50, 75, 100
]

const Wrapper = styled.div`
    height: 4px;
    width: 100%;
    position: relative;
`

const Tooltip = styled.div`
    width: 40px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${props => props.theme.color};
    font-size: 0.8rem;
    position: absolute;
    background-color: #5e6673;
    border-radius: 6px;
    top: -30px;
    left: ${props => props.val < 10 ? props.val : props.val - 8}%;

    ${props => props.hide && css`
        display: none;
    `}
`


const handlePcPosition = (pc) => {
    if (pc === 25) return "75%"
    if (pc === 50) return "50%"
    if (pc === 75) return "25%"
    return 0
}


const Pc = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 4px;
    transform: rotate(45deg);
    background-color: ${props => props.theme.primary};
    position: absolute;
    top: 10px; 
    right: ${({ pc }) => handlePcPosition(pc)};
    cursor: pointer;
    z-index: 1;
`

const PcDesc = styled.div`
    position: absolute;
    right: ${({ pc }) => handlePcPosition(pc)};
    color: ${props => props.theme.color}90;
    font-size: 0.55rem;
`


const Input = styled.input`
    -webkit-appearance: none;
    width: 100%;
    height: 100%;
    background: ${props => props.theme.input};
    border-radius: 5px;
    outline: none;
    border: none;
    direction: ltr;
    position: relative;

    &::after{
        content: " ";
        position: absolute;
        height: 4px;
        left: 0;
        top: 0;
        width: calc(${props => props.val}% - ${props => props.val > 50 ? "14px" : "6px"});
        background-color: ${props => props.theme.secondary};
        border-radius: 3px;
    }

    &::-webkit-slider-thumb{
        -webkit-appearance: none;
        height: 1.1rem;
        width: 1.1rem;
        transform: rotate(45deg);
        background-color: ${props => props.theme.tradeBg};
        border: 5px solid ${props => props.theme.color};
        border-radius: 3px;
        cursor: pointer;
        z-index: 2;
        position: relative;
       
        @media screen and (max-width: 480px) {
          height: 0.9rem;
          width: 0.9rem;
          border: 4px solid ${props => props.theme.color};
        }
    }



`


export default Slider;
