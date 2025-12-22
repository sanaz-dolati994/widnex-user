export const formatDate = (date, type, lang, options = {}) => {
    if (type === 'time') {
        const formatted = new Date(date).toLocaleTimeString(lang, options)
        return convertNumbers2English(formatted)
    }
    const formatted = new Date(date).toLocaleDateString(lang)
    return convertNumbers2English(formatted)
}


export const deformatNumber = (str) => {
    try {
        let numParts = str.split('.')
        numParts[0] = numParts[0].replaceAll(',', '')
        return parseFloat(numParts.join('.'))
    } catch (err) {
        return null
    }
}



const convertNumbers2English = function (string) {
    return string.replace(/[٠١٢٣٤٥٦٧٨٩]/g, (c) => {
        return c.charCodeAt(0) - 1632;
    }).replace(/[۰۱۲۳۴۵۶۷۸۹]/g, (c) => {
        return c.charCodeAt(0) - 1776;
    });
}

export const variants = {
    in: {
        opacity: 1, transition: { duration: 0.3 }
    },
    out: {
        opacity: 0, transition: { duration: 0.3 }
    }
}


const toPlainString = (num) => {
    return ('' + +num).replace(/(-?)(\d*)\.?(\d*)e([+-]\d+)/,
        function (a, b, c, d, e) {
            return e < 0
                ? b + '0.' + Array(1 - e - c.length).join(0) + c + d
                : b + c + d + Array(e - d.length + 1).join(0);
        });
}

/**
 * Format numbers - filter
 * @param {number | float} num
 * @param {number} point
 * @param { string } type
 * @returns {string|number}
 */
export const formatNumber = (
    num,
    { point = 0, type = '' } = {}
) => {
    if (!num) {
        return 0
    }
    // const float = parseFloat(num)

    const number = toPlainString(num)
    const numParts = number.split('.')

    const firstPart = numParts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    if (type === 'irt') return firstPart

    let secondPart = null;
    if (numParts.length > 1) {
        secondPart = numParts[1].toString().substring(0, point ? point : (type === 'usdt' ? 2 : 6))
    }

    let formattedNumber = firstPart
    if (secondPart) formattedNumber = `${firstPart}.${secondPart}`
    if (!secondPart && point) formattedNumber += '.00'
    if (point && secondPart) {
        for (let i = 0; i < point - secondPart.length; i++) {
            formattedNumber += '0'
        }
    }

    if (!point && secondPart) {
        for (let i = formattedNumber.length - 1; i > 0; i--) {
            if (formattedNumber[i] === '0') {
                formattedNumber = formattedNumber.substring(0, i)
            } else if (formattedNumber[i] === '.') {
                formattedNumber = formattedNumber.substring(0, i)
                break
            } else {
                break
            }
        }
    }

    return formattedNumber

    // if (Math.abs(float) < 0.000001) return float.toFixed(8)
    // if (Math.abs(float) < 0.01) return float.toFixed(point ? point : 6)
    // if (Math.abs(float) < 1) return float.toFixed(point ? point : 6)
    // if (Math.abs(float) < 1000) return float.toFixed(point ? point : 1)
    // return Math.round(float).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export const formatSize = (size) => {
    if (size < 1000) return `${size}B`
    if (size < 1000000) return `${(size / 1000).toFixed(2)}KB`
    else return `${(size / 1000000).toFixed(2)}MB`
}

export const stringToNumber = (str) => {
    try {
        let numParts = str.split('.')
        numParts[0] = numParts[0].replaceAll(",", "")
        return numParts.join(".")
    } catch (err) { return null }
}


export const p2e = (str) => {
    return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
}

export const getIrDate = (d) => {
    return (new Date(d)).toLocaleDateString('fa')
}

export const deepCopy = (obj) => {
    if (!obj) return null
    return JSON.parse(JSON.stringify(obj))
}