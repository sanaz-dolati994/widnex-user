

export const getUrlWithQueries = (
    endpoint, data
) => {
    const  { page = 1, limit = 10, dateFrom, dateTo, search = {}, query = {} } = data

    let searchParams = []
    let queryParams = []

    Object.keys(search).forEach(key => {
        const param = search[key]
        searchParams.push(param)
    })

    Object.keys(query).forEach(key => {
        const param = query[key]
        queryParams.push(param)
    })

    const searchQuery = `&search=${searchParams.join(",")}&query=${queryParams.join(",")}`

    return (
        `
          ${endpoint}?page=${page}&limit=${limit}${dateFrom ? `&dateFrom=${dateFrom}` : ""}${dateTo ? `&dateTo=${dateTo}` : ""}${searchQuery}
        `
    )
}
