import EChart from "./EChart";
import {useMainContext} from "../../core/contexts/main";
import {useMemo} from "react";


const WalletAreaChart = ({ data, height = '300px' }) => {

    const { main: { theme } } = useMainContext()
    const increasing = useMemo(() => {
        if (data.values?.length) {
            return data.values[data.values.length - 1] - data.values[0] > 0
        }
    }, [data])

    const getFormattedNumber = (v) => {
        if (v > 1000000000) {
            return `${parseInt(v / 1000000000)} B`
        }
        if (v > 1000000) {
            return `${parseInt(v / 1000000)} M`
        }
        if (v > 1000) {
            return `${parseInt(v / 1000)} K`
        }
        return v
    }

    const option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.dates
        },
        tooltip: {
            trigger: 'axis'
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '20%'],
            splitLine: {
                lineStyle: {
                    color: theme === 'dark' ? '#ffffff20' : '#00000040',
                    type: 'dotted'
                }
            },
            axisLabel: {
                formatter: v => `${getFormattedNumber(v)}`
            }
        },
        series: [
            {
                data: data.values,
                type: 'line',
                areaStyle: {},
                showSymbol: false,
                color: [
                    increasing ? '#19E19380' : '#EE414180'
                ]
            }
        ]
    };

    return (
        <EChart option={option} style={{ width: '100%', height: height}} />
    )
}

export default WalletAreaChart
