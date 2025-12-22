import { useLocation, useNavigate } from 'react-router-dom'
import { useMainContext } from '../core/contexts/main'
import { getMainTheme } from '../core/utils/theme'
import { ThemeProvider } from 'styled-components'
import { MainBody } from '../styles/layout-styles/CommonStyles'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import useBankCallback from '../core/hooks/useBankCallback'
import { Flex } from '../styles/CommonStyles'
import { CardHeaderAlert, CardWithColor, TextWithColor } from '../styles/InvitesStyle'
import Text from '../core/utils/Text'
import { Button } from '../styles/SecurityStyles'
import { formatDate, formatNumber } from '../core/utils/common'

function useQuery() {
	const { search } = useLocation()

	return useMemo(() => new URLSearchParams(search), [search])
}

const BankCallback = () => {
	const {
		main: { theme, lang },
	} = useMainContext()

	const query = useQuery()
	const [gateway] = useState(query.get('gateway'))

	const navigate = useNavigate()
	const navigateToDashboard = () => {
		navigate('/user/')
	}

	const [isSucceed, setIsSucceed] = useState(true)
	const [title, setTitle] = useState('succeed')
	const [description, setDescription] = useState('thanks-for-payment')
	const [color, setColor] = useState('mainGreen')
	const [icon, setIcon] = useState(<FaCheck />)

	const [success] = useState(query.get('success'))

	const [npStatus] = useState(query.get('np_status'))

	const [id] = useState(
		query.get('trackId') ||
		query.get('tracking_code') ||
		query.get('trans_id') ||
		query.get('token') ||
		query.get('Authority')
	)
	const [orderId] = useState(query.get('orderId') || query.get('order_id') || query.get('Authority'))

	const { bankCallback } = useBankCallback({
		id: query.get('gateway') === 'payStar' ? query.get('ref_num') : id,
		cardNo: query.get('card_number'),
		gateway: query.get('gateway'),
		trackingCode: query.get('tracking_code'),
	})

	const setFailOptions = () => {
		setIsSucceed(false)
		setColor('mainRed')
		setTitle('failed')
		setDescription(bankCallback?.data?.description || 'fail-reason')
		setIcon(<FaTimes />)
	}

	const statusHandler = () => {
		if (parseInt(success) === 0 || npStatus === 'Unsuccessful' || query.get('Status') === 'NOK') {
			setFailOptions()
		}
		if (bankCallback && !bankCallback.success) {
			setFailOptions()
		}
	}

	const info = [
		{ label: 'price', value: formatNumber(bankCallback?.data?.amount) || undefined },
		// { label: 'fee', value: bankCallback?.data?.amount || 'fee' },
		{
			label: 'date',
			value:
				formatDate(
					bankCallback?.data?.createdAt ||
					bankCallback?.modifiedAt ||
					bankCallback?.data?.modifiedAt ||
					bankCallback?.data?.data?.modifiedAt ||
					new Date().toISOString()
				) || undefined,
		},
		{
			label: 'description',
			value: bankCallback?.data?.description || undefined,
		},
		{ label: 'status', value: title },
		{ label: 'gateway', value: gateway },
		{ label: 'trackId', value: id },
		{ label: 'orderId', value: orderId },
	]

	useEffect(statusHandler, [bankCallback])

	// ?gateway=zibal&success=1&status=2&trackId=2959687882&orderId=627b5aed8e567660225aa3dc
	// 	?gateway=zibal&success=0&status=3&trackId=2959691384&orderId=627b5c1e0b968f6075a1255f

	return (
		<>
			<ThemeProvider theme={getMainTheme(theme, lang)}>
				<MainBody>
					<Flex
						justify={'center'}
						align={'center'}
						className={'min-w-screen min-h-screen p-5 mt-10'}
					>
						<div className={'max-w-[648px] w-full'}>
							<CardWithColor className={'grow p-0'} color={'secondaryBg'}>
								<CardHeaderAlert className={'text-center'} color={'black'} bgColor={color}>
									<span>{icon}</span>
								</CardHeaderAlert>
								<div className={'p-5 text-center'}>
									<TextWithColor color={color}>
										<Text tid={title} />
									</TextWithColor>
									<p>
										<Text tid={description} />
									</p>
								</div>
							</CardWithColor>

							<CardWithColor className={'grow mt-5 p-0'} color={'secondaryBg'}>
								<div className={'p-5 text-center'}>
									{!!isSucceed && (
										<>
											<TextWithColor color={'mainOrange'}>
												<Text tid={'transaction-details'} />
											</TextWithColor>

											<div className={'mt-5'}>
												{info.map((item, index) => {
													const { label, value } = item
													if (value)
														return (
															<Fragment key={index}>
																<Flex wrap align={'center'} justify={'between'}>
																	<span>
																		<Text tid={label} />
																	</span>
																	<span>
																		<TextWithColor
																			color={'mainOrange'}
																			style={{ direction: 'ltr' }}
																		>
																			<Text tid={value} /> {label === 'price' ? 'IRT' : ''}
																		</TextWithColor>
																	</span>
																</Flex>
																<hr className={'my-3 opacity-10'} />
															</Fragment>
														)
												})}
											</div>
										</>
									)}

									<Flex justify={'center'}>
										<Button onClick={navigateToDashboard}>
											<Text className={'inline-block'} tid={'back-to-panel'} />
										</Button>
									</Flex>
								</div>
							</CardWithColor>
						</div>
					</Flex>
				</MainBody>
			</ThemeProvider>
		</>
	)
}

export default BankCallback
