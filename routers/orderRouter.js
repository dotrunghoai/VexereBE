const express = require('express')
const router = express.Router()

const { getOrder } = require('../controllers/orderControl')

router.get('/order', getOrder)

module.exports = router