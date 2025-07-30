import { calculateDiscountPrice } from "./DiscountPriceCalculator";

export const calculateSubtotal = (items, order = false) => {
    let subtotal = 0
    !order ? subtotal = items.reduce((accumulator, currentItem) => {
        return currentItem.product.discount != 0 ? currentItem.product.stock != 0 ? Math.round(accumulator + calculateDiscountPrice(currentItem.product.price, currentItem.product.discount) * currentItem.quantity) : 0 : currentItem.product.stock != 0 ? accumulator + currentItem.product.price * currentItem.quantity : 0;
    }, 0) : subtotal = items.products.reduce((accumulator, currentItem) => {
        return currentItem.discount != 0 ? Math.round(accumulator + calculateDiscountPrice(currentItem.price, currentItem.discount) * currentItem.quantity) : accumulator + currentItem.price * currentItem.quantity;
    }, 0);
    return subtotal
}
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