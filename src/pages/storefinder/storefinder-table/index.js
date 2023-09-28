import './storefinder-table.css'
import {getDealers} from "../../../services/storefinder.service";
import {useEffect, useState} from "react";

const StoreFinderTable = () => {
	const [dealers, setDealers] = useState([])
	const getData = async () => {
		const dealerData = await getDealers()
		setDealers(dealerData.data.dealers)
	};
	useEffect(() => {
		getData();
	}, [])


	return (
		<div className='storefinderTable'>
			Storefinder Table

			<div className='storefinderTable__table'>
				<div className='storefinderTable__table__header'>

				</div>
				<div className='storefinderTable__table__items'>
					{dealers.map((store, index) => {
						if (store.name) {
							return (
								<div className='storefinderTable__table__item' key={store.id}>
									<div className='storefinderTable__table__item__key'>
										<strong>{store.name}</strong>
									</div>
									<div className='storefinderTable__table__item__key'>
										<a href={'mailto:' + store.email} style={{color: 'blue'}}>{store.email}</a>
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
										<a href={store.website} style={{color: 'blue'}}>
											{store.websiten}
										</a>
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