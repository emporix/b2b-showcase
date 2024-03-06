import Layout from '../Layout'
import { CMSFilterType } from '../../services/content/filteredPage.service'
import Content from '../home/Content'
import { Link } from 'react-router-dom'

const CMSContent = () => {
  let path = window.location.pathname
  const parts = path.split('/')
  path = parts[parts.length - 1]

  return (
    <Layout>
      <Link to="/n11showcase/content">Übersicht</Link>
      <Content key={path} type={CMSFilterType.CONTENT} page={path} />
    </Layout>
  )
}

export default CMSContent
