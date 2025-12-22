import { FaCircleCheck } from 'react-icons/fa6'
import { useMainContext } from '../../core/contexts/main'
import { IoIosCloseCircle } from 'react-icons/io'
import Text from '../../core/utils/Text'
import { formatDate, formatNumber } from '../../core/utils/common'
import { Link } from 'react-router-dom'

export default function InternalTransferResult({ result, closeResult }) {
	const { data: resultData, success } = result

	const {
		main: { lang },
	} = useMainContext()

	return (
		<div className='flex flex-col w-full max-w-[375px] mx-auto text-sm pt-4'>
			<div
				className={`w-20 h-20 rounded-full ${success ? 'bg-[#00A4781F]' : 'bg-red-400/50'
					} self-center flex items-center justify-center`}
			>
				{success ? (
					<FaCircleCheck color='#00A478' size={50} />
				) : (
					<IoIosCloseCircle color='#d33c3c' size={50} />
				)}
			</div>
			<h3 className='text-sm text-center font-semibold my-3'>
				{success ? <Text tid='successful-payment' /> : <Text tid='failed-payment' />}
			</h3>
			<h3
				className={`flex gap-x-4 items-center justify-center mb-5 ${success ? 'text-[#00A478]' : 'text-[#d33c3c]'
					}`}
			>
				<span className='text-lg font-medium'>{resultData.currency.toUpperCase()}</span>
				<span className='text-xl font-bold'>{formatNumber(resultData.finalAmount)}</span>
			</h3>
			<div className='flex items-center justify-between rounded-lg even:bg-gray-secondary dark:even:bg-[#ffffff10] px-4 py-2'>
				<h4 className='opacity-60'>
					<Text tid='date' /> :
				</h4>
				<p className='font-medium'>
					{formatDate(resultData.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}
				</p>
			</div>
			<div className='flex items-center justify-between rounded-lg even:bg-gray-secondary dark:even:bg-[#ffffff10] px-4 py-2'>
				<h4 className='opacity-60'>
					<Text tid='status' /> :
				</h4>
				<p className='font-medium flex items-center gap-x-1'>
					{success ? (
						<>
							<FaCircleCheck color='#00A478' />
							<Text tid='succeed' className='text-[#00A478]' />
						</>
					) : (
						<>
							<IoIosCloseCircle color='#d33c3c' />
							<Text tid='failed' className='text-[#d33c3c]' />
						</>
					)}
				</p>
			</div>
			<div className='flex items-center justify-between rounded-lg even:bg-gray-secondary dark:even:bg-[#ffffff10] px-4 py-2'>
				<h4 className='opacity-60'>
					<Text tid='gateway' /> :
				</h4>
				<p className='font-medium'>
					<Text tid='internal-transfer' />
				</p>
			</div>
			<div className='flex items-center justify-between rounded-lg even:bg-gray-secondary dark:even:bg-[#ffffff10] px-4 py-2'>
				<h4 className='opacity-60'>
					<Text tid='id' /> :
				</h4>
				<p className='font-medium'>{resultData._id}</p>
			</div>
			<div className='flex flex-col gap-y-2 justify-center rounded-lg even:bg-gray-secondary dark:even:bg-[#ffffff10] px-4 py-2'>
				<h4 className='opacity-60'>
					<Text tid='transaction-note' /> :
				</h4>
				<p className='font-medium'>{resultData.note}</p>
			</div>
			<div className='flex gap-x-5 mt-5'>
				<Link
					to='#'
					className='grow rounded-lg bg-cBlue text-white px-4 py-2 h-[44px] flex items-center justify-center'
				>
					<Text tid='share' />
				</Link>

				<Link
					to='/dashboard'
					className='grow rounded-lg border border-borderPrimary dark:border-card-border text-pcolor-light px-4 py-2 h-[44px] flex items-center justify-center'
				>
					<Text tid='back-home' />
				</Link>
			</div>
		</div>
	)
}
