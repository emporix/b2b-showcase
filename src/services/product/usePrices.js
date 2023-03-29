import { TENANT } from "constants/localstorage";
import { api } from "services/axios";

const getTenant = () => localStorage.getItem(TENANT);

export const usePrices = () => {
  const matchPriceForProductAndQuantity = async (productId, quantity = 1) => {
    const { data } = await api.post(
      `/price/${getTenant()}/match-prices-by-context`,
      {
        items: [
          {
            itemId: { id: productId, itemType: "PRODUCT" },
            quantity: { quantity }
          }
        ]
      },
      {
        headers: {
          "X-Version": "v2"
        }
      }
    );
    return data;
  };


  return {
    matchPriceForProductAndQuantity
  };
};
