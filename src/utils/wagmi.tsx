import React from 'react'
import memoize from 'lodash/memoize'
import { Web3Provider } from '@ethersproject/providers'
import useSWRImmutable from 'swr/immutable'
import { WagmiConfig, configureChains, useAccount, useNetwork, Chain, createClient } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { WALLET_CONNECT_PROJECT_ID } from '@/config/constants'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'

// 1. Get projectId
export const projectId = WALLET_CONNECT_PROJECT_ID
export const { chains, provider } = configureChains([polygon], [publicProvider()])
export const wagmiConfig = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    provider
})

// const CHAINS = [mumbai]

// export const { provider, chains } = configureChains(CHAINS, [
//     jsonRpcProvider({
//         rpc: (chain) => {
//             return { http: chain.rpcUrls.default.http[0] }
//         }
//     })
// ])

// const client = createClient(
//     getDefaultClient({
//         appName: 'Your App Name',
//         chains: [mumbai]
//     })
// )

// export const { chains, provider, webSocketProvider } = configureChains(
//     [mumbai],
//     [
//       alchemyProvider({ apiKey: 'Z6yu7z2TJ5LunFNjBzeZQDMgSrJbTIA3' }),
//       publicProvider(),
//     ]
//   )

//   const metaMaskConnector = new MetaMaskConnector({
//     chains
//   })

//   const injectedConnector = new InjectedConnector({
//     chains,
//     options: {
//       name: 'Injected',
//       shimDisconnect: true,
//     },
//   })

//   const coinbaseConnector = new CoinbaseWalletConnector({
//     chains,
//     options: {
//       appName: 'Seven Dex Frontend',
//     },
//   })

//   const walletConnectConnector = new WalletConnectConnector({
//     chains,
//     options: {
//       projectId: '7ae3303dbf2625e3fecdee1a179fcb97',
//     },
//   })

//   const client = createClient({
//     autoConnect: false,
//     connectors: [
//       metaMaskConnector,
//       injectedConnector,
//       coinbaseConnector,
//       walletConnectConnector,
//     ],
//     provider,
//     webSocketProvider
//   })

export const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = memoize((chainId) => CHAIN_IDS.includes(chainId))

export function WagmiProvider(props: React.PropsWithChildren) {
    return (
        <WagmiConfig client={wagmiConfig}>
            <Web3LibraryProvider>{props.children}</Web3LibraryProvider>
        </WagmiConfig>
    )
}

const Web3LibraryContext = React.createContext<Web3Provider | undefined>(undefined)

export const useWeb3LibraryContext = () => {
    return React.useContext(Web3LibraryContext)
}

const Web3LibraryProvider: React.FC<React.PropsWithChildren> = (props) => {
    const { connector } = useAccount()
    const { chain } = useNetwork()
    const { data: library } = useSWRImmutable(connector && ['web3-library', connector, chain], async () => {
        const provider = await connector?.getProvider()
        return new Web3Provider(provider)
    })
    return <Web3LibraryContext.Provider value={library}>{props.children}</Web3LibraryContext.Provider>
}
