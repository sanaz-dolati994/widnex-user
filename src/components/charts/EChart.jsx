import {useEffect, useRef} from "react";
import * as echarts from 'echarts';


const EChart = (props) => {

    const { resize, option, ...rest } = props

    const chart = useRef(null)

    useEffect(() => {
        if (chart.current) {
            const _chart = echarts.init(chart.current)
            _chart.setOption(option)
            window.onresize = () => {
                _chart.resize()
            }
        }
    }, [resize, option])

    return (
        <div ref={chart} {...rest} />
    )
}

export default EChart
