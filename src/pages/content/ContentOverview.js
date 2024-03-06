import Layout from '../Layout'
import { Link } from 'react-router-dom'
import './content.css'

const ContentOverview = () => {
  return (
    <Layout>
      <div className="content-link">
        <Link to="/n11showcase/content/7c328a3c-b9b4-4ecd-8c73-1211e8c8513e">
          <div className="content-card">
            <h2>Geschichte des Wein</h2>
            <p>Entdecken Sie die faszinierende Geschichte des Weins.</p>
          </div>
        </Link>
      </div>

      <div className="content-link">
        <Link to="/n11showcase/content/de61983f-a2e1-40f3-9bfb-0519107b3b39">
          <div className="content-card">
            <h2>Ökologische Aspekte des Weinbaus</h2>
            <p>Erfahren Sie mehr über die ökologischen Aspekte des Weinbaus.</p>
          </div>
        </Link>
      </div>
    </Layout>
    //todo implement cms navigation
  )
}

export default ContentOverview
