import Card from "../../../components/common/Card"
import TradingChart from "./TradingChart"

const Charts = () => {

    return (
        <Card className={'w-full h-full relative'} padding={'px-2 py-4'}>
            <TradingChart />
        </Card>
    )
}

export default Charts