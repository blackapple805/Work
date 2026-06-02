// routes/users.js

const auth = require('../middleware/auth');

// Example protected route
router.get('/', auth, async (req, res) => {
  // Only accessible if authenticated
});
