import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const user = req.user; // user from protectRoute
    const coupon = await Coupon.findOne({ userId: user._id, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ discountPercentage: coupon.discountPercentage });
  } catch (error) {
    console.log("Error in getCoupon Controller: " + error);
    res.status(500).json({ message: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const code = req.body.code;
    const user = req.user; // user from protectRoute
    const coupon = await Coupon.findOne({
      code: code,
      userId: user._id,
      isActive: true,
    });
    if (!coupon) {
      return res.status(404).json({ message: "No coupon found" });
    }
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }
    res.status(200).json({
      message: "Coupon is valid",
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon Controller: " + error);
    res.status(500).json({ message: error.message });
  }
};

export const createNewCoupon = async (userId) => {
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(), // Generate a random coupon code
        discountPercentage: 10, // Set discount percentage
        isActive: true,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valid for 30 days
        userId: userId,
    });
    await newCoupon.save();
    return newCoupon;
};
