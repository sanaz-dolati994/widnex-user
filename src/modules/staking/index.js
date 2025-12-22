import React, { useMemo, useState } from 'react'

// ** Global dependencies
import useClickOutside from '../../core/hooks/useClickOutside'
import HintBox from '../../components/common/HintBox'
import { useWindowSize } from '../../core/hooks/useWindowSize'
import { formatNumber, stringToNumber, deformatNumber } from '../../core/utils/common'
import { getMainTheme } from '../../core/utils/theme'
import { useMainContext } from '../../core/contexts/main'
import Text from '../../core/utils/Text'
import { useCopyToClipboard } from '../../pages/wallet/utils/useCopyToClipboard'
import CustomTab from '../../components/layouts/Tab/CustomTab'
import { TABLET_SIZE } from '../../core/constants/common'
import { ReactComponent as StakingIcon } from '../../components/common/icons/document-text.svg'
import { ReactComponent as StakingHistoryIcon } from '../../components/common/icons/add.svg'
import { FaHistory } from 'react-icons/fa'
import { FaArrowLeftLong, FaArrowRight } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'
import NewLayout from '../../components/layouts/NewLayout'

const CreateStaking = React.lazy(() => import('./components/CreateStaking'))
const StakingHistory = React.lazy(() => import('./components/StakingHistory'))
const MainLayout = React.lazy(() => import('../../components/layouts/MainLayout'))
const CardLayout = React.lazy(() => import('../../components/layouts/CardLayout'))
const MobileModal = React.lazy(() => import('../../components/layouts/MobileModal'))
const ModalLayout = React.lazy(() => import('../../components/layouts/ModalLayout'))

const tabs = [
  {
    label: 'new-staking',
    content: <CreateStaking />,
    url: '/staking',
    icon: StakingHistoryIcon,
    size: 23
  },
  {
    label: 'staking-history',
    content: <StakingHistory />, // Placeholder for My Contacts content
    url: '/staking-history',
    icon: StakingIcon,
    size: 23
  },
]

const StakingDashboard = () => {
  const navigate = useNavigate()
  const { width } = useWindowSize()
  const {
    main: { lang },
  } = useMainContext()
  const [activeTab, setActiveTab] = useState(0)

  const activeComp = useMemo(() => {
    return tabs[activeTab].content
  }, [activeTab])

  const onBack = () => {
    navigate(-1)
  }

  return (
    <NewLayout className={'relative'}>
      <div className={'lg:grid lg:grid-cols-12 gap-3'}>
        {width > TABLET_SIZE ?
          <div className={'main-border col-span-3 p-3 rounded-md card-bg h-max flex flex-col gap-3'}>
            {
              tabs.map((item, idx) => {
                const active = idx === activeTab
                const Icon = item.icon
                return (
                  <div
                    onClick={() => setActiveTab(idx)}
                    key={item.label}
                    className={`
                          flex items-center gap-2 w-full hover-bg
                          p-3 rounded-md ${active ? 'active-hover-bg' : ''} cursor-pointer
                      `}>
                    <Icon width={item.size} className={`${active ? 'text-blue-500' : ''}`} />
                    <Text tid={item.label} className={'text-sm'} />
                  </div>
                )
              })
            }
          </div>
          :
          <div className={'w-full'}>
            <div className={'p-5 dark:bg-dark flex items-center gap-3 text-sm'}>
              <div onClick={onBack} className='cursor-pointer'>
                <FaArrowRight size={17} />
              </div>
              <span>گنجینه سرمایه</span>
            </div>
            <div className={'flex items-center gap-2 overflow-x-auto px-3 py-5'}>
              {
                tabs.map((item, idx) => {
                  const active = idx === activeTab
                  const Icon = item.icon
                  return (
                    <div
                      onClick={() => setActiveTab(idx)}
                      key={item.label}
                      className={`
                          px-4 py-2 rounded-[20px] active-hover-bg
                          cursor-pointer
                      `}>
                      <Text tid={item.label} className={`text-xs lg:text-sm ${active ? 'text-blue-500' : ''}`} />
                    </div>
                  )
                })
              }
            </div>
          </div>
        }


        <div className={'lg:col-span-9'}>
          {activeComp}
        </div>
      </div>
    </NewLayout>
  )
}

export default StakingDashboard
export {
  useClickOutside,
  HintBox,
  useWindowSize,
  formatNumber,
  stringToNumber,
  deformatNumber,
  MobileModal,
  ModalLayout,
  getMainTheme,
  useMainContext,
  Text,
  MainLayout,
  useCopyToClipboard,
  CardLayout,
}
