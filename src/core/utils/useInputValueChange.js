import {p2e} from "./common";



/**
 * @param e - event
 * @param runAfterUpdate
 * @return {*}
 */
const onInputValueChangeUtil = (e, runAfterUpdate) => {

    let value = p2e(e?.target?.value)
    value = value.replace( /[^\d.,]/g , '' )

    let newValue = ''
    let hasDot = false
    for (let i = 0; i < value.length; i++) {
        if (hasDot && value[i] === '.') continue
        if (value[i] === '.') {
            hasDot = true
        }
        newValue += value[i]
    }
    value = newValue

    let cursorStart = e?.target?.selectionStart
    let cursorEnd = e?.target?.selectionEnd
    let numParts = value.split('.')
    const originalLen = numParts[0].length
    numParts[0] = numParts[0].replaceAll(",", "")
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    const newLen = numParts[0].length

    runAfterUpdate(() => {
        if (newLen > originalLen) {
            cursorStart++
            cursorEnd++
        }else if (newLen < originalLen) {
            cursorStart--
            cursorEnd--
        }
        e?.target?.setSelectionRange(cursorStart, cursorEnd)
    })

    return (numParts.join("."))
}

export {
    onInputValueChangeUtil
}