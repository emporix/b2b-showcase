export class CartUpdateActions {
     availablePromotions = [];
     setAvailablePromotions(value) {
        this.availablePromotions = value;
    }
     totalDiscountAmount = 0;
     setTotalDiscountAmount(value) {
        this.totalDiscountAmount = value;
    }
     productsToAdd = [];
     setProductsToAdd(value) {
        this.productsToAdd = value;
    }
     applicableCoupons = [];
     setApplicableCoupons(value) {
        this.applicableCoupons = value;
    }
     inapplicableCoupons = [];
     setInapplicableCoupons(value) {
        this.inapplicableCoupons = value;
    }
     sessionKey;
     setSessionKey(value) {
        this.sessionKey = value;
    }

     getValidationResult() {
        const inapplicableCoupons = this.inapplicableCoupons;
        return {
            availablePromotions: this.availablePromotions,
            applicableCoupons: this.applicableCoupons,
            inapplicableCoupons,
            newSessionKey: this.sessionKey ?? null,
            totalDiscountAmount: this.totalDiscountAmount,
            productsToAdd: this.productsToAdd ?? [],
            allInapplicableCouponsArePromotionTier:
                this.applicableCoupons.length || inapplicableCoupons.length
                    ? checkIfAllInapplicableCouponsArePromotionTier(inapplicableCoupons)
                    : undefined,
        };
    }
}


function checkIfAllInapplicableCouponsArePromotionTier(
    notApplicableCoupons,
) {
    const inapplicableCouponsPromitonTier = notApplicableCoupons.filter(
        (notApplicableCoupon) => notApplicableCoupon.object === 'promotion_tier',
    );

    return notApplicableCoupons.length === inapplicableCouponsPromitonTier.length;
}
