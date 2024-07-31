import Page from './Page'
import Teaser from './Teaser'
import Feature from './Feature'
import Grid from './Grid'
import Global from './Global'
import footer from '../Footer/Footer'
import GlobalReference from './GlobalReference'
import header from '../Header/header'

export const componentList = () => {
  return {
    page: Page,
    teaser: Teaser,
    feature: Feature,
    grid: Grid,
    global: Global,
    "global-reference": GlobalReference,
    aec_header: header,
    aec_footer: footer,
  }
}
