import Page from './Page'
import Teaser from './Teaser'
import Feature from './Feature'
import Grid from './Grid'
import Global from './Global'
import Footer from '../Footer/Footer'
import GlobalReference from './GlobalReference'
import Header from '../Header/Header'
import Hero from './Hero'
import BannerSmall from './BannerSmall'
import RichText from './RichText'
import DateText from './DateText'
import Headline from './Headline'
import SubHeadline from './SubHeadline'
import ProductGrid from './ProductGrid'

export const componentList = () => {
  return {
    page: Page,
    teaser: Teaser,
    feature: Feature,
    grid: Grid,
    global: Global,
    "global-reference": GlobalReference,
    aec_header: Header,
    aec_footer: Footer,
    aec_hero: Hero,
    aec_banner_small: BannerSmall,
    aec_rich_text: RichText,
    aec_date: DateText,
    aec_headline: Headline,
    aec_sub_headline: SubHeadline,
    aec_product_grid: ProductGrid
  }
}
