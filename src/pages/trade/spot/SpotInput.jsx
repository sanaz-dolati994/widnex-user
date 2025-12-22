import { useState } from 'react'
import { useRunAfterUpdate } from '../../../core/hooks/useRunAfterUpdate'
import { onInputValueChangeUtil } from '../../../core/utils/useInputValueChange'

const SpotInput = ({
	type,
	label,
	placeholder,
	suffix,
	value,
	onValueChange,
	error,
	isMarket = false,
	id,
}) => {
	const runAfterUpdate = useRunAfterUpdate()

	const onInputChange = (e) => {
		const value = onInputValueChangeUtil(e, runAfterUpdate)
		onValueChange(value)
	}

	return (
		<div>
			<span className={'text-sm'}>{label}</span>
			<div className={'rounded-md border-[1px] dark:border-card-border flex justify-between'}>
				{isMarket ? (
					<div
						className={'w-[75%] h-[40px] flex items-center justify-center text-sm text-slate-400'}
					>
						<span>بهترین قیمت بازار</span>
					</div>
				) : (
					<input
						id={id}
						className={'w-[75%] bg-transparent px-3 text-sm dark:text-gray-300'}
						placeholder={placeholder}
						value={value}
						onChange={onInputChange}
					/>
				)}
				<div
					className={
						'flex items-center justify-center bg-slate-200 dark:bg-card-border h-[40px] w-[25%]'
					}
				>
					{suffix.toUpperCase()}
				</div>
			</div>
		</div>
	)
}

export default SpotInput
