import { calculateDiscountPrice } from "./DiscountPriceCalculator";

export const calculateSubtotal = (items, order = false) => {
    let subtotal = 0;

    if (!order) {
        subtotal = items.reduce((acc, item) => {
            const { product, quantity } = item;

            if (product.stock === 0) return acc;

            const discount =
                product.flashSaleDiscount != null
                    ? product.flashSaleDiscount
                    : product.discount || 0;

            const price = discount
                ? calculateDiscountPrice(product.price, discount)
                : product.price;

            return acc + Math.round(price * quantity);
        }, 0);
    } else {
        subtotal = items.products.reduce((acc, item) => {
            const { price, discount, flashSaleDiscount, quantity } = item;

            const appliedDiscount =
                flashSaleDiscount != null ? flashSaleDiscount : discount || 0;

            const finalPrice = appliedDiscount
                ? calculateDiscountPrice(price, appliedDiscount)
                : price;

            return acc + Math.round(finalPrice * quantity);
        }, 0);
    }

    return subtotal;
};
export const calculateCouponAmount = (coupon, price = 0) => {



    if (!coupon) return 0;

    if (coupon.discountType === 'fixed') {
        return coupon.discountValue;
    } else if (coupon.discountType === 'percentage') {
        return (coupon.discountValue / 100) * price;
    } else {
        return 0;
    }
};

export const calculateTotal = (subtotal, discount, shipping) => {
    return (subtotal - discount) + shipping
}