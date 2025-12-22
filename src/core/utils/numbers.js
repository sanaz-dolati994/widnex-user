import numeral from 'numeral'

export const _formatNumber = (value = 0, { format = '0,0.00000', shorten = false } = {}) => {
	if (!value) {
		value = 0
	}

	const hasComa = typeof value !== 'number' && value.indexOf(',') >= 0
	const noComaValue = hasComa ? numeral(value).value() : value

	let shortened = noComaValue
	let formatted = hasComa ? numeral(noComaValue).value() : numeral(noComaValue).format(format)

	if (shorten) {
		let shortenPrefixer = ''

		if (noComaValue >= 1_000 && noComaValue < 1_000_000) {
			shortened = shortened / 1000
			shortenPrefixer = 'K'
		} else if (noComaValue >= 1_000_000 && noComaValue < 1_000_000_000) {
			shortened = shortened / 1_000_000
			shortenPrefixer = 'M'
		} else if (noComaValue >= 1_000_000_000) {
			shortened = shortened / 1_000_000_000
			shortenPrefixer = 'B'
		}

		formatted = hasComa ? numeral(shortened).value() : numeral(shortened).format(format)
		formatted += shortenPrefixer
	}

	return formatted
}
