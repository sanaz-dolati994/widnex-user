export default function TruncateMiddle({ text, frontChars = 6, backChars = 6, onClick }) {
	let truncatedText
	if (!text) truncatedText = '--'
	else if (text.length <= frontChars + backChars) truncatedText = text
	else truncatedText = `${text.slice(0, frontChars)}...${text.slice(-backChars)}`

	return (
		<div className='cursor-pointer' onClick={onClick}>
			<span className={`text-cBlue text-sm ${text ? 'border-b dark:border-b-cBlue' : ''}`}>
				{truncatedText}
			</span>
		</div>
	)
}
