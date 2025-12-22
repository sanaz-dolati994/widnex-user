import Text from '../../core/utils/Text'
import { CloseSearchIcon } from '../../styles/CoinOperationStyles'
import { useState } from 'react'
import Loader from 'react-spinners/BeatLoader'

export default function AddContactModal({ onClose, onSubmit, submitting }) {
	const [contactId, setContactId] = useState('')
	const [tag, setTag] = useState('')
	const [error, setError] = useState(null)

	const handleSubmit = (e) => {
		e.preventDefault()

		if (!contactId.trim() && !tag.trim()) setError(['contactId', 'tag'])
		else if (!contactId.trim()) setError('contactId')
		else if (!tag.trim()) setError(['tag'])
		else {
			setError(null)
			onSubmit({ contactId, note: tag })
		}
	}

	return (
		<div className={'relative'}>
			<div className={'absolute left-[-8px] top-[-12px]'} onClick={onClose}>
				<CloseSearchIcon />
			</div>
			<div className={'flex flex-col gap-5 text-sm'}>
				<h2 className={'text-base font-semibold flex items-center justify-center'}>
					<Text tid={'add-contact'} />
				</h2>

				<form onSubmit={handleSubmit} className='flex flex-col gap-y-5'>
					<FormControl
						label='contactId'
						placeholder='شناسه مخاطب را وارد کنید'
						hasError={error?.includes('contactId')}
						error='شناسه مخاطب ضروری است'
						value={contactId}
						onChange={(e) => setContactId(e.target.value)}
						id='user-id'
					/>

					<FormControl
						label='tag'
						placeholder='یک نام دلخواه وارد نمایید'
						hasError={error?.includes('tag')}
						error='برچسب ضروری است'
						value={tag}
						onChange={(e) => setTag(e.target.value)}
						id='tag'
					/>

					<div className={'flex items-center justify-center gap-x-2'}>
						<button
							type='submit'
							className='w-1/2 rounded-lg h-[42px] py-2 flex items-center justify-center bg-cBlue text-white'
						>
							{submitting ? <Loader size={10} color='white' /> : <Text tid='confirm' />}
						</button>
						<button
							type='button'
							onClick={onClose}
							className='w-1/2 rounded-lg h-[42px] py-2 shadow-md flex items-center justify-center'
						>
							<Text tid='cancel' />
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

const FormControl = ({ label, id, value, onChange, placeholder, hasError, error }) => {
	return (
		<div className={`flex flex-col gap-y-2`}>
			<label htmlFor={id}>
				<Text tid={label} />
			</label>
			<input
				className={`bg-transparent w-full placeholder:text-xs h-[42px] rounded-lg border ${hasError
					? 'border-red-500'
					: 'border-main border-opacity-20 hover:border-active focus-within:border-active'
					}  px-4 py-2`}
				placeholder={placeholder}
				id={id}
				value={value}
				onChange={onChange}
			/>
			{hasError && <Text tid={error} className={'text-red-500 text-xs'} />}
		</div>
	)
}
