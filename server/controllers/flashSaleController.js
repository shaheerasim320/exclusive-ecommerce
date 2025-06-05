import FlashSale from "../models/FlashSaleSchema.js"

const addFlashSale = async (req, res) => {
    try {
        const { title, startTime, endTime, products, isActive } = req.body
        const flashSale = new FlashSale({ title, startTime, endTime, products, isActive })
        await flashSale.save()
        res.status(201).json({ message: "Flash Sale Created" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Error in creating new flash sale" })
    }
}

const getActiveFlashSale = async (req, res) => {
    try {
        const now = new Date();
        const flashSale = await FlashSale.find({ isActive: true, startTime: { $lte: now }, endTime: { $gte: now } }).populate("products.product");
        res.status(200).json(flashSale)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Error in fetching flash sale" })
    }
}

const updateFlashSale = async (req, res) => {
    try {
        const { flashSaleID, updatedData } = req.body
        if (!flashSaleID) {
            return res.status(400).json({ message: "Flash Sale ID is required" })
        }
        await FlashSale.findByIdAndUpdate(flashSaleID, updatedData, { new: true })
        res.status(200).json({ message: "Requested resource updated successully" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Unable to update requested resource" })
    }
}

const fetchAllFlashSales = async (req, res) => {
    try {
        const flashSales = await FlashSale.find()

        res.status(200).json(flashSales)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Unable to fetch all flash sales " })
    }
}

const fetchFlashSaleByID = async (req, res) => {
    const flashSaleID = req.params.flashSaleID
    try {
        if (!flashSaleID) {
            return res.status(400).json({ message: "Flash Sale ID is requires" })
        }
        const flashSale = await FlashSale.findById(flashSaleID)
        if (!flashSale) {
            return res.status(404).json({ message: "Requested resource with given parameters not found" })
        }
        res.status(200).json(flashSale)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Unable to fetch flash sale by id " })
    }
}

const deleteFlashSale = async (req, res) => {
    const flashSaleID = req.params.flashSaleID
    try {
        if (!flashSaleID) {
            return res.status(400).json({ message: "Flash Sale ID is requires" })
        }
        await FlashSale.findByIdAndDelete(flashSaleID)
        res.status(200).json({ message: "Flash sale deleted successfully" })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: "Unable to delete flash sale " })
    }
}


export { addFlashSale, getActiveFlashSale, updateFlashSale, fetchAllFlashSales, fetchFlashSaleByID, deleteFlashSale }