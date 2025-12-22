import styled, {css, keyframes} from "styled-components";
import {motion} from "framer-motion";
import {IoIosClose} from 'react-icons/io'
import { HiInformationCircle, HiQuestionMarkCircle, HiChevronDoubleLeft } from 'react-icons/hi'
import { FaHandPointUp, FaPlayCircle } from 'react-icons/fa'


const fontSizes = {
    sb: { d: "2rem", t: "1.5rem", m: "1rem" },
    b: { d: "1.2rem", t: "1rem", m: "0.9rem"},
    m: {d: "0.8rem", t: "0.75rem", m: "0.7rem"},
    s: {d: "0.7rem", t: "0.6rem", m: "0.55rem"},
    ss: {d: '0.6rem', t: '0.6rem', m: '0.55rem'}
}

export const ContentWrapper = styled(motion.div)`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  z-index: 301;
  transition: all 0.4s;
  direction: ${props => props.theme.english ? 'ltr' : 'rtl'};
`

export const ContentBody = styled.div`
  min-width: 320px;
  border-radius: 4px;
  padding: 20px;
  background-image: linear-gradient(to right, ${props => props.theme.g1} , ${props => props.theme.g2});
  box-shadow: 0 0 2px rgb(0, 0, 0, 0.01);
`


export const PortalTarget = styled.div`
  position: absolute;
  transition: all 0.4s;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  box-shadow: 0 0 0 calc(100vh + 100vw) rgb(0, 0, 0, 0.4);
  border: 1px solid ${props => props.theme.settingBg};
  z-index: 301;
`

export const TFlex = styled.div`
  display: flex;
  width: ${props => props.width ? props.width : props.fw ? "100%" : "unset"};
  height: ${props => props.height ? props.height : props.fh ? "100%" : "unset"};
  justify-content: ${props => props.justify || "center"};
  align-items: ${props => props.align || "center"};
  flex-wrap: ${props => props.wrap && "wrap"};
  position: relative;
`

export const TText = styled.div`
    font-size: ${({cFontSize, fontSize}) => cFontSize ? cFontSize : ( fontSize ? fontSizes[fontSize].d : fontSizes.m.d)};
  color: ${props => props.color && props.color};
  ${props => props.main && css`
    color: ${props => props.theme.color};
  `};
  ${props => props.primary && css`
    color: ${props => props.theme.primary};
  `};
  ${props => props.active && css`
    color: ${props => props.theme.mainOrange};
  `};
  ${props => props.secondary && css`
    color: ${props => props.theme.secondary};
  `};
  direction: ${props => props._type === "number" && "ltr"};
  font-family: ${props => props.type === "number" && "monospace"};
  margin: ${props => props.margin && props.margin};

  letter-spacing: 1.1px;

  ${props => props.yekan && css`
    font-family: YekanBakh;
    font-weight: 400;
  `};

  @media screen and (max-width: 1050px){
    font-size: ${({cFontSize, fontSize}) => cFontSize ? cFontSize : ( fontSize ? fontSizes[fontSize].t : fontSizes.m.t)};
  };

  @media screen and (max-width: 768px) {
    font-size: ${({cFontSize, fontSize}) => cFontSize ? cFontSize : ( fontSize ? fontSizes[fontSize].s : fontSizes.m.m)};
  };

  line-break: ${props => props.lineBreak || 'auto'};
`

export const TCloseIcon = styled(IoIosClose)`
  color: ${props => props.theme.primary};
  cursor: pointer;
`

export const THeader = styled(TFlex)`
  border-bottom: 1px solid ${props => props.theme.color}20;
  justify-content: space-between;
  width: 100%;
`

export const TCFlex = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.width ? props.width : props.fw ? "100%" : "unset"};
  height: ${props => props.height ? props.height : props.fh ? "100%" : "unset"};
  justify-content: ${props => props.justify || "center"};
  align-items: ${props => props.align || "center"};
  flex-wrap: ${props => props.wrap && "wrap"};
  position: relative;
`

export const TBtn = styled.div`
  background-color: ${props => props.theme.primary};
  border-radius: 16px;
  font-size: 13px;
  color: ${props => props.theme.mainBg};
  width: 80px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

export const QuestionWrapper = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transition: all 0.2s;
  z-index: ${props => props.zIndex};
`

export const QuestionIcon = styled(HiQuestionMarkCircle)`
  color: ${props => props.theme.color}70;
  cursor: pointer;
  
  &:hover{
    color: ${props => props.theme.color};
  };
`

export const InfoIcon = styled(HiInformationCircle)`
  color: ${props => props.theme.color}70;
  cursor: pointer;
  
  &:hover{
    color: ${props => props.theme.color};
  };
`

const PointerAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  100%{
    transform: translateY(2px);
  }
`

export const Pointer = styled(FaHandPointUp)`
  color: ${props => props.theme.active};
  animation: ${PointerAnimation} 1s infinite;
`

const InnerPortalAnimation = (props) => keyframes`
  0%{
    background-color: transparent;
  }
  100%{
    background-color: ${props.theme.portalTarget};
  }
`

export const InnerPortalTarget = styled.div`
  position: absolute;
  transition: all 0.4s;
  z-index: 301;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  animation: ${props => InnerPortalAnimation(props)} 1s infinite;
  border-radius: 4px;
`


export const StartTutorialWrapper = styled.div`
  position: fixed;
  right: 10px;
  z-index: 203;
  bottom: 2px;
  cursor: pointer;
  direction: ltr;
`

export const TutorialIcon = styled(FaPlayCircle)`
  color: ${props => props.theme.color};
  margin: 0 3px;
`

export const TourSkipWrapper = styled.div`
  border-radius: 4px;
  margin-top: 8px;
  padding: 4px 8px;
  background-color: ${props => props.theme.g1};
`

export const ChangeStepIcon = styled(HiChevronDoubleLeft)`
  color: ${props => props.theme.active};
  ${props => props.theme.english && css`
      transform: rotate(0deg);
      margin-right: 4px;
      ${props => props.next && css`
        transform: rotate(180deg);
        margin-left: 4px;
      `};
  `};

  ${props => !props.theme.english && css`
    transform: rotate(180deg);
    margin-left: 4px;
    ${props => props.next && css`
        margin-right: 4px;
        transform: rotate(0deg);
    `};
  `};
  

  
  
  cursor: pointer;
`
