const express = require('express');
const router = express.Router();
const { exampleController } = require('../controllers');

router.get('/example', exampleController.getExample);
router.post('/example', exampleController.createExample);

module.exports = router;