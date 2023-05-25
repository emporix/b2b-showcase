const getContentfulEntryFields = async (entryId) => {
  const url =
    process.env.REACT_APP_CONTENTFUL_MODE === 'PROD'
      ? `https://cdn.contentful.com/spaces/${process.env.REACT_APP_CONTENTFUL_SPACE_ID}/environments/master/entries/${entryId}?access_token=${process.env.REACT_APP_CONTENTFUL_DELIVERY_API_ACCESS_TOKEN}`
      : `https://preview.contentful.com/spaces/${process.env.REACT_APP_CONTENTFUL_SPACE_ID}/environments/master/entries/${entryId}?access_token=${process.env.REACT_APP_CONTENTFUL_PREVIEW_API_ACCESS_TOKEN}`

  const response = await fetch(url, {
    method: 'GET',
  })
  try {
    const responseJSON = await response.json()
    if (responseJSON?.fields) {
      return responseJSON.fields
    }
    //someone had to remove the entry
    console.log(responseJSON)
    //Voucherify fallback will be used
    return {}
  } catch (e) {
    console.log(e)
    return {}
  }
}

export default getContentfulEntryFields
