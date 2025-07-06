import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized- no token provided." });

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode)
      return res.status(401).json({ message: "Unauthorized- Invalid token." });

    const user = await User.findById(decode.UserId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware" + error.message);
  }
};
