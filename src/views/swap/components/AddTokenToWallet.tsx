import { Box, Button, Typography } from '@mui/material'
import { useTranslation } from '@/context/Localization'
import { useAllTokens } from '@/hooks/Tokens'
import { useActiveChainId } from '@/hooks/useActiveChainId'
import useToast from '@/hooks/useToast'
import { registerToken } from '@/utils/registerToken'
import { Token } from '@/utils/token'
import { useAccount } from 'wagmi'

function AddTokenToWallet() {
    const { address: account, connector } = useAccount()
    const { isWrongNetwork } = useActiveChainId()

    const tokens = useAllTokens()
    const { t } = useTranslation()
    const { toastSuccess } = useToast()
    const onRegisterToken = async (token: Token) => {
        await registerToken(connector, token.address, token.symbol, token.decimals, token.logoURI)
        toastSuccess(t('SVC Token added successfully'))
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {account && !isWrongNetwork && (
                <Button
                    sx={{ cursor: 'pointer' }}
                    onClick={() => onRegisterToken(tokens['0x9aA68BA3746D05009135D5f33D3Ced069dcA719b'])}
                >
                    <Typography
                        sx={{
                            width: '100%',
                            textAlign: 'center',
                            color: '#ffae5a'
                        }}
                    >
                        {t('Add SVC to wallet')}
                    </Typography>
                </Button>
            )}
        </Box>
    )
}

export default AddTokenToWallet
