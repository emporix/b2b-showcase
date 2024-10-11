import calendar from '../../assets/calendar.png'
import { storyblokEditable } from '@storyblok/react'
import { useLanguage } from '../../context/language-provider'

const DateText = ({ blok }) => {
  const { currentLanguage } = useLanguage()

  const date = blok.date ?
    new Date(Date.parse(blok.date)) :
    new Date(Date.now())
  const options = {
    weekday: 'short',
    month: '2-digit',
    day: '2-digit',
  }
  const starting = currentLanguage === "de" ? "ab" : "starting"

  const dateText = date.toLocaleDateString(currentLanguage, options).replace(",", "")
  return (
    <div
      className="mx-4 xl:mx-auto max-w-screen-xl my-4 flex flex-row" {...storyblokEditable(
      blok)}>
      <img className="mt-[-1px] ml-[-10px]" src={calendar} alt="" />
      <h5 className="ml-2 text-xl font-bold text-demoFontHighlightColor">{starting} {dateText}</h5>
    </div>)

}

export default DateText
