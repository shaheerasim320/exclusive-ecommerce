export const calculateDiscountPrice = (originalPrice, discountPercentage) => {
    const discountAmount = (originalPrice * discountPercentage) / 100;
    return originalPrice - discountAmount;
};