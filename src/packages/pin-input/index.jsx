import {useEffect, useRef, useState} from "react";
import styled from "styled-components";


const splitNumbers = (num) => {
    let n = num
    const temp = []
    while (n > 0) {
        temp.push( n % 10)
        n = parseInt(n / 10)
    }
    return temp.reverse()
}

const PinInput = ({ onChange }) => {

    const refs = useRef([])

    const [nums, setNums] = useState([])
    const [focus, setFocus] = useState(0)

    // useEffect(() => {
    //     setNums(splitNumbers(value))
    // }, [value])

    const onInputChange = (e, idx) => {
        const oldV = nums[idx]
        let v = e?.target?.value
        v = v.replace( /[^\d.,]/g , '' )
        const splited = splitNumbers(v)
        v = splited.length ? splited[splited.length - 1] : v

        setNums(state => {
            const newState = [...state]
            let last = v
            if (!!oldV && !!v) {
                try{
                    const lst = splitNumbers(v)
                    last = lst[lst.length - 1]
                }
                catch (err) {}
            }
            newState[idx] = last
            return newState
        })

        if (v && idx !== 5) {
            setFocus(idx + 1)
        }
    }

    useEffect(() => {
        onChange(nums.join(''))
    }, [nums])

    const onKeyDown = (e) => {
        const keyID = e.keyCode
        if (keyID === 8 || keyID === 46) {
            setFocus(state => {
                if (state === 5) {
                    setNums[5] = ''
                }
                return state - 1
            })
        }
        if (keyID === 39) setFocus(state => (state + 1) % 6)
        if (keyID === 37) setFocus(state => state - 1 < 0 ? 5 : state - 1)
    }

    useEffect(() => {
        if (refs.current.length)
            refs.current[focus]?.focus()
    }, [focus])

    useEffect(() => {
        window.addEventListener("paste", (e) => {
            e.preventDefault()
            let paste = (e.clipboardData || window.clipboardData).getData("text");
            try {
                paste = paste.replace( /[^\d.,]/g , '' )
                const splited = splitNumbers(paste)
                if (splited.length) {
                    setNums(splited)
                }
                setFocus(splited.length === 6 ? 5 : splited.length)
            }
            catch (err) {}
        })
    }, [])


    return (
        <div className={'flex justify-between items-center w-full'} dir={'ltr'}>
            {[1, 2, 3, 4, 5, 6].map((item, idx) => {

                return (
                    <Input
                        key={item}
                        ref={el => refs.current[idx] = el}
                        value={nums[idx]}
                        onChange={e => onInputChange(e, idx)}
                        onKeyDown={(e) => onKeyDown(e, idx)}
                        onClick={() => setFocus(idx)}
                    />
                )
            })}
        </div>
    )
}

const Input = styled.input`
  background-color: transparent;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.color};
  width: 54px;
  height: 48px;
  color: ${props => props.theme.color};
  text-align: center;
  font-size: 1.2rem;
`

export default PinInput
