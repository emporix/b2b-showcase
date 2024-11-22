import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppContext } from './app-context';
import { useSites } from './sites-provider';

const CustomStyleContext = createContext({});

export const useCustomStyleContext = () => useContext(CustomStyleContext)

export const CustomSiteProvider = ({ children }) => {
  const { context } = useAppContext();
  const { currentSite, currentSiteObject } = useSites();
  const [banner, setBanner] = useState(null)
  const [logo, setLogo] = useState(null)
  const [services, setServices] = useState(null)
  const [productCarousel, setPproductCarousel] = useState(null)
  const [subscribe, setSubscribe] = useState(null)
  
  
  useEffect(() => {
    (async () => {
      const globalStyles = currentSiteObject?.mixins?.b2bshowcase?.styles?.global;
      setBanner(currentSiteObject?.mixins?.b2bshowcase?.components?.banner);
      setLogo(currentSiteObject?.mixins?.b2bshowcase?.components?.logo || '/static/media/new_logo.0ac7386956c01dac9adc7a680a321819.svg');
      setServices(currentSiteObject?.mixins?.b2bshowcase?.components?.homeServices);
      setSubscribe(currentSiteObject?.mixins?.b2bshowcase?.components?.subscribe);
      setPproductCarousel(currentSiteObject?.mixins?.b2bshowcase?.components?.productCarousel);
      const styleId = 'emporix-custom-styles';
      const existingStyleElement = document.getElementById(styleId);

      if (existingStyleElement) {
        existingStyleElement.remove()
      }
      if (globalStyles !== undefined) {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = styleId;
        styleElement.appendChild(document.createTextNode(globalStyles));
        document.head.appendChild(styleElement);
      }

      // const logoSrc = currentSiteObject?.mixins?.b2bshowcase?.components?.logo;

      // const updateLogo = () => {
      //   const existingLogo = document.getElementById('logo-img');
      //   if (existingLogo) {
      //     if (logoSrc) {
      //       existingLogo.src = logoSrc;
      //     }
      //   //  clearInterval(logoInterval);
      //   }
      // };

      // const logoInterval = setInterval(updateLogo, 100);
      // return () => clearInterval(logoInterval);
    })();
  }, [currentSite, currentSiteObject]);

  return (
    <CustomStyleContext.Provider value={{
      banner,
      logo,
      services, 
      subscribe,
      productCarousel
    }}>
      {children}
    </CustomStyleContext.Provider>
  );
};
