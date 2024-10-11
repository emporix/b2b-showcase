import { useCountdown } from '../../../services/product/useCountDown'
import { AiOutlineHistory } from 'react-icons/ai'
import { useLanguage } from '../../../context/language-provider'

const CounDownLabel = ({ targetDate }) => {
  const { currentLanguage } = useLanguage()
  const values = useCountdown(targetDate)
  const text = currentLanguage === 'de' ?
    'Verkauf startet in:' :
    'Sales start in:'

  return values[0] >= 0 &&
    (<>
      <AiOutlineHistory className="text-demoHeadlines ml-2" size={30} />
      <div className="text-demoHeadlines font-bold"><span
        className="mx-2">{text}</span>
        <span>{values[0]}</span><sup>{currentLanguage === 'de' ?
          't' :
          'd'}</sup><span> : </span>
        <span>{values[1]}</span><sup>h</sup><span> : </span>
        <span>{values[2]}</span><sup>min</sup><span> : </span>
        <span>{values[3]}</span><sup>{currentLanguage === 'de' ?
          'sek' :
          'sec'}</sup>
      </div>
    </>)
}

export default CounDownLabel
