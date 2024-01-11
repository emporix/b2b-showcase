import './storefinder-table.css'
import {getDealers} from "../../../services/storefinder.service";
import {useEffect, useState} from "react";
import { useLanguage } from 'context/language-provider';

const StoreFinderTable = () => {
    const [ dealers, setDealers ] = useState([])
    const { currentLanguage } = useLanguage()
    const getData = async (currentLang) => {
        const dealerData = await getDealers(currentLang)
        setDealers(dealerData.data.dealers)
    };
    useEffect(() => {
        getData(currentLanguage);
    },[currentLanguage])


    return (
        <div className='storefinderTable'>
            <div className='storefinderTable__table__header'>
                Unsere Lokalen Verkaufspartner
            </div>
            <div className='storefinderTable__table'>
                <div className='storefinderTable__table__items'>
                    {dealers.map((store, index) => {
                        if (store.name) {
                            return (
                                <div className='storefinderTable__table__item' key={store.id}>
                                    <img src='/img/wineDealerBackground.png'
                                         alt="Store Image"
                                         style={{borderRadius: '5px'}}/>
                                    <div className='storefinderTable__table__item__key'>
                                        <strong style={{fontSize: '1.5rem'}}>{store.name}</strong>
                                    </div>


                                    <div className='storefinderTable__table__item__key'>
                                        {store.street ? store.street + " " + (store.houseNumber ? store.houseNumber : "") : ""}
                                    </div>
                                    <div className='storefinderTable__table__item__key'>
                                        {store.zipCode ? store.zipCode + " " + (store.city ? store.city : "") : store.city}
                                    </div>

                                    <div className='storefinderTable__table__item__key'>
                                        {store.phoneNumber}
                                    </div>
                                    <div className='storefinderTable__table__item__key'>
                                        <a href={store.website}
                                           style={{color: 'blue'}}>{store.website}
                                        </a>
                                    </div>
                                    <div className='storefinderTable__table__item__key'>
                                        <a href={'mailto:' + store.email} style={{color: 'blue'}}>{store.email}</a>
                                    </div>
                                </div>)
                        }
                    })
                    }
                </div>
            </div>
        </div>
    )
}
export default StoreFinderTable
