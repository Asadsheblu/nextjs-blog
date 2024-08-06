const User = require('../models/user'); // Ensure the correct path to your user model

const checkAccess = async (req, res, next) => {
  const userId = req.userId; // Assuming you have userId in the request

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentDate = new Date();

    if (user.subscriptionExpiryDate && user.subscriptionExpiryDate > currentDate) {
      user.hasUnlimitedAccess = true;
    } else {
      user.hasUnlimitedAccess = false;
    }

    if (!user.hasUnlimitedAccess && user.fetchCount >= 2) {
      return res.status(403).json({ error: 'Fetch limit exceeded. Please upgrade for unlimited access.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = checkAccess;
