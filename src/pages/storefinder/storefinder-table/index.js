import './storefinder-table.css'
import { getDealers } from '../../../services/storefinder.service'
import { useEffect, useState } from 'react'
import { useLanguage } from 'context/language-provider'
import { HiOutlineMail, HiOutlineGlobe } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'

const StoreFinderTable = () => {
  const [dealers, setDealers] = useState([])
  const { currentLanguage } = useLanguage()

  const { t } = useTranslation('page')

  const getData = async (currentLang) => {
    const dealerData = await getDealers(currentLang)
    setDealers(dealerData.data.dealers)
  }
  useEffect(() => {
    getData(currentLanguage)
  }, [currentLanguage])

  return (
    <div className="storefinderTable">
      <div className="storefinderTable__table">
        <div className="storefinderTable__table__items gap-4">
          {dealers.map((store, index) => {
            if (store.name) {
              return (
                <div
                  className="storefinderTable__table__item flex flex-col rounded-xl standard_box_shadow bg-aliceBlue"
                  key={store.name}
                >
                  {store.imageUrl ? (
                    <img
                      src={store.imageUrl + '?impolicy=small'}
                      alt="Store"
                      className="aspect-square object-cover"
                      style={{ borderRadius: '5px' }}
                    />
                  ) : (
                    <img
                      src="/img/wineDealerBackground.png"
                      alt="Store"
                      className="aspect-square object-cover"
                      style={{ borderRadius: '5px' }}
                    />
                  )}
                  <div className="flex flex-col">
                    <div className="text-left w-full text-2xl text-eerieBlack font-light">{store.name}</div>
                    <div>
                      <div className="storefinderTable__table__item__key">
                        {store.street ? store.street + ' ' + (store.houseNumber ? store.houseNumber : '') : ''}
                      </div>
                      <div className="storefinderTable__table__item__key">
                        {store.zipCode ? store.zipCode + ' ' + (store.city ? store.city : '') : store.city}
                      </div>

                      <div className="storefinderTable__table__item__key">{store.phoneNumber}</div>
                      <div className="flex flex-row gap-4 mt-4 justify-end">
                        <div className="storefinderTable__table__item__key">
                          <a
                            href={store.website}
                            className="text-darkGray hover:text-primary"
                            target="_blank"
                            rel="noreferrer"
                            title={t('website')}
                          >
                            <HiOutlineGlobe size={32} />
                          </a>
                        </div>
                        <div className="storefinderTable__table__item__key">
                          <a
                            href={'mailto:' + store.email}
                            className="text-darkGray hover:text-primary"
                            target="_blank"
                            rel="noreferrer"
                            title={t('mailto')}
                          >
                            <HiOutlineMail size={32} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
export default StoreFinderTable
