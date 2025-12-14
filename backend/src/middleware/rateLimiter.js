import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // Use IP address as identifier (before auth is implemented)
    const identifier = req.ip;

    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }

    next();
  } catch (error) {
    console.log("rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
