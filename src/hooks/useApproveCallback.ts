import { TransactionResponse } from '@ethersproject/providers'
import { useCallback, useMemo } from 'react'
import { MaxUint256, TradeType } from '@/config/constants'
import { useHasPendingApproval, useTransactionAdder } from '@/state/transactions/hooks'
import { Currency, CurrencyAmount } from '@/utils/token'
import { useAccount } from 'wagmi'
import { useTokenContract } from './useContract'
import useTokenAllowance from './useTokenAllowance'
import { calculateGasMargin } from '@/utils'
import { computeSlippageAdjustedAmounts } from '@/utils/exchange'
import { Field } from '@/state/swap/actions'
import { Trade } from '@/utils/trade'
import { ROUTER_ADDRESS } from '@/config/constants/exchange'
import { ChainId } from '@/config/constants/chains'
import JSBI from 'jsbi'
import { useTranslation } from '@/context/Localization'
import useToast from './useToast'

export enum ApprovalState {
    UNKNOWN,
    NOT_APPROVED,
    PENDING,
    APPROVED
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
    amountToApprove?: CurrencyAmount<Currency>,
    spender?: string
): [ApprovalState, () => Promise<void>] {
    const { address: account } = useAccount()

    const { t } = useTranslation()
    const { toastError } = useToast()

    const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
    const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)

    const pendingApproval = useHasPendingApproval(token?.address, spender)

    // check the current approval status
    const approvalState: ApprovalState = useMemo(() => {
        if (!amountToApprove || !spender) return ApprovalState.UNKNOWN

        if (amountToApprove.currency?.isNative) return ApprovalState.APPROVED
        // we might not have enough data to know whether or not we need to approve
        if (!currentAllowance) return ApprovalState.UNKNOWN

        // amountToApprove will be defined if currentAllowance is
        // return currentAllowance.lessThan(amountToApprove)
        return JSBI.lessThan(currentAllowance.quotient, amountToApprove.quotient)
            ? pendingApproval
                ? ApprovalState.PENDING
                : ApprovalState.NOT_APPROVED
            : ApprovalState.APPROVED
    }, [amountToApprove, currentAllowance, pendingApproval, spender])

    const tokenContract = useTokenContract(token?.address)
    const addTransaction = useTransactionAdder()

    const approve = useCallback(async (): Promise<void> => {
        if (approvalState !== ApprovalState.NOT_APPROVED) {
            toastError(t('Error'), t('Approve was called unnecessarily'))
            console.error('approve was called unnecessarily')
            return undefined
        }
        if (!token) {
            toastError(t('Error'), t('No token'))
            console.error('no token')
            return undefined
        }

        if (!tokenContract) {
            toastError(
                t('Error'),
                t('Cannot find contract of the token %tokenAddress%', { tokenAddress: token?.address })
            )
            console.error('tokenContract is null')
            return undefined
        }

        if (!amountToApprove) {
            toastError(t('Error'), t('Missing amount to approve'))
            console.error('missing amount to approve')
            return undefined
        }

        if (!spender) {
            toastError(t('Error'), t('No spender'))
            console.error('no spender')
            return undefined
        }

        let useExact = false

        const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
            // general fallback for tokens who restrict approval amounts
            useExact = true
            return tokenContract.estimateGas.approve(spender, amountToApprove.quotient.toString()).catch(() => {
                toastError(t('Error'), t('Unexpected error. Could not estimate gas for the approve.'))
                console.error('estimate gas failure')
                return null
            })
        })

        if (!estimatedGas) return undefined

        return tokenContract
            .approve(spender, useExact ? amountToApprove.quotient.toString() : MaxUint256, {
                gasLimit: calculateGasMargin(estimatedGas)
            })
            .then((response: TransactionResponse) => {
                addTransaction(response, {
                    summary: `Approve ${amountToApprove.currency.symbol}`,
                    translatableSummary: {
                        text: 'Approve %symbol%',
                        data: { symbol: amountToApprove.currency.symbol }
                    },
                    approval: { tokenAddress: token.address, spender },
                    type: 'approve'
                })
            })
            .catch((error: any) => {
                toastError(t('User rejected transaction.'))
                if (error?.code !== 4001) {
                    console.log('transaction error')
                }
                throw error
            })
    }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction])

    return [approvalState, approve]
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(trade?: Trade<Currency, Currency, TradeType>, allowedSlippage = 0) {
    const amountToApprove = useMemo(
        () => (trade ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT] : undefined),
        [trade, allowedSlippage]
    )
    return useApproveCallback(amountToApprove, ROUTER_ADDRESS[ChainId.POLYGON])
}
