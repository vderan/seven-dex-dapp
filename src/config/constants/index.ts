import JSBI from 'jsbi'

// default allowed slippage, in bips

export const WALLET_CONNECT_PROJECT_ID = '4ca865d37decc2ea53f0e92c6918ec0b'
export const BACKEND_URL = 'https://dexapi.seven-project.com/'

export const DEFAULT_TRANSACTION_DEADLINE = '99999999999999999999999'

export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const GELATO_NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const FAST_INTERVAL = 10000
export const SLOW_INTERVAL = 60000

// exports for external consumption
export type BigintIsh = JSBI | number | string

export enum TradeType {
    EXACT_INPUT,
    EXACT_OUTPUT
}

export enum Rounding {
    ROUND_DOWN,
    ROUND_HALF_UP,
    ROUND_UP
}

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _9975 = JSBI.BigInt(9975)
export const _10000 = JSBI.BigInt(10000)

export const MaxUint256 = JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

export enum VMType {
    uint8 = 'uint8',
    uint256 = 'uint256'
}

export const VM_TYPE_MAXIMA = {
    [VMType.uint8]: JSBI.BigInt('0xff'),
    [VMType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}
