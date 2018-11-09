const express = require('express');
const router = express.Router({mergeParams: true}); // allow access to User ID

const { createMessage } = require('../handlers/messages');

// prefix - /api/users/:id/messages
router.route('/').post(createMessage);

module.exports = router