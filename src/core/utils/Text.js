import { useTranslation } from 'react-i18next'

const Text = ({ tid, className = '', ...rest }) => {
	const { t } = useTranslation()
	const result = t(tid)
	return (
		<span className={`inline ${className}`} {...rest}>
			{result ? result : tid}
		</span>
	)
}

export default Text
