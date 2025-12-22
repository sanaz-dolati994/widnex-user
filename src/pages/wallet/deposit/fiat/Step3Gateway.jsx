import ChooseAccount from '../../utils/ChooseAccount'
import StepBtns from './StepBtns'
import React from 'react'
import { PortLogo } from '../../../../styles/CoinOperationStyles'

const Step3Gateway = ({
	bankAccount,
	setBankAccount,
	onAction,
	onBack,
	ports,
	port,
	setPort,
	depositLoading,
}) => {
	return (
		<div className={'mx-auto max-w-[520px] flex flex-col gap-10 items-center'}>
			<div className={'mx-auto'}>
				<ChooseAccount
					label={'choose-bank-account'}
					type={'bank'}
					onOptionChange={setBankAccount}
					value={bankAccount}
				/>
			</div>
			{ports.length ? (
				<div className={'w-full flex items-center justify-center gap-4 flex-wrap'}>
					{ports.map((p) => {
						const active = p.id === port
						if (!p.isActive) {
							return null
						}
						return (
							<PortLogo active={active} onClick={() => setPort(p.id)}>
								{bankLogos[p.id] && <img src={bankLogos[p.id]} alt=' ' width='75%' />}
							</PortLogo>
						)
					})}
				</div>
			) : null}

			<div className={'w-full'}>
				<StepBtns onBack={onBack} onNext={onAction} nextTid={'pay'} loading={depositLoading} />
			</div>
		</div>
	)
}

const bankLogos = {
	zibal: require('../../../../assets/images/zibal-logo.png'),
	nextPay: require('../../../../assets/images/nextpay-logo.png'),
	vandar: require('../../../../assets/images/vandar-logo.png'),
}

export default Step3Gateway
