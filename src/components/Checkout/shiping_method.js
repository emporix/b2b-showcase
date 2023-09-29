import React, { useContext, useState } from 'react'
import { RadioItem } from '../Utilities/radio'
import { RadioContext } from '../Utilities/radio'
import './checkout.css'
import DeliveryWindow from './DeliveryWindow'
import { useUserAddress } from 'pages/checkout/AddressProvider'
import { useSites } from 'context/sites-provider'

const ShippingMethod = ({ radioKey, shippingmode, price, onClick }) => {
  const { radioActive, setRadioActive } = useContext(RadioContext)
  
  const { currentSite } = useSites()

  const {
    deliveryWindows
  } = useUserAddress()

  function getActualDeliveryWindows(data, siteId) {
    // Find the site by its id
    const site = data.find(site => site.id === siteId);
    
    // If the site doesn't exist, return an empty array
    if (!site) {
        console.warn(`Site with ID: ${siteId} not found.`);
        return [];
    }
  
    // Extract all the actualDeliveryWindows from the site's zones
    let deliveryWindows = [];
    site.zones.forEach(zone => {
        deliveryWindows = deliveryWindows.concat(zone.actualDeliveryWindows);
    });
    return deliveryWindows.filter(deliveryWindow => deliveryWindow.deliveryMethod === shippingmode)
  }

  return (
    <>
      {getActualDeliveryWindows(deliveryWindows, currentSite).length > 0 && (
      <div
      onChange={radioActive === radioKey  && onClick !== undefined ? onClick(radioKey): null}
        className={
          radioActive === radioKey
            ? 'shipping_method_selected'
            : 'shipping_method'
        }
      >
        <div className="flex justify-between w-full">
          <div className="flex">
            <RadioItem radioKey={radioKey} />
            <div className="pt-2 md:pt-0 pl-3">
              <div className=" font-bold text-base ">
                {shippingmode}{' '}
                <span className="underline font-semibold text-[14px]">+info</span>
              </div>
            </div>
          </div>

          <div className=" font-medium text-xl pt-2 md:pt-0">{price}</div>
        </div>
      </div>
    )}
    {getActualDeliveryWindows(deliveryWindows, currentSite).length > 0 && radioActive === radioKey && (
      <div className="pt-2 md:pt-0 pl-3" style={{marginLeft: '50px'}}>
        <DeliveryWindow
          sitesDeliveryWindows={getActualDeliveryWindows(deliveryWindows, currentSite)}
        />
      </div>
    )}

      


    </>
  )
}

export default ShippingMethod
