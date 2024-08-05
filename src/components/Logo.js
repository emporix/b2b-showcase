import { homeUrl } from '../services/service.config'
import newLogo from '../assets/aldi-logo.svg'

export const Logo = ({ onMouseOver }) => {
  return (
    <a href={homeUrl()} className="flex" onMouseOver={onMouseOver}>
      <img id="logo-img" src={newLogo} alt={'Logo'} className="h-[56px]" />
    </a>
  )
}
