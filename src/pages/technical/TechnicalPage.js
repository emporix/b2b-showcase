import Layout from '../Layout'
import { useTranslation } from 'react-i18next'
import {Link} from "react-router-dom";
import '../technical/technical.css'

const TechnicalPage = () => {
    const { t } = useTranslation('page')


    return (
        <Layout title={t('technical')}>
            <div className="technical-wrapper">

                <button key="firstspirit" className="technical-element">
                    <Link to="https://partner.e-spirit.hosting/?login.ticket=1s8bdvl0ehx1h" target="_blank">
                        <img className='technical-logo' src='/img/logos/crownpeak.webp' alt='crownpeak logo'/>
                    </Link>
                </button>
                <button key="emporix" className="technical-element">
                    <Link to="https://dashboard.emporix.io/" target="_blank">
                        <img className='technical-logo' src='/img/logos/emporix.webp' alt='emporix logo'/>
                    </Link>
                </button>
                <button key="occtoo" className="technical-element">
                    <Link to="https://studio.occtoo.com/" target="_blank">
                        <img className='technical-logo' src='/img/logos/occtoo.webp' alt='occtoo logo'/>
                    </Link>
                </button>
                <button key="zendesk" className="technical-element">
                    <Link to="https://con-neteleven.zendesk.com/hc/de" target="_blank">
                        <img className='technical-logo' src='/img/logos/zendesk.webp' alt='zendesk logo'/>
                    </Link>
                </button>
                <button key="cockpit" className="technical-element">
                    <Link to="https://cockpit.cxc.neteleven.de/" target="_blank">
                        <img className='technical-logo' src='/img/logos/cockpit.webp' alt='technical logo'/>
                    </Link>
                </button>
            </div>
        </Layout>
    )
}

export default TechnicalPage
