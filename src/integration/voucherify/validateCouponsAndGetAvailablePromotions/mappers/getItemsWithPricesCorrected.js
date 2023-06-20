import {mapItemsToVoucherifyOrdersItems} from "./product";

export function getItemsWithCorrectedPrices(
  ordersItems,
  items,
  pricesIncorrect,
) {
  return [
    ...mapItemsToVoucherifyOrdersItems(items),
    ...ordersItems
      .filter((item) => {
        const currentItemSourceId = item?.product?.source_id;
        return pricesIncorrect.find(
          (price) => price.id === currentItemSourceId,
        );
      })
      .map((item) => {
        const currentItemSourceId = item?.product?.source_id;
        const priceIncorrect = pricesIncorrect.find(
          (price) => price.id === currentItemSourceId,
        );
        if (priceIncorrect) {
          return {
            source_id: item.sku.source_id,
            related_object: 'sku',
            price: priceIncorrect.price,
            product: { override: true, name: item.product.name },
            sku: {
              override: true,
              sku: item.sku.sku,
              price: priceIncorrect.price,
            },
          };
        }
      }),
  ];
}
