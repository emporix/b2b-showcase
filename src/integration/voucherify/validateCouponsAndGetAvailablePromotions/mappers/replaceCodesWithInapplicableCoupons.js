
export function replaceCodesWithInapplicableCoupons(
  codes,
  errorMessage = `Product not found`,
) {
  return codes.map((code) => {
    return {
      status: 'INAPPLICABLE',
      id: code,
      object: 'voucher',
      result: {
        error: {
          code: 404,
          key: 'not_found',
          message: errorMessage,
          details: `Cannot find voucher with id ${code}`,
          request_id: undefined,
        },
      },
    };
  });
}
