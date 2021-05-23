const express = require('express')
const router = express.Router()

const auth = require("../helpers/auth");
const { getOrder, getOrderFutureByUser, getOrderPassByUser, deleteOrder, getProfit6Month, getTop5Brand, getTop5Station, getCountOrder } = require('../controllers/orderControl')

router.get('/order', getOrder)
router.get('/orderFutureByUser', auth(['user']), getOrderFutureByUser)
router.get('/orderPassByUser', auth(['user']), getOrderPassByUser)
router.delete('/order', auth(['user']), deleteOrder)
router.get('/top5Brand', auth(['admin']), getTop5Brand)
router.get('/top5Station', auth(['admin']), getTop5Station)
router.get('/countOrder', auth(['admin']), getCountOrder)
router.get('/profit6Month', auth(['admin']), getProfit6Month)

module.exports = router