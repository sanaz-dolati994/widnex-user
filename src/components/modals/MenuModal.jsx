import { Fragment } from 'react'
import { HorizontalLine, ItemData, LinkItemRow } from '../../styles/newStyles/MobileModal.styled'
import { LINKS } from '../layouts/NewSidebar'
import Text from '../../core/utils/Text'
import { FaChevronLeft } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useEffect } from 'react'

export default function MenuModal() {
	const [activeLinkIndex, setActiveLinkIndex] = useState(-1)
	const { pathname } = useLocation()

	useEffect(() => {
		if (pathname === '/dashboard') setActiveLinkIndex(0)
		else if (pathname === '/otc') setActiveLinkIndex(1)
		else if (pathname === '/authentication') setActiveLinkIndex(2)
		else if (
			pathname.startsWith('/wallets') ||
			pathname === '/transaction-history' ||
			pathname === '/log'
		)
			setActiveLinkIndex(4)
		else if (pathname.startsWith('/profile')) setActiveLinkIndex(5)
		else if (pathname === '/notifications') setActiveLinkIndex(6)
	}, [pathname])

	const renderedItems = LINKS.map((item, index, array) => {
		const { Icon } = item
		return (
			<Fragment key={item.text}>
				<LinkItemRow to={item.href}>
					<ItemData>
						<Icon color={activeLinkIndex === index ? '#0773F1' : '#A6A9B9'} />
						<Text tid={item.text} />
					</ItemData>
					<FaChevronLeft />
				</LinkItemRow>
				{index !== array.length - 1 && <HorizontalLine />}
			</Fragment>
		)
	})

	return <ul className='flex flex-col gap-y-2'>{renderedItems}</ul>
}
