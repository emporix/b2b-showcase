import React from 'react'
import { useSites } from 'context/sites-provider'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'context/auth-provider'

const About = () => {
  const {  currentSite } = useSites()
  const navigate = useNavigate()
  const { userTenant: tenant } = useAuth()
  const eckerleUrl = 'https://n.hirmercdn.de/eck/content/teasers/startseite/STS_20230406/20230405-newin-dsk.jpg'

  const mappingPageName = {
    'main': 'hirmer',
    'HGG': 'hirmer_grosse_grössen',
    'ECK': 'eckerle'
  }

  const handleSiteChange = () => {
    navigate(`/${tenant}/product/${mappingPageName[currentSite]}`)
  }

  function aboutVariant (site) {
    switch (site) {
      case 'ECK':
        return (
          <div className='home_about-eck flex items-center justify-center' onClick={handleSiteChange}>
            <div className="flex items-center justify-center">
              <img src={eckerleUrl} className="" alt='eckler'/>
            </div>  
          </div>
        )
      
      case 'main':
        return (
          <div className='home-about-hirmer' onClick={handleSiteChange}>
            <div class="home-about-hirmer__teaser"> 
               <img src="https://n.hirmercdn.de/hrm/content/teasers/startseite/STS_20230406/20230405_hir_sts_jacken.jpg" alt="hirmer"/>
            </div>

            <div class="home-about-hirmer__teaser">
              <img src="https://n.hirmercdn.de/hrm/content/teasers/startseite/STS_20230421/20230421_hir_sts_lacoste-netflix.jpg" alt="hirmer"/>
            </div>
          </div>
        )
    
      default:
        return (
          <div className='home-about-hgg' onClick={handleSiteChange}>
            <div class="home-about-hgg__teaser">
              <img src="https://n.hirmercdn.de/hgg/content/teasers/startseite/sts_20230406/20230406-lederjacken-en-dsk.jpg"/>
            </div>

            <div class="home-about-hgg__teaser">
              <img src="https://n.hirmercdn.de/hgg/content/teasers/startseite/sts_20230406/20230406-sweatshirts-en-dsk.jpg" />
            </div>

            <div class="home-about-hgg__teaser">
              <img src="https://n.hirmercdn.de/hgg/content/teasers/startseite/sts_20230406/20230406-marcopolo-en-dsk.jpg" />
            </div>
          </div>     
        )
    }
  }

  return ( 
      aboutVariant(currentSite)
  )
}

export default About
