import JSBI from 'jsbi'
import { Percent } from '@/utils/percent'
import { Token, WNATIVE } from '@/utils/token'
import { ChainId } from './chains'
import { ChainMap, ChainTokenList } from './types'
import { PINNED_TOKENS_MUMBAI, PINNED_TOKENS_POLYGON } from './tokens'

export const EXCHANGE_PAGE_PATHS = ['/swap', '/limit-orders', 'liquidity', '/add', '/find', '/remove']

export const BIG_INT_ZERO = JSBI.BigInt(0)
export const BIG_INT_TEN = JSBI.BigInt(10)
export const MIN_BNB: JSBI = JSBI.exponentiate(BIG_INT_TEN, JSBI.BigInt(16)) // .01 BNB

// one basis point
export const BIPS_BASE = JSBI.BigInt(10000)
export const ONE_BIPS = new Percent(JSBI.BigInt(1), BIPS_BASE)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

export const BLOCKED_PRICE_IMPACT: Percent = new Percent(JSBI.BigInt(5000), BIPS_BASE)

// used to ensure the user doesn't send so much BNB so they end up with <.01

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), BIPS_BASE)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BASE_FEE = new Percent(JSBI.BigInt(25), BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

export const ROUTER_ADDRESS: ChainMap<string> = {
    [ChainId.ETHEREUM]: '',
    [ChainId.GOERLI]: '',
    [ChainId.POLYGON]: '0x7a560c4da6e976ea97c4f1f66bd090ba529cf927',
    [ChainId.MUMBAI]: '0x94D2B24daEf35b6Bc04B15fEdeA1F60CBb94E26f',
    [ChainId.SVC]: ''
}

export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
    [ChainId.ETHEREUM]: [],
    [ChainId.GOERLI]: [],
    [ChainId.POLYGON]: [
        PINNED_TOKENS_POLYGON.wmatic,
        PINNED_TOKENS_POLYGON.svc,
        PINNED_TOKENS_POLYGON.usdt,
        PINNED_TOKENS_POLYGON.wbtc,
        PINNED_TOKENS_POLYGON.weth,
        PINNED_TOKENS_POLYGON.b2z,
        PINNED_TOKENS_POLYGON.jtt
    ],
    [ChainId.MUMBAI]: [
        PINNED_TOKENS_MUMBAI.wmatic,
        PINNED_TOKENS_MUMBAI.svc,
        PINNED_TOKENS_MUMBAI.wbtc,
        PINNED_TOKENS_MUMBAI.weth,
        PINNED_TOKENS_MUMBAI.jtt
    ],
    [ChainId.SVC]: []
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
    [ChainId.ETHEREUM]: {},
    [ChainId.GOERLI]: {},
    [ChainId.POLYGON]: {},
    [ChainId.MUMBAI]: {},
    [ChainId.SVC]: {}
}

export const INIT_CODE_HASH = '0xd2ba33143657b9d9addaa60522ccfe49ca1b4b4c3d4560ac710a5fe266d069be'
export const INIT_CODE_HASH_MAP: Record<number, string> = {
    [ChainId.ETHEREUM]: INIT_CODE_HASH,
    [ChainId.GOERLI]: INIT_CODE_HASH,
    [ChainId.POLYGON]: INIT_CODE_HASH,
    [ChainId.MUMBAI]: INIT_CODE_HASH,
    [ChainId.SVC]: INIT_CODE_HASH
}

export const FACTORY_ADDRESS_MAP: Record<number, string> = {
    [ChainId.ETHEREUM]: '',
    [ChainId.GOERLI]: '',
    [ChainId.POLYGON]: '0x055133cf912411bDcf5C797F42425fB8848A0e23',
    [ChainId.MUMBAI]: '0xE857086AF5889e9A59d7Bed75A3082548386a842',
    [ChainId.SVC]: ''
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
    [ChainId.ETHEREUM]: [],
    [ChainId.POLYGON]: [
        [PINNED_TOKENS_POLYGON.wmatic, PINNED_TOKENS_POLYGON.svc],
        [PINNED_TOKENS_POLYGON.usdt, PINNED_TOKENS_POLYGON.svc],
        [PINNED_TOKENS_POLYGON.wbtc, PINNED_TOKENS_POLYGON.svc],
        [PINNED_TOKENS_POLYGON.weth, PINNED_TOKENS_POLYGON.svc],
        [PINNED_TOKENS_POLYGON.b2z, PINNED_TOKENS_POLYGON.svc],
        [PINNED_TOKENS_POLYGON.jtt, PINNED_TOKENS_POLYGON.svc],
        [PINNED_TOKENS_POLYGON.usdt, PINNED_TOKENS_POLYGON.wmatic],
        [PINNED_TOKENS_POLYGON.wbtc, PINNED_TOKENS_POLYGON.wmatic],
        [PINNED_TOKENS_POLYGON.weth, PINNED_TOKENS_POLYGON.wmatic],
        [PINNED_TOKENS_POLYGON.b2z, PINNED_TOKENS_POLYGON.wmatic],
        [PINNED_TOKENS_POLYGON.jtt, PINNED_TOKENS_POLYGON.wmatic],
        [PINNED_TOKENS_POLYGON.wbtc, PINNED_TOKENS_POLYGON.usdt],
        [PINNED_TOKENS_POLYGON.weth, PINNED_TOKENS_POLYGON.usdt],
        [PINNED_TOKENS_POLYGON.b2z, PINNED_TOKENS_POLYGON.usdt],
        [PINNED_TOKENS_POLYGON.jtt, PINNED_TOKENS_POLYGON.usdt],
        [PINNED_TOKENS_POLYGON.weth, PINNED_TOKENS_POLYGON.wbtc],
        [PINNED_TOKENS_POLYGON.b2z, PINNED_TOKENS_POLYGON.wbtc],
        [PINNED_TOKENS_POLYGON.jtt, PINNED_TOKENS_POLYGON.wbtc],
        [PINNED_TOKENS_POLYGON.b2z, PINNED_TOKENS_POLYGON.weth],
        [PINNED_TOKENS_POLYGON.jtt, PINNED_TOKENS_POLYGON.weth],
        [PINNED_TOKENS_POLYGON.jtt, PINNED_TOKENS_POLYGON.b2z]
    ],
    [ChainId.GOERLI]: [],
    [ChainId.MUMBAI]: [
        [PINNED_TOKENS_MUMBAI.wmatic, PINNED_TOKENS_MUMBAI.svc],
        [PINNED_TOKENS_MUMBAI.wbtc, PINNED_TOKENS_MUMBAI.svc],
        [PINNED_TOKENS_MUMBAI.weth, PINNED_TOKENS_MUMBAI.svc],
        [PINNED_TOKENS_MUMBAI.jtt, PINNED_TOKENS_MUMBAI.svc]
    ],
    [ChainId.SVC]: []
}
