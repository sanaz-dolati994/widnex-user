import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { TABLET_SIZE } from '../../core/constants/common'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import {
	FlexCenter,
	LegendIcon,
	LegendItem,
	LegendWrapper,
	ChartTooltip,
} from '../../styles/CommonStyles'
import { formatNumber } from '../../core/utils/common'
import {walletInfo} from "../../packages/wallet-service/WalletInfo";

const WalletChart = ({ data }) => {
	const { width } = useWindowSize()

	const CustomLegend = ({ payload }) => {
		return (
			<>
				{payload?.length ? (
					<LegendWrapper>
						{payload.map((item) => (
							<FlexCenter style={{ flexWrap: 'wrap' }}>
								<LegendIcon color={item.color} />
								<LegendItem color={item.color} key={item}>
									{item.value}
								</LegendItem>
							</FlexCenter>
						))}
					</LegendWrapper>
				) : null}
			</>
		)
	}

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload?.length) {
			return (
				<ChartTooltip>
					<p>{`${payload[0].name}: ${formatNumber(payload[0].value)}`}</p>
				</ChartTooltip>
			)
		}
		return null
	}

	return (
		<ResponsiveContainer height={250}>
			<PieChart>
				<Pie
					dataKey='value'
					data={data}
					innerRadius={width > TABLET_SIZE ? 50 : 30}
					labelLine={false}
					cy='50%'
				>
					{data.map((item) => (
						<Cell fill={getRandomColor(item)} />
					))}
				</Pie>
				<Tooltip content={<CustomTooltip />} />
				<Legend content={<CustomLegend />} />
			</PieChart>
		</ResponsiveContainer>
	)
}

const getRandomColor = (item) => {

	let color;
	const name = item.name?.toLowerCase()
	const coinInfo = walletInfo.find(w => w.name === name)
	if (coinInfo) {
		color = coinInfo.color
	}else{
		let random = Math.floor(Math.random() * 50)
		color = walletInfo[random].color
	}

	return color
}

export default WalletChart
