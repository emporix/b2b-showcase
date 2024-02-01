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
            {/* <div className='storefinderTable__table__header'>
                Unsere Lokalen Verkaufspartner
            </div> */}
            <div className='storefinderTable__table'>
                <div className='storefinderTable__table__items gap-4'>
                    {dealers.map((store, index) => {
                        if (store.name) {
                            return (
                                <div className='storefinderTable__table__item flex flex-col rounded-xl standard_box_shadow bg-aliceBlue' key={store.id}>
                                    <img src='/img/wineDealerBackground.png'
                                         alt="Store Image"
                                         style={{borderRadius: '5px'}}/>
                                    <div className='flex flex-col'>
                                        <div className='text-left w-full text-2xl text-eerieBlack font-light'>
                                            {store.name}
                                        </div>
                                        <div>
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
                                                <a href={store.website}>Website
                                                </a>
                                            </div>
                                            <div className='storefinderTable__table__item__key'>
                                                <a href={'mailto:' + store.email}>Send mail</a>
                                            </div>
                                        </div>
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
