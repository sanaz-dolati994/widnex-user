import { ClipLoader } from 'react-spinners'
import { SOCKET_URL } from '../../core/constants/urls'
import { formatNumber } from '../../core/utils/common'
import Text from '../../core/utils/Text'
import { InvoiceIcon } from '../common/icons'

export default function InternalTransferInvoice({
	invoice,
	closeInvoice,
	makeTransfer,
	isTransfering,
}) {
	const handleSubmit = () => {
		makeTransfer({
			toId: invoice.toId,
			currency: invoice.currency,
			amount: invoice.amount,
			note: invoice.note,
		})
	}

	return (
		<div className='flex flex-col w-2/3 mx-auto text-sm mt-4 relative'>
			<div className='w-20 h-20 rounded-full bg-[#F7931A1F] self-center flex items-center justify-center'>
				<InvoiceIcon />
			</div>
			<h3 className='text-base text-center font-semibold my-3'>
				<Text tid='internal-transfer-invoice' />
			</h3>
			<div className='flex items-center justify-between rounded-lg odd:bg-gray-secondary dark:odd:bg-[#ffffff10] px-4 py-2'>
				<h4 className='opacity-60'>
					<Text tid='coin' /> :
				</h4>
				<div className='flex items-center gap-x-2'>
					<img
						src={
							invoice.currency === 'irt'
								? require('../../assets/images/tooman.png')
								: SOCKET_URL + `assets/icon/${invoice.currency}.png`
						}
						width={28}
						height={28}
						alt={invoice.currency}
					/>
					<p>{invoice.currency.toUpperCase()}</p>
				</div>
			</div>
			<div className='flex items-center justify-between rounded-lg odd:bg-gray-secondary dark:odd:bg-[#ffffff10] px-4 py-2'>
				<h4 className='opacity-60'>
					<Text tid='amount' /> :
				</h4>
				<p>
					{invoice.currency.toUpperCase()} {formatNumber(invoice.amount)}
				</p>
			</div>
			<div className='flex items-center justify-between rounded-lg odd:bg-gray-secondary dark:odd:bg-[#ffffff10] px-4 py-2'>
				<h4 className='opacity-60'>
					<Text tid='receiver-id' /> :
				</h4>
				<p>{invoice.toId}</p>
			</div>
			<div className='flex items-center justify-between rounded-lg odd:bg-gray-secondary dark:odd:bg-[#ffffff10] px-4 py-2'>
				<h4 className='opacity-60'>
					<Text tid='receiver-username' /> :
				</h4>
				<p>{(invoice.to.firstName || '-') + ' ' + (invoice.to.lastName || '-')}</p>
			</div>
			<div className='flex items-center justify-between rounded-lg odd:bg-gray-secondary dark:odd:bg-[#ffffff10] px-4 py-2'>
				<h4 className='opacity-60'>
					<Text tid='transaction-fee-1' /> :
				</h4>
				<p>
					{invoice.currency.toUpperCase()} {formatNumber(invoice.wage)}
				</p>
			</div>
			<div className='flex items-center justify-between rounded-lg odd:bg-gray-secondary dark:odd:bg-[#ffffff10] px-4 py-2'>
				<h4 className='opacity-60'>
					<Text tid='amount-to-pay' /> :
				</h4>
				<p>
					{invoice.currency.toUpperCase()} {formatNumber(invoice.finalAmount)}
				</p>
			</div>
			<button
				className='mt-4 w-full rounded-lg bg-cBlue text-white px-4 py-2 h-[44px] flex items-center justify-center gap-x-4'
				onClick={handleSubmit}
			>
				{isTransfering ? (
					<>
						<Text tid='doing' />
						<ClipLoader size={15} color={'#fff'} />
					</>
				) : (
					<Text tid='submit-transfer' />
				)}
			</button>

			<button
				className='absolute bottom-0 left-full py-2 inline-block w-20 opacity-60'
				onClick={closeInvoice}
			>
				<Text tid='previous-step' />
			</button>
		</div>
	)
}
