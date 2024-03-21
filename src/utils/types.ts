
import { Contract } from '@ethersproject/contracts'


export type MultiCallResponse<T> = T | null


// generic contract types

export type MaybeContract<C extends Contract = Contract> = C | null | undefined
export type ContractMethodName<C extends Contract = Contract> = keyof C['callStatic'] & string

export type ContractMethodParams<
    C extends Contract = Contract,
    N extends ContractMethodName<C> = ContractMethodName<C>,
> = Parameters<C['callStatic'][N]>
