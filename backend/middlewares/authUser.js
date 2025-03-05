import jwt from 'jsonwebtoken';
// Admin auth Middleware
const authUser = async (req, res, next) => {
  try {
    // get token
    const { token } = req.headers;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized user Login Again",
      });
    }
    //  decode token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
     req.body.userId = token_decode.id
    next();
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
export default authUser