import { nanoid } from '@reduxjs/toolkit'
import { useCallback } from 'react'
import { fetchTokenList } from './actions'
import { TokenList } from '@/utils/token'

function useFetchListCallback(
    dispatch: (action?: unknown) => void,
): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
    // note: prevent dispatch if using for list search or unsupported list
    return useCallback(
        async (listUrl: string, sendDispatch = true) => {
            const requestId = nanoid()
            if (sendDispatch) {
                dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
            }
            // lazy load avj and token list schema
            const getTokenList = (await import('./getTokenList')).default
            return getTokenList(listUrl)
                .then((tokenList) => {
                    if (sendDispatch) {
                        dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
                    }
                    return tokenList
                })
                .catch((error) => {
                    console.error(`Failed to get list at url ${listUrl}`, error)
                    if (sendDispatch) {
                        dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }))
                    }
                    throw error
                })
        },
        [dispatch],
    )
}

export default useFetchListCallback
