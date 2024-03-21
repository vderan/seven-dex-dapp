import 'styled-components'
import { PancakeTheme } from './theme'

declare module 'styled-components' {
    export interface DefaultTheme extends PancakeTheme {}
}
