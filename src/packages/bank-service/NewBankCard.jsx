import Text from '../../core/utils/Text'
import { TransactionStatus } from '../../styles/TransactionHistoryStyles'

const BankCard = (props) => {
	const { bankInfo, bankAccount } = props

	let cardNo = bankAccount.cardNo

	cardNo =
		cardNo.substring(12, 16) +
		' ' +
		cardNo.substring(8, 12) +
		' ' +
		cardNo.substring(4, 8) +
		' ' +
		cardNo.substring(0, 4)

	return (
		<div
			className='relative w-full h-44 bg-gray-secondary dark:bg-white/10 rounded-xl overflow-hidden'
			{...props}
		>
			<div className='absolute top-0 right-0 rounded-bl-[38px] w-[70px] h-[70px] bg-[#CBE3FF] dark:bg-white/5 bg-opacity-20 flex items-end justify-end pl-3 pb-3'>
				<img
					src={require(`./banks/${bankInfo.logo}.svg`)}
					alt={bankInfo.title.fa}
					className='w-12 h-12'
				/>
			</div>

			<div className='absolute top-1/2 left-5 transform -translate-y-1/2 z-10'>
				<p className='text-lg font-semibold text-left'>{cardNo}</p>
				<p className='text-lg font-semibold text-left'>{bankAccount.shebaNo}</p>
			</div>

			<div className='absolute bottom-2 right-5'>
				<h5 className='text-pcolor-light text-xs'>
					<Text tid='status' />:
				</h5>
				<TransactionStatus status={bankAccount.verifyAt ? 'success' : 'pending'}>
					<Text tid={bankAccount.verifyAt ? 'verified' : 'Tpending'} className='text-sm' />
				</TransactionStatus>
			</div>

			<div className='absolute bottom-0 left-0 w-3/5 h-3/5 rounded-tr-[38px] bg-[#CBE3FF] dark:bg-white/5 bg-opacity-20'></div>
		</div>
	)
}

export default BankCard
