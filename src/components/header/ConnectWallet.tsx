import React, { useMemo } from 'react'
// import { makeStyles } from '@mui/styles';
import { Button, Box, Typography, useMediaQuery, MenuItem } from '@mui/material'
import { formart } from '../../utils/formatAddress'

import { useAccount } from 'wagmi'
import useAuth from '@/hooks/useAuth'
import { useTranslation } from '@/context/Localization'
import { StyledMenu } from './Styled'
import { Link, useLocation } from 'react-router-dom'
import { ConnectKitButton } from 'connectkit'
import { useWeb3Modal } from '@web3modal/react'

function ConnectButton() {
    const { open, close } = useWeb3Modal()
    const isXs = useMediaQuery('(max-width:400px)')

    const { isConnected, address } = useAccount()
    const { logout } = useAuth()
    const { t } = useTranslation()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const isDrop = Boolean(anchorEl)

    const openDrop = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const closeDrop = () => {
        setAnchorEl(null)
    }

    const location = useLocation()

    const hidden = useMemo(() => {
        return location.pathname === '/bridge/axelar'
    }, [location])

    return (
        <Box display={hidden ? 'none' : 'block'}>
            <Box
                sx={{
                    mx: 2,
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'center'
                }}
            >
                <Button
                    sx={{
                        bgcolor: '#e57a3b',
                        borderRadius: '10000px',
                        textTransform: 'none',
                        color: '#FFF',
                        padding: '7px 10px',
                        fontSize: '18px',
                        '&:hover': {
                            bgcolor: '#e57a3b'
                        }
                    }}
                    onClick={() => open()}
                    aria-controls={isDrop ? 'customized-menu' : undefined}
                >
                    {(() => {
                        if (isConnected) return formart(address as string)
                        else return isXs ? t('Connect') : t('Connect Wallet')
                    })()}
                </Button>
            </Box>
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                open={isDrop}
                onClick={closeDrop}
                sx={{
                    '& img': {
                        pr: 1,
                        width: '24px',
                        height: '20px'
                    }
                }}
            >
                <Link to={{ pathname: `//polygonscan.com/address/${address}` }} target="_blank">
                    <MenuItem>
                        <Typography color="#333">{t('View on Scan')}</Typography>
                    </MenuItem>
                </Link>
                <MenuItem onClick={logout}>{t('Disconnect Wallet')}</MenuItem>
            </StyledMenu>
        </Box>
    )
}

export default ConnectButton
