const Order = require("../models/orderModel")
const Trip = require("../models/tripModel")

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

const getOrderFutureByUser = async (req, res) => {
    try {
        const foundOrder = await Order.find({ userID: req.user._id })
            .populate('tripID brandID carID', 'startedDate departureTime brandName licensePlate')
        const filterOrder = foundOrder.filter(item => item.tripID.departureTime >= new Date())
        res.status(200).send(filterOrder)
    } catch (error) {
        console.log(error)
        res.status(500).send({ meesage: 'Something went wrong!' })
    }
}

const getOrderPassByUser = async (req, res) => {
    try {
        const foundOrder = await Order.find({ userID: req.user._id })
            .populate('tripID brandID carID', 'startedDate departureTime brandName licensePlate')
        const filterOrder = foundOrder.filter(item => item.tripID.departureTime < new Date())
        res.status(200).send(filterOrder)
    } catch (error) {
        console.log(error)
        res.status(500).send({ meesage: 'Something went wrong!' })
    }
}

const deleteOrder = async (req, res) => {
    try {
        const { orderID } = req.query
        const foundOrder = await Order.findById(orderID)
        if (!foundOrder) {
            return res.status(404).send({ message: 'The order not found!' })
        }
        const foundTrip = await Trip.findById(foundOrder.tripID)
        if (!foundTrip) {
            return res.status(404).send({ message: 'Thr trip not found!' })
        }
        if (foundTrip.departureTime < new Date()) {
            return res.status(400).send({ message: 'The trip is over!' })
        }
        for (let index = 0; index < foundOrder.arrayOfSeat.length; index++) {
            const seat = foundOrder.arrayOfSeat[index];
            const foundSeat = foundTrip.arrayOfSeat.findIndex(
                item => item.seatName === seat && item.status === 'booked'
            )
            if (foundSeat === -1) {
                return res.status(400).send({ message: `Seat ${seat} has not been booked!` })
            }
            foundTrip.arrayOfSeat[foundSeat].userID = null
            foundTrip.arrayOfSeat[foundSeat].status = 'available'
        }
        await foundTrip.save()
        await Order.findByIdAndRemove(orderID)
        res.status(202).send({ message: 'The order has been deleted successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ meesage: 'Something went wrong!' })
    }
}

const getProfit5Month = async (req, res) => {
    try {
        const findOrder = await Order.find().populate('tripID', 'departureTime')
        const orderFilter = findOrder.filter(item => item.tripID.departureTime > new Date())
        res.status(200).send(orderFilter)
    } catch (error) {
        console.log(error)
        res.status(500).send({ meesage: 'Something went wrong!' })
    }
}

module.exports = { getOrder, getOrderFutureByUser, getOrderPassByUser, deleteOrder, getProfit5Month }