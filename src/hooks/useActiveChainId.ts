import { ChainId } from '@/config/constants/chains'
import { atom, useAtomValue } from 'jotai'
// import { useRouter } from 'next/router'
import { useLocation } from 'react-router-dom'
import { useDeferredValue, useMemo } from 'react'
import { isChainSupported } from '@/utils/wagmi'
import { useNetwork } from 'wagmi'
import { getChainId } from '@/config/constants/chains'
import { useSessionChainId } from './useSessionChainId'

const queryChainIdAtom = atom(-1) // -1 unload, 0 no chainId on query

queryChainIdAtom.onMount = (set) => {
    const params = new URL(window.location.href).searchParams
    let chainId
    // chain has higher priority than chainId
    // keep chainId for backward compatible
    const c = params.get('chain')
    if (!c) {
        chainId = params.get('chainId')
    } else {
        chainId = getChainId(c)
    }
    if (isChainSupported(+chainId)) {
        set(+chainId)
    } else {
        set(0)
    }
}

export function useLocalNetworkChain() {
    const [sessionChainId] = useSessionChainId()
    // useRouter is kind of slow, we only get this query chainId once
    const queryChainId = useAtomValue(queryChainIdAtom)

    const { search } = useLocation()
    const searchParams = useMemo(() => new URLSearchParams(search), [search])

    const chainId = +(sessionChainId || getChainId(searchParams.get('chain') as string) || queryChainId)

    if (isChainSupported(chainId)) {
        return chainId
    }

    return undefined
}

export const useActiveChainId = () => {
    const localChainId = useLocalNetworkChain()

    const { chain } = useNetwork()
    const chainId = ChainId.POLYGON

    const isNotMatched = useDeferredValue(chain && localChainId && chain.id !== localChainId)

    return {
        chainId,
        isWrongNetwork: chain?.unsupported ?? false,
        isNotMatched
    }
}
