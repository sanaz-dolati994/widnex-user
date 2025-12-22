import { useMutation, useQuery } from 'react-query'
import { filterFetch, normalFetch } from '../../../core/services/fetch-api/get'
import { postApiWithToken } from '../../../core/services/fetch-api/post'
import { useMainContext } from '..'
import { useQueryContext } from '../../../core/contexts/query'

export const stakingKeys = {
  getStakingPlans: 'getStakingPlans',
  createStake: 'createStake',
  getUserStaking: 'getUserStaking',
  getUserStake: 'getUserStake',
}

export const useGetStakingPlans = () => {
  const {
    profile: { token },
  } = useMainContext()

  return useQuery({
    queryFn: () => normalFetch(token, 'settings/staking'),
    queryKey: [stakingKeys.getStakingPlans],
    select: (res) => res?.data?.data,
  })
}

export const useCreateStake = (onSuccess = () => { }) => {
  const {
    profile: { token },
  } = useMainContext()
  const { setToast } = useQueryContext()

  return useMutation({
    mutationFn: (p) => postApiWithToken(p, token, 'staking'),
    mutationKey: [stakingKeys.createStake],
    onSuccess: () => {
      setToast({ message: 'operation-success', show: true })
      onSuccess()
    },
  })
}

export const useGetUserStakings = (params = {}) => {
  const {
    profile: { token },
  } = useMainContext()

  return useQuery({
    queryFn: () => filterFetch(params, token, 'staking'),
    queryKey: [stakingKeys.getUserStaking, params],
    select: (res) => res?.data?.data,
  })
}

export const useGetUserStake = (id) => {
  const {
    profile: { token },
  } = useMainContext()

  return useQuery({
    queryFn: () => normalFetch(token, `staking/${id}`),
    queryKey: [stakingKeys.getUserStake, id],
    select: (res) => res?.data?.data,
    enabled: !!id,
  })
}
