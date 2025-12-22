import { useMemo, useState } from 'react'
import { CardLayout, getMainTheme, HintBox, useWindowSize } from '..'
import { useGetStakingPlans } from '../core/services'
import CreateStakingStage1 from './CreateStakingStage1'
import CreateStakingStage2 from './CreateStakingStage2'
import { ClipLoader } from 'react-spinners'

const CreateStaking = () => {
	const { width } = useWindowSize()

	const [currency, setCurrency] = useState('')
	const [stage, setStage] = useState(1)

	const { data: stakingPlans, isLoading } = useGetStakingPlans()

	const coins = useMemo(() => {
		let res = []
		if (stakingPlans?.length) {
			for (const p of stakingPlans) {
				if (!res.includes(p.currency)) {
					res.push(p.currency)
				}
			}
		}
		return res
	}, [stakingPlans])

	const onSubmit = (data = {}) => {
		if (stage === 1) {
			setStage(2)
			setCurrency(data.currency)
		}
	}

	return (
		<div className={`p-5 lg:main-border card-bg lg:rounded-md ${stage === 1 ? 'max-w-[800px]' : ''}`}>
			{isLoading ? (
				<div className={'w-full h-[200px] flex items-center justify-center'}>
					<ClipLoader size={16} color={getMainTheme().active} />
				</div>
			) : null}

			{stage === 1 ? <CreateStakingStage1 coins={coins} onSubmit={onSubmit} /> : null}
			{stage === 2 ? (
				<CreateStakingStage2
					plans={stakingPlans}
					onCurrencyChange={setCurrency}
					coins={coins}
					currency={currency}
					onSubmit={onSubmit}
				/>
			) : null}
		</div>
	)
}

export default CreateStaking
