import About from './About'
import Service from './Service'
import Category from './Category'
import Subscribe from './Subscribe'
import Layout from '../Layout'
import Content from './Content'
import { CMSFilterType, ContentPageMapping } from 'services/content/filteredPage.service'


const Home = () => {
  return (
    <Layout title={'home'}>
      <About />
      <Content type={CMSFilterType.NAME} page={ContentPageMapping.homepage} />
      <Service />
      <Category/>
      <Subscribe />
    </Layout>
  )
}

export default Home
