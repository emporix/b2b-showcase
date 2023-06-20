export const getQualificationsPerProducts = (qualifications, productsIds) => {
  return qualifications.reduce(
    (accumulator, qualificationExtended) => {
      const applicable_to =
        qualificationExtended.qualification?.applicable_to?.data || []
      const sourceIds =
        applicable_to
          .map((applicableTo) => applicableTo.source_id)
          .filter((e) => e) || []
      sourceIds.forEach((sourceId) => {
        if (
          accumulator.find(
            (allQualificationsPerProduct) =>
              allQualificationsPerProduct.productId === sourceId
          )
        ) {
          return accumulator.map((allQualificationsPerProducts) => {
            if (allQualificationsPerProducts.productId === sourceId) {
              allQualificationsPerProducts.qualifications = [
                ...allQualificationsPerProducts.qualifications,
                qualificationExtended,
              ]
            }
            return allQualificationsPerProducts
          })
        }
      })
      return accumulator
    },
    productsIds.map((productId) => {
      return {
        productId: productId,
        qualifications: [],
      }
    })
  )
}
