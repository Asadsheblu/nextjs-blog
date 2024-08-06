const rateLimitStore = {};

const rateLimit = ({ interval, limit }) => {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const currentTime = Date.now();

    if (!rateLimitStore[ip]) {
      rateLimitStore[ip] = { count: 1, firstRequestTime: currentTime };
    } else {
      rateLimitStore[ip].count += 1;
    }

    const { count, firstRequestTime } = rateLimitStore[ip];

    if (count > limit && currentTime - firstRequestTime < interval) {
      res.status(429).json({ message: 'You have reached the request limit. Please upgrade for unlimited access.' });
    } else {
      if (currentTime - firstRequestTime >= interval) {
        rateLimitStore[ip].count = 1;
        rateLimitStore[ip].firstRequestTime = currentTime;
      }
      next();
    }
  };
};

export default rateLimit;
