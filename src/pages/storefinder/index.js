import Layout from '../Layout'
import StoreFinderTable from './storefinder-table'
import { getDealers } from 'services/dealers.service'


const StoreFinder = () => {
    const data = getDealers();
    console.log(data, [], false)

    const dummyData={
        "data": {
            "dealers": [
                {
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
                },
                {
                    "id": "0101010714",
                    "name": "Mömax",
                    "email": "muenchen@moemax.de",
                    "latitude": 48.19221,
                    "longitude": 11.59598,
                    "city": "München"
                },
                {
                    "id": "0100546612",
                    "name": "Jaron Reichmann",
                    "email": "info@handwerkmitkopf.com",
                    "latitude": 48.1177611,
                    "longitude": 11.5807842,
                    "city": "München"
                },
                {
                    "id": "0101002697",
                    "name": "F.S. Kustermann GmbH",
                    "email": null,
                    "latitude": 48.13571,
                    "longitude": 11.57567,
                    "city": "München"
                },
                {
                    "id": "0101005104",
                    "name": "Saturn PEP",
                    "email": "muenchen-pep@saturn.de",
                    "latitude": 48.1007548,
                    "longitude": 11.6445356,
                    "city": "München"
                },
                {
                    "id": "0101011013",
                    "name": "Küchen Schaaf",
                    "email": "info@kuechen-schaaf.de",
                    "latitude": 48.1252376,
                    "longitude": 11.5022599,
                    "city": "München"
                },
                {
                    "id": "4002000060",
                    "name": "Service Shop München",
                    "email": "MDO-SS_Muenchen@bshg.com",
                    "latitude": 48.1834403,
                    "longitude": 11.5853065,
                    "city": "München"
                },
                {
                    "id": "0101012385",
                    "name": "Bavaria Küchen-Technik GmbH",
                    "email": "o.saidely@bavariakuechen.de",
                    "latitude": 48.1559932,
                    "longitude": 11.561783,
                    "city": "München"
                },
                {
                    "id": "0101021843",
                    "name": "Freissle & Sohn GmbH",
                    "email": "info@freissleundsohn.de",
                    "latitude": 48.16461,
                    "longitude": 11.58905,
                    "city": "München"
                },
                {
                    "id": "0101003286",
                    "name": "Der Küchenschreiner",
                    "email": "fr@derkuechenschreiner.de",
                    "latitude": 48.11113,
                    "longitude": 11.56805,
                    "city": "München"
                },
                {
                    "id": "0101002498",
                    "name": "Küche&Co GmbH",
                    "email": "muenchen@kueche-co.de",
                    "latitude": 48.1455592,
                    "longitude": 11.4829947,
                    "city": "München"
                },
                {
                    "id": "0101002173",
                    "name": "AK Elektro Hausgeräte GmbH",
                    "email": "info@ak-elektro.de",
                    "latitude": 48.11617,
                    "longitude": 11.52691,
                    "city": "München"
                },
                {
                    "id": "0101000797",
                    "name": "Dross&Schaffer Ludwig 6",
                    "email": "ludwig6@dross-schaffer.com",
                    "latitude": 48.1454818,
                    "longitude": 11.5793296,
                    "city": "München"
                },
                {
                    "id": "0101018478",
                    "name": "POCO Einrichtungsmärkte GmbH",
                    "email": null,
                    "latitude": 48.19299,
                    "longitude": 11.59294,
                    "city": "München"
                },
                {
                    "id": "0101021818",
                    "name": "Musterhändler",
                    "email": null,
                    "latitude": 48.0888075,
                    "longitude": 11.6438047,
                    "city": "München"
                },
                {
                    "id": "0101005041",
                    "name": "Küchenhandel Paul Kuffner GmbH",
                    "email": "info@kukuema.de",
                    "latitude": 48.1924288,
                    "longitude": 11.5971142,
                    "city": "München"
                },
                {
                    "id": "0101002023",
                    "name": "Media Markt Euroindustriepark",
                    "email": "muenchen-euro@mediamarkt.de",
                    "latitude": 48.193076,
                    "longitude": 11.5894044,
                    "city": "München"
                },
                {
                    "id": "0101002024",
                    "name": "Wilhelm Gienger Küchen-",
                    "email": null,
                    "latitude": 48.142587,
                    "longitude": 11.5057912,
                    "city": "München"
                },
                {
                    "id": "0101000317",
                    "name": "Wilhelm Gienger Küchen",
                    "email": "info@gienger-kuechen.de",
                    "latitude": 48.142587,
                    "longitude": 11.5057912,
                    "city": "München"
                },
                {
                    "id": "0101002025",
                    "name": "Metro München-Freimann",
                    "email": null,
                    "latitude": 48.19449,
                    "longitude": 11.59967,
                    "city": "München"
                },
                {
                    "id": "0101019221",
                    "name": "Küche&Co GmbH",
                    "email": "muenchen-bogenhausen@kueche-co.de",
                    "latitude": 48.1717574,
                    "longitude": 11.6257608,
                    "city": "München"
                },
                {
                    "id": "0101005103",
                    "name": "Saturn OEZ",
                    "email": "muenchen-oez@saturn.de",
                    "latitude": 48.1836049,
                    "longitude": 11.5298678,
                    "city": "München"
                },
                {
                    "id": "0101002038",
                    "name": "Karstadt Warenhaus GmbH -041-",
                    "email": null,
                    "latitude": 48.140362,
                    "longitude": 11.5618223,
                    "city": "München"
                },
                {
                    "id": "0101018600",
                    "name": "Devin GmbH",
                    "email": "info@devin.de",
                    "latitude": 48.188827,
                    "longitude": 11.5863315,
                    "city": "München"
                },
                {
                    "id": "0101002476",
                    "name": "Wagner",
                    "email": "hgf-elektrowagner@arcor.de",
                    "latitude": 48.1851222,
                    "longitude": 11.524339,
                    "city": "München"
                },
                {
                    "id": "0101008183",
                    "name": "Radio Stöckle Walter Stöckle",
                    "email": "info@radio-stoeckl.de",
                    "latitude": 48.1314237,
                    "longitude": 11.5025097,
                    "city": "München"
                },
                {
                    "id": "0101004833",
                    "name": "Media Markt Solln",
                    "email": "muenchen.solln@mediamarkt.de",
                    "latitude": 48.0929406,
                    "longitude": 11.5040309,
                    "city": "München"
                },
                {
                    "id": "0101022391",
                    "name": "Küchen verliebt",
                    "email": "info@kuechenverliebt.de",
                    "latitude": 48.1904858,
                    "longitude": 11.547595,
                    "city": "München"
                },
                {
                    "id": "XXA01514",
                    "name": null,
                    "email": null,
                    "latitude": null,
                    "longitude": null,
                    "city": null
                },
                {
                    "id": "XXA01504",
                    "name": null,
                    "email": null,
                    "latitude": null,
                    "longitude": null,
                    "city": null
                },
                {
                    "id": "XXA01502",
                    "name": null,
                    "email": null,
                    "latitude": null,
                    "longitude": null,
                    "city": null
                },
                {
                    "id": "XXA01507",
                    "name": null,
                    "email": null,
                    "latitude": null,
                    "longitude": null,
                    "city": null
                },
                {
                    "id": "XXA01522",
                    "name": null,
                    "email": null,
                    "latitude": null,
                    "longitude": null,
                    "city": null
                },
                {
                    "id": "XXA01521",
                    "name": null,
                    "email": null,
                    "latitude": null,
                    "longitude": null,
                    "city": null
                },
                {
                    "id": "XXA01513",
                    "name": null,
                    "email": null,
                    "latitude": null,
                    "longitude": null,
                    "city": null
                },
                {
                    "id": "0101023020",
                    "name": "Mein Küchenatelier GmbH",
                    "email": "st@meinkuechenatelier.de",
                    "latitude": 48.0902385,
                    "longitude": 11.6125355,
                    "city": "München"
                },
                {
                    "id": "0101006899",
                    "name": "Sanline Möbelsysteme und",
                    "email": "zentral@sanline.biz",
                    "latitude": 48.142587,
                    "longitude": 11.5057912,
                    "city": "München"
                },
                {
                    "id": "0101022939",
                    "name": "Küchen Schaaf GmbH",
                    "email": "stephan@kuechen-schaaf.de",
                    "latitude": 48.1251031,
                    "longitude": 11.5022305,
                    "city": "München"
                },
                {
                    "id": "0101006626",
                    "name": "Küche & Co.",
                    "email": null,
                    "latitude": 48.1718238,
                    "longitude": 11.6257989,
                    "city": "München"
                },
                {
                    "id": "0101018449",
                    "name": "POCO Einrichtungsmärkte GmbH",
                    "email": null,
                    "latitude": 48.1280613,
                    "longitude": 11.6600186,
                    "city": "MUENCHEN TRUDERING"
                }
            ]
        }
    }
  return (
    <Layout title="Storefinder">
      <StoreFinderTable></StoreFinderTable>
    </Layout>
  )
}
export default StoreFinder

