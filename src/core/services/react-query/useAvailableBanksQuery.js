import { useMutation, useQuery } from 'react-query'
import { useMainContext } from '../../contexts/main'
import { normalFetch } from '../fetch-api/get'
import { deleteApi } from '../fetch-api/delete'
import { useQueryContext } from '../../contexts/query'
import { postApiWithToken } from '../fetch-api/post'

const useAvailableBanksQuery = () => {
	return useQuery('fetch-available-banks', () => normalFetch(null, `settings/banks`), {
		select: (res) => res.data,
		refetchOnWindowFocus: false,
	})
}

export { useAvailableBanksQuery }
