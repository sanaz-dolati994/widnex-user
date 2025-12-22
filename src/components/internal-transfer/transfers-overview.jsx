import { BeatLoader } from 'react-spinners'
import { SOCKET_URL } from '../../core/constants/urls'
import { useMainContext } from '../../core/contexts/main'
import {
	useGetTransfersList,
	useProfileQuery,
} from '../../core/services/react-query/useInternalTransfer'
import { formatDate, formatNumber } from '../../core/utils/common'
import Text from '../../core/utils/Text'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'


export default function TransfersOverview() {
	const {
		main: { lang },
	} = useMainContext()

	const { data: profile, isLoading: profileLoading } = useProfileQuery()
	const { data: transfers, isLoading: transfersLoading } = useGetTransfersList()

	const loading = profileLoading || transfersLoading

	const renderedItems =
		transfers?.data.length > 0 ? (
			transfers.data?.map((transfer) => {
				return (
					<div
						key={transfer._id}
						className='flex items-center justify-between gap-x-2 mb-2 last:mb-0 px-2'>
						<div className='w-10 h-10 rounded-full bg-primary dark:bg-heading flex items-center justify-center'>
							<img
								src={
									transfer.currency === 'irt'
										? require('../../assets/images/tooman.png')
										: SOCKET_URL + `assets/icon/${transfer.currency}.png`
								}
								width={25}
								height={25}
								alt={transfer.currency}
							/>
						</div>

						<div className='flex flex-col gap-2 ml-auto'>
							<p
								className='text-heading dark:text-pColor font-semibold uppercase'
							>{transfer.currency}</p>
							<p className='flex items-center gap-x-1 text-black/50 dark:text-pColor/40 text-sm'>
								<span>
									{formatDate(
										transfer.createdAt,
										'time',
										lang === 'en' ? 'en-US' : 'fa-IR'
									)}
								</span>
								<span>-</span>
								<span>
									{formatDate(
										transfer.createdAt,
										'date',
										lang === 'en' ? 'en-US' : 'fa-IR'
									)}
								</span>
							</p>
						</div>

						<div className='flex items-center gap-x-1'>
							<span className='text-lg font-bold text-heading dark:text-pColor'>
								{transfer.amount
									? formatNumber(transfer.amount)
									: '--'}
							</span>
							{profile?._id === transfer?.toId ? (
								<FaChevronUp color='#11f344' size={11} />
							) : (
								<FaChevronDown color='#ce2331' size={11} />
							)}
						</div>
					</div>
				)
			})
		) : (
			<div className='flex items-center justify-center h-fit'>
				<Text tid='no-data' />
			</div>
		)

	return (
		<div className='mt-8 h-5/6 overflow-y-auto'>
			{loading ? (
				<div className='flex items-center justify-center h-fit'>
					<BeatLoader color='#0773F1' />
				</div>
			) : (
				renderedItems
			)}
		</div>
	)
}
