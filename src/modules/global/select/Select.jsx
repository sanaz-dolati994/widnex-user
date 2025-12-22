import { useRef, useState } from 'react'
import Text from '../../../core/utils/Text'
import { FaCheck, FaChevronDown } from 'react-icons/fa6'
import useClickOutside from '../../../core/hooks/useClickOutside'

const Select = ({
	value,
	onChange,
	options = [],
	placeholder = '',
	icon = null,
	singleSelect = false,
	template = null,
	className = '',
	prefix = '',
}) => {
	const ref = useRef()
	const [open, setOpen] = useState(false)
	useClickOutside(ref, () => setOpen(false))

	return (
		<div className={'relative'} ref={ref}>
			<div
				className={
					`cursor-pointer dark:text-slate-200 text-xs
					main-border rounded-full min-w-[124px] justify-between
          			flex items-center gap-5 px-4 py-2 min-h-[40px] lg:min-h-[44px]` + className
				}
				onClick={() => setOpen((state) => !state)}
			>
				{icon ? <div>{icon}</div> : null}

				{!!value ? (
					template ? (
						template(value)
					) : (
						<Text tid={`${prefix}${value}`} />
					)
				) : (
					<Text tid={placeholder} />
				)}

				<div className={'flex justify-end'}>
					<FaChevronDown size={12} className={`${open ? 'rotate-180' : 'rotate-0'}`} />
				</div>
			</div>

			{open ? (
				<div
					className={`absolute z-[101] left-0 top-[44px] lg:top-[46px] w-full min-h-[92px] max-h-[300px] text-xs p-3 rounded
                     overflow-y-auto overflow-x-hidden main-border card-bg
                     `}
				>
					<div className={'flex flex-col gap-2'}>
						{options.map((op) => {
							return (
								<div
									onClick={() => {
										if (value === op && !singleSelect) {
											onChange('')
										} else {
											onChange(op)
										}
										setOpen(false)
									}}
									className={
										'cursor-pointer p-3 rounded-md hover:bg-primaryBg transition flex items-center justify-between'
									}
									key={op}
								>
									{template ? (
										template(op)
									) : (
										<>
											<Text tid={`${prefix}${op}`} />
											{value === op ? <FaCheck size={18} className={'text-green-500'} /> : null}
										</>
									)}
								</div>
							)
						})}
					</div>
				</div>
			) : null}
		</div>
	)
}

export default Select
