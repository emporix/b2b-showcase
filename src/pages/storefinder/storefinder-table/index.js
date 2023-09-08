const StoreFinderTable = () => {

	const dummyData = [{
		"id": "0101001692",
		"name": "Media Markt Haidhausen",
		"email": "glaesersar@mediamarkt.de",
		"latitude": 48.1362738,
		"longitude": 11.6139143,
		"city": "München"
	}]

	const filteredKeys= Object.keys(dummyData[0]).filter(key=>key !== "latitude" && key !== "longitude" && key !== "id")

	return (
		<div>
			Storefinder Table
			<table>
				<tr key={"header"}>
					{Object.values(filteredKeys).map(value => (
						<th>{value}</th>
					))}

				</tr>
			{dummyData.map((store, index) => {
				if (store.name) {
					return(<tr key={store.id}>
						{filteredKeys.map(key => <td key={key}>{store[key]}</td>)}
					</tr>)
				}
			})
			}
			</table>
		</div>
	)
}
export default StoreFinderTable