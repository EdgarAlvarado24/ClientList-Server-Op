const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer-controller');

router.get('/', customerController.getAllCustomers);
router.get('/search', customerController.searchCustomers);
router.post('/', customerController.createCustomer);

module.exports = router;