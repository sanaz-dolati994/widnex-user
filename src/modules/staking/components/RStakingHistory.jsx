import { MainLayout, CardLayout, Text, useMainContext, formatNumber, getMainTheme  } from '../index'
import { useState } from 'react'
import { useGetUserStakings } from '../core/services'
import Select from '../../global/select/Select'
import { FaFilter } from 'react-icons/fa'
import { ClipLoader } from 'react-spinners'
import { SOCKET_URL } from '../../../core/constants/urls'
import DetailsModal from './DetailsModal'

const RStakingHistory = () => {
  const {
    main: { lang },
  } = useMainContext()
  const [status, setStatus] = useState('')
  const options = ['CREATED', 'DONE']

  const { data: stakings, isLoading } = useGetUserStakings({
    search: { status: 'status' },
    query: { status },
  })

  const initialDetailsModal = { data: null, open: false }
  const [detailsModal, setDetailsModal] = useState(initialDetailsModal)
  const openDetailsModal = (data) => setDetailsModal({ data, open: true })
  const closeDetailsModal = () => setDetailsModal(initialDetailsModal)

  return (
    <MainLayout>
      <CardLayout className={'p-3'}>
        <DetailsModal
          data={detailsModal.data}
          open={detailsModal.open}
          onClose={closeDetailsModal}
        />

        <div className={'flex items-center justify-end'}>
          <Select
            placeholder={'select-status'}
            options={options}
            icon={<FaFilter size={14} />}
            value={status}
            onChange={setStatus}
          />
        </div>

        <div className={'w-full relative'}>
          {isLoading ? (
            <div
              className={
                'absolute left-0 top-0 h-[200px] w-full flex items-center justify-center backdrop-blur'
              }
            >
              <ClipLoader color={getMainTheme().active} size={20} />
            </div>
          ) : null}
          {stakings?.length ? (
            stakings?.map((item) => {
              return (
                <div
                  key={item._id}
                  className={
                    'grid grid-cols-6 dark:bg-darkSecondBg rounded items-center dark:test-slate-100 text-xs font-semibold gap-2 p-3 my-2'
                  }
                >
                  <div className={'flex items-center col-span-2 gap-2 justify-center'}>
                    <img
                      src={
                        item.currency === 'irt'
                          ? require('../../../assets/images/tooman.png')
                          : SOCKET_URL + `assets/icon/${item?.currency?.toLowerCase()}.png`
                      }
                      alt={item.currency}
                      width={32}
                      height={32}
                    />
                    <span>{item.currency.toUpperCase()}</span>
                  </div>

                  <div className={'col-span-2 flex justify-center'}>
                    <span className={'text-center'}>
                      {formatNumber(item.amount, { type: item.currency })}
                    </span>
                  </div>
                  <div className={'col-span-2 flex justify-end'}>
                    <span className={'text-center'}>
                      <span>{item.periodDays}</span>
                      <span> </span>
                      <Text tid={'days'} />
                    </span>
                  </div>

                  <div className={'col-span-6 h-[1px] bg-slate-500 bg-opacity-20 my-1'} />

                  <div className={'col-span-3'}>
                    <span className={'text-center'}>
                      {`${new Date(item.createdAt).toLocaleString(
                        lang === 'fa' ? 'fa-IR' : 'en-US'
                      )}`}
                    </span>
                  </div>

                  <div
                    onClick={() => openDetailsModal(item)}
                    className={'col-span-3 flex justify-end'}
                  >
                    <Text
                      tid={'profit-detail'}
                      className={'cursor-pointer text-center underline text-active'}
                    />
                  </div>
                </div>
              )
            })
          ) : (
            <div className={'flex items-center justify-center min-h-[200px]'}>
              <img
                src={require('../../../assets/images/noData.png')}
                alt={'no-data'}
                width={92}
                height={92}
              />
            </div>
          )}
        </div>
      </CardLayout>
    </MainLayout>
  )
}

export default RStakingHistory
