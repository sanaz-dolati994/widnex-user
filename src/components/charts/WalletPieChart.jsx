import EChart from "./EChart";
import {useMemo} from "react";
import {useMainContext} from "../../core/contexts/main";
import Text from "../../core/utils/Text";
import {useWindowSize} from "../../core/hooks/useWindowSize";
import {TABLET_SIZE} from "../../core/constants/common";


const WalletPieChart = ({ data }) => {

    const { width } = useWindowSize()
    const { main: { theme } } = useMainContext()
    const colors = [
        '#5470c6',
        '#91cc75',
        '#fac858',
        '#ee6666'
    ]

    const chartData = useMemo(() => {
        let res = []
        const sorted = [...data]
        sorted.sort((a, b) => (a.value < b.value) ? 1 : ((a.value > b.value) ? -1 : 0))

        let total = 0
        for (const c of sorted) total += c.value

        for (let i = 0; i < Math.min(3, sorted.length); i++) {
            const curr = sorted[i]
            const item = {
                name: curr.id.toUpperCase(),
                value: curr.value,
                pc: !!total ? ((curr.value / total) * 100).toFixed(2) : 0
            }
            res.push(item)
        }
        let other = {
            name: 'Other',
            value: 0,
            pc: 0
        }
        for (let i = 3; i < sorted.length; i++) {
            const curr = sorted[i]
            other.value += curr.value
        }
        if (other.value) {
            other.pc = Math.floor((other.value / total) * 100)
            res.push(other)
        }
        return res
    }, [data])

    const option = {
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: 'پراکندگی',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 6,
                    borderColor: theme === 'dark' ? '#fff' : '#00000080',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: width > TABLET_SIZE ? 24 : 16,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: chartData
            }
        ]
    }

    return (
        <div className={'flex lg:flex-row flex-col-reverse justify-between items-center w-full h-full relative'}>
            <div className={'absolute top-0 right-0 z-[100] text-sm flex justify-end'}>
                <Text tid={'wallet-pie-chart'} />
            </div>
            <div className={'flex flex-col gap-2 w-full'}>
                {chartData.map((item, idx) => {
                    return (
                        <div className={'flex items-center justify-between'}>
                            <span className={'text-sm'} dir={'ltr'}>{item.pc}%</span>
                            <div className={'flex items-center gap-4'} dir={'ltr'}>
                                <div style={{ background: colors[idx] }} className={'w-[26px] h-[12px] rounded-md'} />
                                <span className={'text-sm mt-1'}>{item.name}</span>
                            </div>
                        </div>
                    )

                })}
            </div>
            <EChart option={option} style={{ width: '300px', height: '300px'}} />
        </div>
    )
}

export default WalletPieChart
