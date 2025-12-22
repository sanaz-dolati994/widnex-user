import React, { useEffect, useState } from 'react'
import Slider from '../Slider'
import Text from '../../core/utils/Text'
import { CardWithColor, Input, RoundedIconButtonWithColor } from '../../styles/InvitesStyle'
import { Flex } from '../../styles/CommonStyles'
import useMyInvites from '../../core/hooks/useMyInvites'
import {p2e} from "../../core/utils/common";
import { Heading } from '../../styles/newStyles/Dashboard.styled'
import { RxCross1 } from "react-icons/rx";


const CreateInviteCodeModal = ({ setShowCreateModal, onClose }) => {
	const { createInviteCode, isCreating } = useMyInvites()

	const [sliderValue, setSliderValue] = useState(0)

	const [maxUse, setMaxUse] = useState('')

	const [actorShare, setActorShare] = useState(0)
	const [objectShare, setObjectShare] = useState(0)

	const calculateShares = () => {
		setObjectShare(parseInt(sliderValue))
		setActorShare(parseInt(100 - sliderValue))
	}

	const handleForm = (e) => {
		e.preventDefault()

		if (isCreating || maxUse < 1) {
			return false
		}

		try {
			createInviteCode({ maxUse: parseInt(maxUse), actorShare, objectShare })
			setShowCreateModal(false)
		} catch (e) {}
	}

	useEffect(calculateShares, [sliderValue])

	return (
		<div style={{ width: '100%' }} className={''}>
			<form onSubmit={handleForm}>
				<Heading className='mb-10'>
					<h3>
						<Text tid="new-invite-code" />
					</h3>
					<RxCross1 color='rgba(46, 51, 68, 1)' className='cursor-pointer' onClick={onClose}/>
				</Heading>
				<p className={'text-sm'}>
					<Text tid={'specify-invite-code-shares'} />
				</p>
				<div className={'my-5'}>
					<Slider val={sliderValue} onSliderChange={(value) => setSliderValue(value)} />
				</div>
				<Flex className={'gap-5'}>
					<CardWithColor className={'grow text-center bg-gray-light dark:bg-[#EFF3F826]'}>
						<div className={'mb-4'}>
							<Text tid={'actorShare'} />
						</div>
						<div>{actorShare} درصد</div>
					</CardWithColor>
					<CardWithColor className={'grow text-center bg-gray-light dark:bg-[#EFF3F826]'}>
						<div className={'mb-4'}>
							<Text tid={'objectShare'} />
						</div>
						<div>{objectShare} درصد</div>
					</CardWithColor>
				</Flex>
				<div className={'mt-5 mb-7'}>
					<label className={'text-sm mb-1 block'}>
						<Text tid={'specify-invite-code-max-usage'} />
					</label>
					<Input
					className='border border-light-border'
						value={maxUse}
						onChange={(e) => {
							setMaxUse(p2e(e?.target?.value))
						}}
						placeholder='تعداد دفعات مجاز'
					/>
				</div>
				<RoundedIconButtonWithColor className='w-full h-10 rounded-lg' type={'submit'} textColor={'#fff'} color={'mainOrange'}>
					<Text tid={'create-invite-code'} />
				</RoundedIconButtonWithColor>
			</form>
		</div>
	)
}

export default CreateInviteCodeModal
