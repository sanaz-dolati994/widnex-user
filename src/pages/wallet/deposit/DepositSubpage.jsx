import { useEffect, useState } from 'react'
import Card from '../../../components/common/Card'
import TransactionsOverview from '../../../components/dashboard/TransactionsOverview'
import Text from '../../../core/utils/Text'
import { HorizontalLine } from '../../../styles/newStyles/MobileModal.styled'
import { useDepositFiat } from '../utils/hooks'
import TwoFactorModal from '../../../components/modals/TwoFactorModal'
import DepositFiat from './fiat/NewDepositFiat'
import DepositCoin from './coin/NewDepositCoin'
import { Link, useSearchParams } from 'react-router-dom'
import DepositOffline from './offline'
import { useUserDepositsByReceipt } from '../../../core/services/react-query/useTransferConfig'
import { Heading } from '../../../styles/newStyles/Dashboard.styled'
import { FaArrowUp } from 'react-icons/fa'
import { formatDate, formatNumber } from '../../../core/utils/common'
import { useMainContext } from '../../../core/contexts/main'
import { Status } from './state'
import HintBox from '../../../components/common/HintBox'
import useInfiniteScroll from '../../../core/hooks/useInfiniteScroll'
import { CgSpinner } from 'react-icons/cg'
import onlineDeposit from './online-deposit'
import { CopyIcon } from '../../../components/common/icons'
import { useCopy } from '../../../core/hooks/useCopy'

export default function DepositSubpage() {
	const [searchParams] = useSearchParams();
	const paramsTab = searchParams.get('tab');
	const initialTabState = !!paramsTab ? (paramsTab === 'coin' ? 1 : 0) : 0;
	const [activeTab, setActiveTab] = useState(initialTabState);

	const {
		depositType,
		setDepositType,
		authModal,
		setAuthModal,
		onSubmitTwoFactorModal,
	} = useDepositFiat();

	useEffect(() => {
		if (activeTab === 1) {
			setDepositType('bank-gateway');
		} else if (activeTab === 3) {
			setDepositType('deposit-id');
		} else setDepositType('');
	}, [activeTab, setDepositType]);

	const handleTabChange = (index) => {
		if (index === 1) {
			setDepositType('bank-gateway');
		} else if (index === 3) {
			setDepositType('deposit-id');
		} else setDepositType('');

		setActiveTab(index);
	};

	const Components = [onlineDeposit, DepositOffline, DepositFiat, DepositCoin, DepositFiat]
	const tabs = ["online-deposit", "user-deposits-by-receipt", "recent-transactions", "recent-deposits",];
	const tabstype = ["bank", "wallet"];
	const ActiveComponent = Components[activeTab];
	const activeList = {
		heading: tabs[activeTab % tabs.length],
		type: tabstype[activeTab % tabs.length]
	}

	return (
		<>
			<Card className={'col-span-3 lg:h-full lg:overflow-y-auto'}>
				<h2 className='font-semibold'>
					<Text tid='deposit-type' />
				</h2>
				<div className='flex items-center text-xs lg:text-base justify-start gap-x-3 lg:gap-x-8 mt-4'>
					<TabBar activeTab={activeTab} onTabChange={handleTabChange} />
				</div>
				<HorizontalLine />

				<ActiveComponent depositType={depositType} />

				<TwoFactorModal
					open={authModal}
					onSubmit={onSubmitTwoFactorModal}
					onClose={() => setAuthModal(false)}
					cause={'deposit'}
				/>
			</Card>
			<Card padding='px-0' className={'col-span-2 lg:h-full lg:overflow-y-auto'}>
				{activeList.heading === "user-deposits-by-receipt" ?
					<UserDepositsByReceipt /> :
					<TransactionsOverview
						heading={activeList.heading}
						narrow
						type={activeList.type}
						filter={'wallet-deposit'}
					/>}
			</Card>
		</>
	);
}

const UserDepositsByReceipt = () => {
	const copy = useCopy();
	const { main: { lang } } = useMainContext()
	const { data, hasNextPage, fetchNextPage, isFetching } = useUserDepositsByReceipt();

	const { getItemRef } = useInfiniteScroll({
		loading: isFetching,
		hasMore: hasNextPage,
		setPage: fetchNextPage,
	});


	if (!data) return null
	return (
		<div className=' overflow-hidden h-full flex flex-col'>

			<div className='p-4 overflow-y-auto h-full'>
				<Heading>
					<h2
						className={`text-heading dark:text-pColor font-bold text-sm `}>
						<Text tid={""} />
					</h2>

					<Link
						to='/transaction-history'
						className={`text-xs text-cBlue`}>
						{/* <Text tid='all-transactions' /> */}
					</Link>
				</Heading>

				<div className='relative mt-6'>
					{data?.length > 0 ? (
						data.map((item, key) => (
							<div ref={getItemRef(key, data.length)} key={key} className='flex flex-col justify-center gap-4 mb-4 last:mb-0 bg-gray-light dark:bg-hintBg-dark p-4 rounded-md'>
								<div
									className='flex items-center justify-between gap-x-2 '>
									<div className='w-10 h-10 rounded-full bg-primary dark:bg-heading flex items-center justify-center'>
										<FaArrowUp color='#11f344' />
									</div>

									<div className='flex flex-col gap-2 ml-auto'>
										<div className='flex gap-3 items-center'>
											<Text
												tid={"واریز آفلاین"}
												className='text-heading dark:text-pColor font-semibold text-sm'
											/>
											<div onClick={() => copy(item.transactionId)} className='cursor-pointer text-2xs flex items-center justify-center gap-2 '>
												<CopyIcon />
												<div className='max-w-20 overflow-hidden truncate'>
													<span className='' >{item.transactionId}</span>
												</div>
											</div>
										</div>
										<p className='flex items-center gap-x-1 text-black/50 dark:text-pColor/40 text-sm'>
											<span>
												{formatDate(
													new Date(Number(item.createdAt.seconds) * 1000),
													'time',
													lang === 'en' ? 'en-US' : 'fa-IR'
												)} - {formatDate(
													new Date(Number(item.createdAt.seconds) * 1000),
													'date',
													lang === 'en' ? 'en-US' : 'fa-IR'
												)}
											</span>
										</p>
									</div>

									<div className='flex flex-col items-end'>
										<div className='flex items-center gap-x-1'>
											<span className='text-lg font-bold text-heading dark:text-pColor'>
												{formatNumber(item.amount)}
											</span>
											<Text
												tid='tooman'
												className='text-black/50 dark:text-pColor/40 text-sm'
											/>
										</div>
										<Status state={item.state} className="text-xs" />
									</div>
								</div>
								{item.adminNote &&
									<HintBox row className=' gap-2' type='warn' heading='پیام ادمین' body={item.adminNote} />
								}
							</div>
						))
					) : (
						<div className='text-center my-5'>
							<Text tid='no-data' />
						</div>
					)}
					{isFetching && <div className='text-center my-5 relative'>
						<CgSpinner className='animate-spin mx-auto size-9' /></div>}
				</div>
			</div>
		</div >
	)
}

const TABS = ["online-deposit", "deposit-offline", 'toman-gateway', 'depositCoin', 'deposit-id',]

const TabBar = ({ onTabChange, activeTab }) => {
	return TABS.map((tab, index) => {
		return (
			<h3
				className={`${activeTab === index ? 'text-cBlue border-cBlue' : 'border-transparent'
					} cursor-pointer border-b-2 transition pb-2 flex-1 text-center lg:flex-none`}
				onClick={onTabChange.bind(null, index)}
			>
				<Text tid={tab} />
			</h3>
		);
	});
};
