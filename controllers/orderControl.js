const Order = require("../models/orderModel")

const getOrder = async (req, res) => {
    try {
        const foundOrder = await Order.find().
            populate('userID tripID carID brandID',
                'username email phoneNumber startedDate departureTime brandName licensePlate -_id')
        // if (foundOrder.length === 0) {
        //     return res.status(404).send({ message: 'Not Found Order' })
        // }
        res.status(200).send(foundOrder)
    } catch (error) {
        console.log(error)
        res.status(500).send({ meesage: 'Something went wrong!' })
    }
}

module.exports = { getOrder }