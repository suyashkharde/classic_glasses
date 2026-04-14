// Cart is managed client-side (localStorage) for simplicity.
// This route exists for future server-side cart persistence.
const router = require('express').Router();
router.get('/', (req, res) => res.json({ message: 'Cart managed client-side' }));
module.exports = router;
