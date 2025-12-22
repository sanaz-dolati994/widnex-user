export default function TruncateEnd({
	text,
	frontChars = 12,
	onClick,
	className = '',
	dir = 'ltr',
}) {
	let truncatedText
	if (!text) truncatedText = '--'
	else if (text.length <= frontChars) truncatedText = text
	else truncatedText = `${text.slice(0, frontChars)}...`

	return (
		<div className='cursor-pointer' onClick={onClick} dir={dir}>
			<span className={`text-sm ${className}`}>{truncatedText}</span>
		</div>
	)
}
