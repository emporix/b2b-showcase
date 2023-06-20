

export function getCodesIfProductNotFoundIn(
  stackableRedeemablesResultDiscountUnitWithPriceAndCodes,
  notFoundProductSourceIds,
) {
  const codesWithDuplicates =
    stackableRedeemablesResultDiscountUnitWithPriceAndCodes
      .map((stackableRedeemableResultDiscountUnitWithPriceAndCodes) => {
        const code =
          stackableRedeemableResultDiscountUnitWithPriceAndCodes?.code;
        const sourceId =
          stackableRedeemableResultDiscountUnitWithPriceAndCodes?.product
            ?.source_id;
        if (notFoundProductSourceIds.includes(sourceId)) {
          return code;
        }
        return undefined;
      })
      .filter((e) => !!e);

  // @ts-ignore
    return [...new Set(codesWithDuplicates)];
}
