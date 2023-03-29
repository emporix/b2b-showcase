import { GridLayout } from '../components/Utilities/common'
import { Heading4, Heading2 } from '../components/Utilities/typography'
const NoPage = () => {
  return (
    <GridLayout className="invalid-tenant-page">
      <GridLayout className="gap-5">
        <Heading2>404</Heading2>
        <Heading4>We can't seem to find the page you're looking for.</Heading4>
      </GridLayout>
    </GridLayout>
  )
}
export default NoPage
