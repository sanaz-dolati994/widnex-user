import { Text, useWindowSize } from '..'
import { TABLET_SIZE } from '../../../core/constants/common'
import { SOCKET_URL } from '../../../core/constants/urls'
import { useAvailableCoin } from '../../../pages/trade/utils/useMarketQuery'
import { TbInfoHexagonFilled } from 'react-icons/tb'

const CreateStakingStage1 = ({ coins, onSubmit }) => {
	const { data: currencies } = useAvailableCoin()
	const { width } = useWindowSize()

	return (
		<>
			<div className={'flex flex-col gap-2'}>
				<Text tid={'available-staking-coins'} className={'dark:text-gray-100 text-base'} />
				<Text tid={'available-staking-note'} className={'text-gray-500 text-xs'} />
			</div>
			<div className={'flex flex-wrap items-center gap-3 w-full lg:w-max mt-5'}>
				{coins.map((c) => {
					let curr
					try {
						curr = currencies?.find((x) => x.id === c)
					} catch (err) {}

					return (
						<div
							className={`${
								width > TABLET_SIZE
									? 'active-hover-bg flex-center '
									: 'dark:bg-card-border flex items-center px-3'
							} 
								gap-2 cursor-pointer w-full lg:w-[164px] h-[78px] rounded-lg`}
							key={c}
							onClick={() => onSubmit({ currency: c })}
						>
							<img
								width={46}
								height={46}
								src={
									c === 'irt'
										? require('../../../assets/images/tooman.png')
										: SOCKET_URL + `assets/icon/${c}.png`
								}
								alt=' '
							/>
							<div className={'flex flex-col'}>
								<span className={'text-sm'}>{c.toUpperCase()}</span>
								<span className={'text-xs text-slate-500'}>{curr?.name || 'تومان'}</span>
							</div>
						</div>
					)
				})}
			</div>

			<div className={'w-full h-[1px] dark:bg-card-border bg-slate-300 my-8'} />

			<div
				className={'dark:bg-hintBg-dark bg-gray-light rounded-md p-5 flex flex-col gap-2 text-xs'}
			>
				<div className={'flex items-center gap-2'}>
					<TbInfoHexagonFilled className={'text-blue-500'} size={20} />
					<span className={'text-blue-500'}>
						<Text tid={'remembering'} />
						<span> :</span>
					</span>
				</div>
				<Text tid={'staking-stage1-note-1'} />
			</div>

			<div
				className={
					'dark:bg-hintBg-dark bg-gray-light rounded-md p-5 flex flex-col gap-2 text-xs mt-5'
				}
			>
				<div className={'flex items-center gap-2'}>
					<TbInfoHexagonFilled className={'text-blue-500'} size={20} />
					<span className={'text-blue-500'}>
						<Text tid={'remembering'} />
						<span> :</span>
					</span>
				</div>
				<Text tid={'staking-stage1-note-2'} />
			</div>
		</>
	)
}

export default CreateStakingStage1
