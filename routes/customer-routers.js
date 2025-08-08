const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer-controller');

router.get('/', customerController.getAllCustomers);
router.get('/search', customerController.searchCustomers);
router.post('/create', customerController.createCustomer);
router.put('/edit/:id', customerController.editCustomer);
router.delete('/delete/:id', customerController.deleteCustomer);

module.exports = router;