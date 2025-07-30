const PaymentCardRow = ({ card, onDelete }) => {
    const handleDelete = () => {
        onDelete(card.id);
    };

    // Determine card image based on brand, with placeholders for safety
    const getCardImageSrc = (brand) => {
        switch (brand) {
            case "visa":
                return "https://img.icons8.com/color/48/000000/visa.png"; // Better placeholder example
            case "unionpay": // Often 'unionpay' is the brand value
                return "https://img.icons8.com/color/48/000000/unionpay.png";
            case "mastercard":
                return "https://img.icons8.com/color/48/000000/mastercard.png";
            case "amex":
                return "https://img.icons8.com/color/48/000000/amex.png";
            case "discover":
                return "https://img.icons8.com/color/48/000000/discover.png";
            case "diners":
                return "https://img.icons8.com/color/48/000000/diners-club.png";
            case "jcb":
                return "https://img.icons8.com/color/48/000000/jcb.png";
            default:
                return "https://placehold.co/40x40/cccccc/000000?text=Card"; // Generic placeholder
        }
    };

    return (
        // Changed from <tr> to <div> for better flexbox control.
        // Added `rounded-md` and `bg-white` for a card-like appearance,
        // and `mb-3` for vertical spacing between cards.
        <div
            className="
                w-full bg-white  p-4 mb-3
                flex flex-col sm:flex-row items-start sm:items-center justify-between
                
            "
        >
            {/* Left Section: Card Brand Icon & Last 4 Digits */}
            {/* Flex items-center for horizontal alignment, gap for spacing */}
            <div className="flex items-center gap-4 md:w-1/2 sm:w-auto flex-grow-0 sm:flex-grow mb-3 sm:mb-0">
                <img
                    src={getCardImageSrc(card?.brand)}
                    alt={`${card?.brand} card`}
                    className="w-10 h-10 object-contain flex-shrink-0"
                />
                {/* Use `break-all` for last 4 digits to prevent overflow on very small screens if necessary */}
                <span className="text-sm md:text-base font-medium text-gray-800 break-all">
                    ************{card?.last4}
                </span>
            </div>

            {/* Right Section: Expiry Date & Delete Button */}
            {/* Stacks vertically on mobile, goes horizontal on sm+ */}
            {/* `sm:items-center` for better alignment when side-by-side */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 md:w-1/2 sm:w-auto md:justify-between">
                <span className="text-sm md:text-base text-gray-700 whitespace-nowrap">
                    {card?.exp_month < 10 ? `0${card?.exp_month}` : card?.exp_month}/{card?.exp_year}
                </span>
                <button
                    className="
                        text-sm md:text-base text-[#DB4444] hover:text-[#A33737]
                        cursor-pointer font-semibold py-1 px-2 rounded-md
                        transition-colors whitespace-nowrap self-start sm:self-auto
                    "
                    onClick={handleDelete}
                >
                    DELETE
                </button>
            </div>
        </div>
    );
};

export default PaymentCardRow;