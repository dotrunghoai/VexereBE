const express = require('express')
const router = express.Router()

const auth = require("../helpers/auth");
const { getOrder, getOrderByUser } = require('../controllers/orderControl')

router.get('/order', getOrder)
router.get('/orderByUser', auth(['user']), getOrderByUser)

module.exports = router