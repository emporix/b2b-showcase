import { uniqBy } from 'lodash';

export function couponsStatusDeleted(coupons) {
  return coupons.filter((coupon) => coupon.status === 'DELETED');
}

export function couponsStatusApplied(coupons) {
  return coupons.filter((coupon) => coupon.status === 'APPLIED');
}

export function couponsStatusNew(coupons) {
  return coupons.filter((coupon) => coupon.status === 'NEW');
}

export function filterOutCouponsTypePromotionTier(coupons) {
  return coupons.filter((coupon) => coupon.type !== 'promotion_tier');
}

export function uniqueCouponsByCodes(coupons) {
  return uniqBy(coupons, 'code');
}

export function codesFromCoupons(coupons) {
  return coupons.map((coupon) => coupon.code);
}

export function filterCouponsStatusAppliedAndNewByLimit(
  coupons,
  couponsLimit = 5,
) {
  return [
    ...[...couponsStatusApplied(coupons), ...couponsStatusNew(coupons)].splice(
      0,
      couponsLimit,
    ),
  ];
}

export function filterOutCouponsIfCodeIn(
  coupons,
  forbiddenCodes,
) {
  return coupons.filter((coupon) => !forbiddenCodes.includes(coupon.code));
}
