import React, { useEffect, useRef } from 'react'
import { TreeItem, TreeWrapper } from '../../styles/Tree'
import useMyInvites from '../../core/hooks/useMyInvites'
import { useTranslation } from 'react-i18next'
import { useProfileQuery } from '../../core/services/react-query/useProfileQuery'
import { useMainContext } from '../../core/contexts/main'

export const InvitedUsersTree = () => {
	const { t } = useTranslation()
	const ref = useRef()
	const {
		main: { lang },
	} = useMainContext()
	const { data: profile } = useProfileQuery()

	const { inviteTree, inviteTreeLoading, refetchInviteTree } = useMyInvites()

	const getLabel = (item) => {
		let label = ''
		if (item.firstName) label += item.firstName
		if (item.lastName) label += ` ${item.lastName}`
		if (label === '' && item.email) {
			label = item.email
		}
		if (label === '' && item.mobile) {
			label = item.mobile
		}

		if (label === '') {
			label = lang === 'en' ? 'anonymous' : 'کاربر احراز هویت نشده'
		}
		return label
	}

	const tree = profile?._id
		? [
				{
					label: t('you'),
					description: getLabel(profile),
					children: !inviteTree?.data?.length
						? []
						: inviteTree.data.map((item) => ({
								label: getLabel(item),
								children: [],
						  })),
				},
		  ]
		: []

	const calculateScrollCenterPosition = () => {
		const treeElement = ref.current

		if (treeElement) {
			const width = treeElement.scrollWidth
			const centeredPosition = (width / 3) * -1

			ref.current.scrollLeft = centeredPosition
		}
	}

	useEffect(() => {
		calculateScrollCenterPosition()

		setTimeout(calculateScrollCenterPosition, 500)
	}, [ref.current])

	useEffect(refetchInviteTree, [])

	return (
		<TreeWrapper ref={ref}>
			<TreeItem>
				{tree.map((item, index) => {
					return <NodeComponent data={item} key={index} />
				})}
			</TreeItem>
		</TreeWrapper>
	)
}
const NodeComponent = ({ data }) => {
	const { label, description, children } = data

	return (
		<li>
			<div className={'node-details'}>
				<div>
					<span>{label}</span>
					<p style={{ fontSize: '0.8rem' }}>{description}</p>
				</div>
			</div>

			{!!children?.length && (
				<ul>
					{children.map((item, index) => (
						<NodeComponent data={item} key={index} />
					))}
				</ul>
			)}
		</li>
	)
}
