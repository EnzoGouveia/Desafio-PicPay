const { Router } = require("express");
const TransactionController = require("../controllers/TransactionController");

const router = Router();

router.post('/transaction', TransactionController.transaction);

module.exports = router;