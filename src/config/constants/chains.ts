import { Chain } from 'wagmi'
import memoize from 'lodash/memoize'
import invert from 'lodash/invert'

export enum ChainId {
    ETHEREUM = 1,
    GOERLI = 5,
    POLYGON = 137,
    MUMBAI = 80001,
    SVC = 36
}

export const CHAIN_QUERY_NAME = {
    [ChainId.ETHEREUM]: 'eth',
    [ChainId.GOERLI]: 'goerli',
    [ChainId.POLYGON]: 'polygon',
    [ChainId.MUMBAI]: 'mumbai',
    [ChainId.SVC]: 'svc'
} as Record<ChainId, string>

const CHAIN_QUERY_NAME_TO_ID = invert(CHAIN_QUERY_NAME)

export const getChainId = memoize((chainName: string) => {
    if (!chainName) return undefined
    return CHAIN_QUERY_NAME_TO_ID[chainName] ? +CHAIN_QUERY_NAME_TO_ID[chainName] : undefined
})

export const DEFAULT_CHAIN_ID = 137
export const DEFAULT_PROVIDER = 'https://polygon-rpc.com/'

const explorer = { name: 'PolygonScan', url: 'https://polygonscan.com/' }

export const polygon: Chain = {
    id: 137,
    name: 'Polygon Chain',
    network: 'polygon',
    rpcUrls: {
        public: { http: ['https://polygon-mainnet-public.unifra.io'] },
        default: { http: ['https://polygon-rpc.com/'] }
    },
    blockExplorers: {
        default: explorer,
        etherscan: explorer
    },
    nativeCurrency: {
        name: 'Polygon Chain Native Token',
        symbol: 'MATIC',
        decimals: 18
    }
}

export const mumbai: Chain = {
    id: 80001,
    name: 'Polygon Chain Testnet',
    network: 'mumbai',
    nativeCurrency: {
        decimals: 18,
        name: 'Polygon Chain Native Token',
        symbol: 'MATIC'
    },
    rpcUrls: {
        public: { http: ['https://matic-mumbai.chainstacklabs.com'] },
        default: { http: ['https://matic-mumbai.chainstacklabs.com'] }
    },
    blockExplorers: {
        default: { name: 'PolygonScan', url: 'https://mumbai.polygonscan.com/' }
    },
    testnet: true
}

export const mumbaiTestnet = {
    id: 80001,
    name: 'Polygon Mumbai',
    network: 'maticmum',
    nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
    },
    rpcUrls: {
        alchemy: {
            http: ['https://polygon-mumbai.g.alchemy.com/v2'],
            webSocket: ['wss://polygon-mumbai.g.alchemy.com/v2']
        },
        infura: {
            http: ['https://polygon-mumbai.infura.io/v3'],
            webSocket: ['wss://polygon-mumbai.infura.io/ws/v3']
        },
        default: {
            http: ['https://rpc-mumbai.maticvigil.com']
        },
        public: {
            http: ['https://rpc-mumbai.maticvigil.com']
        }
    },
    blockExplorers: {
        etherscan: {
            name: 'PolygonScan',
            url: 'https://mumbai.polygonscan.com'
        },
        default: {
            name: 'PolygonScan',
            url: 'https://mumbai.polygonscan.com'
        }
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 25770160
        }
    },
    testnet: true
} as const satisfies Chain
