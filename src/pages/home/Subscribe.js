import React from 'react'

const Subscribe = () => {
  return (
    <div className="subscribe">
      <div className="pt-12 md:pt-24 w-2/3 max-w-[600px] font-semibold text-[32px] leading-[44px] md:text-[32px] md:leading-[48px] mx-auto">
        Abonnieren Sie unseren Newsletter und erhalten sie die neuesten Nachrichten und Angebote
      </div>

        <div>
            <form>
                <label>Vorname:
                    <input type="text" />
                </label>
                <label>E-Mail:
                    <input type="text" />
                </label>
            </form>
        </div>

      {/* <button className="bg-darkBlue mt-6 md:mt-12  h-12 px-[98.5px] md:px-[55px] py-[17px] md:w-[240px] text-center border border-white font-bold font-inter text-[14px] leading-[14px]"> */}
      <button className="px-6 py-3.5 font-semibold bg-yellow text-white rounded mt-6 md:mt-12  h-12 md:px-[55px] md:w-[240px] text-center font-inter text-[14px] leading-[24px]">JETZT ABONNIEREN
      </button>
    </div>
  )
}

export default Subscribe
