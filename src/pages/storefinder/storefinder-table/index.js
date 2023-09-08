import './storefinder-table.css'

const StoreFinderTable = () => {

	const dummyData = [{
		"id": "0101001692",
		"name": "Media Markt Haidhausen",
		"email": "glaesersar@mediamarkt.de",
		"latitude": 48.1362738,
		"longitude": 11.6139143,
		"city": "München"
	},
	{
		"id": "0101003497",
		"name": "Eduard Bauer",
		"email": "info@elektrobauer-muenchen.de",
		"latitude": 48.14256,
		"longitude": 11.61621,
		"city": "München"
	},
	{
		"id": "0101004990",
		"name": "Bulthaup München GmbH",
		"email": "info.herrnstrasse@bulthaup.com",
		"latitude": 48.13665,
		"longitude": 11.58216,
		"city": "München"
	},
	{
		"id": "0101002043",
		"name": "Elektro Lorenz Fischer",
		"email": "kontakt@elektrogeraete-fischer.de",
		"latitude": 48.1432836,
		"longitude": 11.5576586,
		"city": "München"
	},
	{
		"id": "0101002169",
		"name": "Saturn Electro Handels GmbH",
		"email": "muenchen-neuhauser@saturn.de",
		"latitude": 48.1382668,
		"longitude": 11.5674186,
		"city": "München"
	},
	{
		"id": "0101021501",
		"name": "Reform Furniture Germany GmbH",
		"email": "munich@reformcph.com",
		"latitude": 48.131483,
		"longitude": 11.5693239,
		"city": "München"
	},
	{
		"id": "0101016766",
		"name": "STUDIO43 GmbH",
		"email": "info@kuechenstudio43.de",
		"latitude": 48.1098793,
		"longitude": 11.5805425,
		"city": "München"
	},
	{
		"id": "0101013458",
		"name": "EP:Mayer",
		"email": "ep-mayer@t-online.de",
		"latitude": 48.09741,
		"longitude": 11.58161,
		"city": "München"
	},
	{
		"id": "0101022163",
		"name": "Küchenheld GmbH",
		"email": "info@kuechenheld.de",
		"latitude": 48.1551229,
		"longitude": 11.5792881,
		"city": "München"
	},
	{
		"id": "0101002026",
		"name": "Devin Küchen & Hausgeräte e.K.",
		"email": "info@devin.de",
		"latitude": 48.1887196,
		"longitude": 11.5864016,
		"city": "München"
	},]

	const filteredKeys= Object.keys(dummyData[0]).filter(key=>key !== "latitude" && key !== "longitude" && key !== "id")

	return (
		<div className='storefinderTable'>
			Storefinder Table

			<div className='storefinderTable__table'>
				<div className='storefinderTable__table__header'>

				</div>
				<div className='storefinderTable__table__items'>
				{dummyData.map((store, index) => {
				if (store.name) {
					return(
						<div className='storefinderTable__table__item' key={store.id}>
							<div className='storefinderTable__table__item__key'>
								<strong>{ store.name }</strong>
							</div>
							<div className='storefinderTable__table__item__key'>
								<a href={'mailto:' + store.email }>{ store.email }</a>
							</div>
							<div className='storefinderTable__table__item__key'>
								{ store.city }
							</div>
						</div>)
					}})
				}
				</div>
			</div>
		</div>
	)
}
export default StoreFinderTable