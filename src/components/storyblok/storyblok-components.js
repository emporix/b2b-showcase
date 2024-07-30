import Page from './Page'
import Teaser from './Teaser'
import Feature from './Feature'
import Grid from './Grid'
import Global from './Global'
import footer from '../Footer/Footer'

export const componentList = () => {
  return {
    page: Page,
    teaser: Teaser,
    feature: Feature,
    grid: Grid,
    global: Global,
    footer: footer
  }
}
