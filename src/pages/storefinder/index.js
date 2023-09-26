import Layout from '../Layout'
import StoreFinderTable from './storefinder-table'
import { getDealers } from 'services/dealers.service'

const StoreFinder = () => {
    const data = getDealers();
    console.log(data, [], false)

    return (
        <Layout title="Storefinder">
            <StoreFinderTable></StoreFinderTable>
        </Layout>
    )
}
export default StoreFinder

