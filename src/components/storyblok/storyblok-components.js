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
import PdpTitle from './pdp/PdpTitle'
import PdpPage from './pdp/PdpPage'
import PdpImage from './pdp/PdpImage'
import PdpColumnLayout1 from './pdp/PdpColumnLayout1'
import PdpColumnLayout2 from './pdp/PdpColumnLayout2'
import PdpDescription from './pdp/PdpDescription'
import PdpBreadcrumbs from './pdp/PdpBreadcrumbs'
import PdpId from './pdp/PdpId'
import PdpPrice from './pdp/PdpPrice'
import PdpAddToCart from './pdp/PdpAddToCart'
import PdpAccordion from './pdp/PdpAccordion'
import PdpBrand from './pdp/PdpBrand'
import PdpLabels from './pdp/PdpLabels'
import PdpMixins from './pdp/PdpMixins'
import PdpUSPs from './pdp/PdpUSPs'
import PdpRelatedProducts from './pdp/PdpRelatedProducts'
import PdpVariantSelection from './pdp/PdpVariantSelection'
import PdpBundle from './pdp/PdpBundle'

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
    aec_product_grid: ProductGrid,
    "product-detail-page": PdpPage,
    aec_pdp_column_layout_1: PdpColumnLayout1,
    aec_pdp_column_layout_2: PdpColumnLayout2,
    aec_pdp_image: PdpImage,
    aec_pdp_title: PdpTitle,
    aec_pdp_description: PdpDescription,
    aec_pdp_breadcrumbs: PdpBreadcrumbs,
    aec_pdp_id: PdpId,
    aec_pdp_price: PdpPrice,
    aec_pdp_add_to_cart: PdpAddToCart,
    aec_pdp_accordion: PdpAccordion,
    aec_pdp_brand: PdpBrand,
    aec_pdp_labels: PdpLabels,
    aec_pdp_mixins: PdpMixins,
    aec_pdp_usps: PdpUSPs,
    aec_pdp_related_products: PdpRelatedProducts,
    aec_pdp_variant_selection: PdpVariantSelection,
    aec_pdp_bundle: PdpBundle
  }
}
