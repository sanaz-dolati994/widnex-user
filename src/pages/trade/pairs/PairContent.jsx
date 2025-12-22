import { FaSearch } from 'react-icons/fa'
import { SOCKET_URL } from '../../../core/constants/urls'
import { formatNumber } from '../../../core/utils/common'

const PairContent = ({
	filters,
	handleSearch,
	secondParts,
	setFilters,
	onMarketChange,
	findPersianName,
	onboard,
}) => {
	return (
		<>
			<form
				id={'pairs-search'}
				className='bg-primary dark:bg-white/10 relative flex items-center w-full px-4 py-2 rounded-lg'
			>
				<input
					type='text'
					className='block w-11/12 bg-transparent placeholder:text-sm'
					placeholder='جستجو در بازار...'
					value={filters.search}
					onChange={handleSearch}
				/>
				<FaSearch className='w-1/12 text-black/20 dark:text-pColor' />
			</form>

			<div
				className={'bg-primary dark:bg-white/10 p-1 rounded-lg grid grid-cols-3'}
				id={'pairs-pair'}
			>
				{secondParts.map((item) => {
					const active = item.id === filters.pair
					return (
						<div
							className={`
                                flex items-center justify-center rounded-md transition text-sm
                                h-[34px] ${
																	active ? 'bg-gray-300 dark:bg-gray-700' : ''
																} cursor-pointer
                            `}
							key={item.name}
							onClick={() => setFilters((state) => ({ ...state, pair: item.id }))}
						>
							<span>{item.name}</span>
						</div>
					)
				})}
			</div>

			<div className={'flex flex-col h-full'}>
				<div className={'grid grid-cols-4 px-2 border-b-[1px] dark:border-card-border '}>
					{['نام ارز', 'قیمت واحد', 'تغییرات (24h)'].map((head, idx) => {
						const ids = ['pairs-coin', 'pairs-price', 'pairs-_24change']
						return (
							<div
								key={head}
								className={`py-1
                                        ${idx === 0 ? 'col-span-2' : ''}
                                        text-[0.675rem] ${idx === 2 ? 'flex justify-end' : ''} ${
									idx === 1 ? 'flex justify-center' : ''
								}
                                        `}
							>
								<span className={'p-1'} id={ids[idx]}>
									{head}
								</span>
							</div>
						)
					})}
				</div>

				<div className={'py-3 overflow-y-auto h-[65%] lg:h-[340px]'}>
					{onboard.map((coin, idx) => {
						let change = coin._24change
						if (typeof change === 'number') {
							change = change.toFixed(2)
						}

						return (
							<div
								className={`grid grid-cols-4 py-2 border-b-[1px] dark:border-card-border
                                        dark:hover:bg-gray-800 cursor-pointer rounded-md  px-2 hover:bg-gray-200
                                        `}
								key={Math.random() * 1000 * idx}
								onClick={() => onMarketChange(coin)}
							>
								<div className={'flex items-center gap-1 col-span-2'}>
									<img
										width={32}
										height={32}
										src={SOCKET_URL + `assets/icon/${coin?.coin?.toLowerCase()}.png`}
										alt={`${coin.coin?.toLowerCase()}.png`}
									/>
									<div className={'flex flex-col'}>
										<span className={'text-gray-500 text-xs'}>
											{filters.pair
												? coin.coin?.toUpperCase()
												: `${coin.coin?.toUpperCase()} / ${coin.pair?.toUpperCase()}`}
										</span>
										<span className={'text-xs'}>{findPersianName(coin.coin)}</span>
									</div>
								</div>
								<div
									className={`flex justify-center text-xs
                                        ${coin.color === 'red' ? 'text-red-500' : 'text-green-500'}
                                        `}
								>
									{formatNumber(coin.price, { type: coin.pair })}
								</div>
								<div
									className={`flex justify-start text-xs
                                        ${coin.color === 'red' ? 'text-red-500' : 'text-green-500'}
                                        `}
									dir={'ltr'}
								>
									{`${change} %`}
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</>
	)
}

export default PairContent
