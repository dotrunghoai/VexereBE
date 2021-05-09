const express = require('express')
const router = express.Router()

const auth = require("../helpers/auth");
const { getOrder, getOrderByUser, deleteOrder } = require('../controllers/orderControl')

router.get('/order', getOrder)
router.get('/orderByUser', auth(['user']), getOrderByUser)
router.delete('/order', auth(['user']), deleteOrder)

module.exports = router