import { JalaliDateTime } from 'jalali-date-time'
import { formatDate } from './common'

const jalali = JalaliDateTime({
	timezone: 'Asia/Tehran',
	locale: 'fa',
	fullTextFormat: 'Y/M/D H:I',
	titleFormat: 'D N Y',
	dateFormat: 'Y/M/D H:I:S',
	timeFormat: 'H:I:S',
})

export const _formatDate = (date, { format = 'toFullText', lang = 'fa' } = {}) => {
	date = new Date(date)
	const jalaliDate = jalali[format]?.(date) || jalali.toFullText(date)

	return lang === 'fa' ? jalaliDate : formatDate(date, undefined, 'en-US')
}
