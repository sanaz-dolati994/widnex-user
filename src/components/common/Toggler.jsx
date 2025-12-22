import { BiMoon, BiSun } from 'react-icons/bi'
import styled, { css } from 'styled-components'
import { useMainContext } from '../../core/contexts/main'

export default function ThemeToggler() {
    const {
        main: { theme, setTheme },
    } = useMainContext()

    return (
        <Wrapper $theme={theme} className='bg-gray-light dark:bg-[#111924]'>
            <div onClick={() => setTheme('light')}>
                <BiSun size={18} color={theme === 'light' ? '#fff' : '#bbb'} />
            </div>
            <div onClick={() => setTheme('dark')}>
                <BiMoon size={18} color={theme === 'dark' ? '#fff' : '#bbb'} />
            </div>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 80px;
    height: 36px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    position: relative;

    &::after {
        content: '';
        display: block;
        width: 35px;
        height: 35px;
        border-radius: 20px;
        position: absolute;
        background-color: ${(props) =>
            props.$theme === 'dark' ? '#2E3344' : '#0773f1'};
        z-index: 5;
        ${(props) =>
            props.$theme === 'dark'
                ? css`
                      left: 0;
                  `
                : css`
                      left: 100%;
                      transform: translateX(-100%);
                  `};
        transition: all 0.3s;
    }

    & > div {
        width: 35px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        cursor: pointer;
    }
`
