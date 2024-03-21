import { ethers } from 'ethers'
import { provider } from './wagmi'
import { Connector, useChainId } from 'wagmi'
import { connect } from 'react-redux'

export const registerToken = async (
    connector: Connector,
    tokenAddress: string,
    tokenSymbol: string,
    tokenDecimals: number,
    tokenLogo: string
) => {
    const tokenAdded = await connector.watchAsset({
        address: tokenAddress,
        symbol: tokenSymbol,
        image: tokenLogo,
        decimals: tokenDecimals
    })
    return tokenAdded
    // if (window.ethereum) {
    //     const tokenAdded = await window.ethereum.request({
    //         method: 'wallet_watchAsset',
    //         params: {
    //             type: 'ERC20',
    //             options: {
    //                 address: tokenAddress,
    //                 symbol: tokenSymbol,
    //                 decimals: tokenDecimals,
    //                 image: tokenLogo
    //             }
    //         }
    //     })
    //     return tokenAdded
    // }
}
