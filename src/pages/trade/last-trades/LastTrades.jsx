import { useEffect, useState } from "react"
import Card from "../../../components/common/Card"
import { useSocketContent } from "../../../core/contexts/socket-content"
import LastTradeContent from "./LastTradeContent"


const LastTrades = ({ withoutCard }) => {

    const { trades } = useSocketContent()

    const [lastTrade, setLastTrade] = useState(null)
    const [tradesOnBoard, setTradesOnBoard] = useState([])
    const [shouldAnimateTradeItems, setShouldAnimateTradeItems] = useState([])

    useEffect(() => {

        if (trades?.length) {

            let temp = []
            const lastIndex = trades.findIndex(t => getUniqueDate(t) === lastTrade)
            if (lastIndex !== -1) {
                temp = trades?.slice(0, lastIndex).map(item => (getUniqueDate(item)))
            }

            setShouldAnimateTradeItems(temp)
            setTradesOnBoard(trades)
            setLastTrade(getUniqueDate(trades[0]))

        } else {
            setLastTrade([])
        }
    }, [trades])


    const getUniqueDate = (item) => {
        return new Date(item.createdAt).getTime()
    }

    return (
        <>
            {withoutCard ?
                <LastTradeContent
                    tradesOnBoard={tradesOnBoard}
                />
                :
                <Card className={'w-full h-full relative'} padding={'py-4 px-2'}>
                    <LastTradeContent
                        tradesOnBoard={tradesOnBoard}

                    />
                </Card >
            }
        </>

    )
}

export default LastTrades