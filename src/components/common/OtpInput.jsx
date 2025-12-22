import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'

const OTPInput = forwardRef(({ onOtpChange, inputClassName = '', wrapperClassName = '' }, ref) => {
	const [otp, setOtp] = useState(Array(6).fill(''))
	const inputs = useRef([])

	const handleChange = (element, index) => {
		const value = element.value

		if (/^\d$/.test(value)) {
			const newOtp = [...otp]
			newOtp[index] = value
			setOtp(newOtp)

			if (index < 5) {
				inputs.current[index + 1].focus()
			}
		} else if (value === '') {
			const newOtp = [...otp]
			newOtp[index] = ''
			setOtp(newOtp)
		}
	}

	useEffect(() => {
		inputs.current[0].focus()
	}, [])

	const handleKeyDown = (event, index) => {
		if (event.key === 'Backspace' && otp[index] === '') {
			if (index > 0) {
				inputs.current[index - 1].focus()
			}
		}
	}

	const handlePaste = (event) => {
		const pasteData = event.clipboardData.getData('text').slice(0, 6)
		if (/^\d+$/.test(pasteData)) {
			const newOtp = pasteData.split('')
			setOtp(newOtp)

			inputs.current[newOtp.length - 1].focus()
		}
	}

	useEffect(() => {
		const otpValue = otp.join('')
		onOtpChange(otpValue)
	}, [otp])

	useImperativeHandle(ref, () => ({
		getOtpValue: () => otp.join(''),
	}))

	return (
		<div
			className={'my-5 flex justify-center gap-2 lg:gap-4 ' + wrapperClassName}
			onPaste={handlePaste}
			dir='ltr'
		>
			{otp.map((_, index) => (
				<input
					key={index}
					type='text'
					inputmode="numeric"
					maxLength='1'
					value={otp[index]}
					onChange={(e) => handleChange(e.target, index)}
					onKeyDown={(e) => handleKeyDown(e, index)}
					ref={(el) => (inputs.current[index] = el)}
					className={
						'w-10 h-10 lg:w-12 lg:h-12 text-lg text-center rounded-xl border border-borderPrimary bg-input dark:bg-white/10 outline-none ' +
						inputClassName
					}
				/>
			))}
		</div>
	)
})

export default OTPInput
