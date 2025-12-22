import { useState } from 'react'
import { useMainContext } from '../../core/contexts/main'
import { useQueryContext } from '../../core/contexts/query'
import { Column, Row } from '../../styles/TableStyle'
import { FlexCenter, Padding } from '../../styles/CommonStyles'
import { Market, TextWithMargin } from '../../styles/OrdersStyle'
import { SOCKET_URL } from '../../core/constants/urls'
import Text from '../../core/utils/Text'
import TruncateMiddle from '../common/TruncateMiddle'
import { formatDate, formatNumber } from '../../core/utils/common'
import { DetailsButton, DetailsIcon, DetailText } from '../../styles/TransactionHistoryStyles'
import ReactMarkdown from 'react-markdown'
import MobileModal from '../modals/MobileModal'
import { HorizontalLine, ItemRow } from '../../styles/newStyles/MobileModal.styled'

const initialModalState = { show: false, data: null }

export const RTransfersTable = ({ data, profileId }) => {
	const [modal, setModal] = useState(initialModalState)

	const {
		main: { lang },
	} = useMainContext()

	const { setToast } = useQueryContext()

	const onCopyToClipboard = (value) => {
		navigator.clipboard.writeText(value)
		setToast({
			show: true,
			message: 'copy-success',
		})
	}

	return (
		<>
			{data.map((item, idx) => {
				const isToman = item.currency === 'irt'
				const isReceiver = profileId === item?.toId

				return (
					<Row className='odd:bg-body dark:odd:bg-[#ffffff02] odd:rounded-xl flex ' key={item._id}>
						<Column className='rounded-r-xl w-[20%] flex justify-center items-center'>
							<FlexCenter>
								<img
									src={
										isToman
											? require('../../assets/images/tooman.png')
											: SOCKET_URL + `assets/icon/${item.currency}.png`
									}
									alt={item.currency}
									className='w-5 h-5'
								/>
								<Market className='text-sm font-medium m-1'>{item.currency.toUpperCase()}</Market>
							</FlexCenter>
						</Column>

						<Column className={`flex flex-col gap-y-2 text-sm w-[25%]`}>
							<Text tid='transfer-type' className='text-pcolor-light text-sm' />
							<FlexCenter>
								<TextWithMargin type={isReceiver ? 'receive' : 'send'}>
									{isReceiver ? <Text tid='receive' /> : <Text tid='send' />}
								</TextWithMargin>
							</FlexCenter>
						</Column>

						<Column number className='flex flex-col gap-y-2 text-xs w-[25%]'>
							{/* <Text tid='date' className='text-pcolor-light text-sm' /> */}
							<span> {formatDate(item.createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}</span>
							<span>{formatDate(item.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}</span>
						</Column>
						<Column number className='flex flex-col gap-y-2 text-sm w-[20%]'>
							<Text tid='amount' className='text-pcolor-light text-sm' />
							{item.amount ? formatNumber(item.amount) : '--'}
						</Column>

						<Column className='rounded-l-xl flex items-center w-[10%]'>
							<FlexCenter onClick={() => setModal({ show: true, data: item })}>
								<DetailsIcon size={22} />
							</FlexCenter>
						</Column>
					</Row>
				)
			})}

			<MobileModal isOpen={modal.show} onClose={() => setModal(initialModalState)}>
				<FlexCenter width='100%'>
					<Padding padding='10px 0' style={{ borderBottom: '1px solid #ffffff15' }}>
						<DetailText>
							<Text tid='see-details' />
						</DetailText>
					</Padding>
				</FlexCenter>
				<div className='p-2 bg-slate-100 dark:bg-transparent rounded-xl mb-4'>
					<ItemRow className='dark:border-b dark:border-card-border'>
						<div>
							<Text tid='coin' className='text-pcolor-light text-sm' />
						</div>
						<FlexCenter>
							<img
								src={
									modal.data?.currency === 'irt'
										? require('../../assets/images/tooman.png')
										: SOCKET_URL + `assets/icon/${modal.data?.currency}.png`
								}
								alt={modal.data?.currency}
								className='w-6 h-6'
							/>
							<Market>{modal.data?.currency.toUpperCase()}</Market>
						</FlexCenter>
					</ItemRow>
					<ItemRow className='dark:border-b dark:border-card-border'>
						<Text tid='transfer-type' className='text-pcolor-light text-sm' />
						<FlexCenter>
							<TextWithMargin type={modal.data?.toId === profileId ? 'receive' : 'send'}>
								{modal.data?.toId === profileId ? <Text tid='receive' /> : <Text tid='send' />}
							</TextWithMargin>
						</FlexCenter>
					</ItemRow>
					<ItemRow className='dark:border-b dark:border-card-border'>
						<Text
							tid={modal.data?.toId === profileId ? 'sender' : 'receiver'}
							className='text-pcolor-light text-sm'
						/>
						<FlexCenter className='text-sm'>
							{modal.data?.toId === profileId
								? `${modal.data?.from.firstName || '--'} ${modal.data?.from.lastName || '--'}`
								: `${modal.data?.to.firstName || '--'} ${modal.data?.to.lastName || '--'}`}
						</FlexCenter>
					</ItemRow>
					<ItemRow className='dark:border-b dark:border-card-border'>
						<Text tid='id' className='text-pcolor-light text-sm' />
						<TruncateMiddle
							text={modal.data?._id}
							frontChars={6}
							backChars={6}
							onClick={onCopyToClipboard.bind(null, modal.data?._id)}
						/>
					</ItemRow>
					<ItemRow className='dark:border-b dark:border-card-border'>
						<Text tid='date' className='text-pcolor-light text-sm' />
						{formatDate(modal.data?.createdAt, 'date', lang === 'en' ? 'en-US' : 'fa-IR')}
					</ItemRow>
					<ItemRow className='dark:border-b dark:border-card-border'>
						<Text tid='timeHour' className='text-pcolor-light text-sm' />
						{formatDate(modal.data?.createdAt, 'time', lang === 'en' ? 'en-US' : 'fa-IR')}
					</ItemRow>
					<ItemRow>
						<Text tid='amount' className='text-pcolor-light text-sm' />
						{modal.data?.amount ? formatNumber(modal.data?.amount) : '--'}
					</ItemRow>
				</div>
				<DetailsButton
					onClick={() => setModal(initialModalState)}
					className='bg-gray-light dark:bg-white/10 dark:text-white text-cBlue w-full rounded-lg'
				>
					<Text tid='close' />
				</DetailsButton>
			</MobileModal>
		</>
	)
}
