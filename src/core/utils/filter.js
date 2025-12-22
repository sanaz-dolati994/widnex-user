

export const TYPES = {
    FLOW: "flow",
    STATUS: "status",
    TYPE: "type",
    DATE: "date",
    SUBMIT: "submit",
    COIN: "coin",
    CURRENCY: "currency"
}


export const filters = {
    flow: [
        "all", "deposit", "withdraw"
    ],
    date: [
        "today", "yesterday", "7days", "15days", "1month", "1year"
    ],
    type: [
        "all", "buy", "sell"
    ],
    submit: [
        "all", "market", "limit", "stop", "oco",
    ],
    status: [
        "all", "Tsuccess", "Terror", "Tpending", "Tcanceled"
    ]
}


export const getFilterDate = (idx) => {
    const type = filters.date[idx]
    const date = new Date()
    date.setHours(0, 0, 0,0)
    switch (type) {
        case "today":
            return date.toISOString()
        case "yesterday":
            date.setDate(date.getDate() - 1)
            return date.toISOString()
        case "7days":
            date.setDate(date.getDate() - 7)
            return date.toISOString()
        case "15days":
            date.setDate(date.getDate() - 15)
            return date.toISOString()
        case "1month":
            date.setMonth(date.getMonth() - 1)
            return date.toISOString()
        case "1year":
            date.setFullYear(date.getFullYear() - 1)
            return date.toISOString()
        default:
            return null
    }
}