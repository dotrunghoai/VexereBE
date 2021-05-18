const express = require('express')
const router = express.Router()

const auth = require("../helpers/auth");
const { getOrder, getOrderFutureByUser, getOrderPassByUser, deleteOrder, getProfit5Month, getTop5Brand } = require('../controllers/orderControl')

router.get('/order', getOrder)
router.get('/orderFutureByUser', auth(['user']), getOrderFutureByUser)
router.get('/orderPassByUser', auth(['user']), getOrderPassByUser)
router.delete('/order', auth(['user']), deleteOrder)
router.get('/profit5Month', auth(['admin']), getProfit5Month)
router.get('/top5Brand', auth(['admin']), getTop5Brand)

module.exports = router