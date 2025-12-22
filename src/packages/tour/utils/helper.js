/**
 * id
 * header - string / div
 * content - string / div
 * position - center / top / bottom / left / right
 * controller - default / div
 * controller-content
 * config - { closable / portal / dismiss / tooltip }
 */

/**
 * @global
 * @typedef {Object} TourOption
 * @property {string} id - id of the tour step
 * @property {string | Element} header - header of tour step
 * @property {string | Element} content - content of tour step
 */


/**
 * @param { Element } el - element to get rect
 * @return {{top: number, left: number, width: number, height: number}}
 */
export const getOffset = (el) => {
    if (!el) return
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height
    };
}

/**
 * @param {string} position - left - center - right
 * @param rect - rect of element
 * @return {number}
 */
export const getQuestionLeft = (position, rect) => {
    switch (position) {
        case 'left':
            return rect.left + 10
        case 'right':
            return rect.left + rect.width - 26
        case 'center':
            return rect.left + rect.width / 2
        default:
            return rect.left
    }
}

/**
 * @param details
 * @return {{top, left: *}|{top: number, left}|{top: *, left}|{top, left: number}}
 */
export const getContentPosition = (details) => {
    const IS_LEFT = details.left > ((details.nodeWidth || 0) + 100)
    const IS_RIGHT = details.left + details.width  < window.innerWidth - (details.nodeWidth || 0)
    const IS_TOP = !IS_LEFT && !IS_RIGHT && (details.top > (details.nodeHeight || 0) + 100)
    const IS_DOWN = !IS_TOP

    if (IS_LEFT)
        return {
            left: details.left - (details.nodeWidth || 0), top: details.top,
            mode: 'left'
        }
    if (IS_RIGHT)
        return {
            left: details.left + details.width, top: details.top,
            mode: 'right'
        }
    if (IS_TOP)
        return {
            left: details.left,
            top: details.top - (details.nodeHeight || 0),
            mode: 'top'
        }
    if (IS_DOWN)
        return {
            left: details.left,
            top: details.top + details.height,
            mode: 'bottom'
    }
}


export const getScrollPosition = (details) => {
    const contentPosition = getContentPosition(details)
    return contentPosition.mode === 'bottom' ?
        contentPosition.top - details.height - 150
        :
        contentPosition.top - 150
}


export const getControllerInnerRect = (pos, rect) => {

    switch (pos) {
        case 'top-left':
            return {
                left: rect.left + 2,
                top: rect.top + 2
            }
        case 'top-right':
            return {
                left: rect.left + rect.width - 16,
                top: rect.top + 2
            }
        default:
            return null
    }

}
