import razorpay from "../lib/razorpay.js";
import Coupon from "../models/coupon.model.js";
import { createNewCoupon } from "./coupon.controller.js";
import crypto from "crypto";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid or empty cart list" });
    }

    let totalAmount = 0;
    products.forEach((product) => {
      const amount = Math.round(product.price * 100); // *100 to convert to paise
      totalAmount += amount * product.quantity;
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((product) => ({
            id: product._id,
            quantity: product.quantity,
            price: product.price,
          }))
        ),
      },
    });

    // create new coupon for next purchase if total amount > 2000rs
    if (totalAmount >= 2000 * 100) {
      await createNewCoupon(req.user._id);
    }

    res.status(200).json({
      id: razorpayOrder.id,
      totalAmount: totalAmount / 100, // converting back to rupees
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res
      .status(500)
      .json({ message: "Error processing checkout: " + error.message });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    //verify payment signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (expectedSignature !== signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    const razorpayOrder = await razorpay.orders.fetch(orderId);

    // deactivate coupon if used
    if (razorpayOrder.notes?.couponCode) {
      await Coupon.findOneAndUpdate(
        {
          code: razorpayOrder.notes.couponCode,
          userId: razorpayOrder.notes.userId,
        },
        { isActive: false }
      );
    }

    // Create a new Order in DB
    const products = JSON.parse(razorpayOrder.notes.products);
    const newOrder = new Order({
      user: razorpayOrder.notes.userId,
      products: products.map((product) => ({
        product: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: razorpayOrder.amount / 100, // Convert back to INR
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message:
        "Payment successful, order created, and coupon deactivated if used.",
      orderId: newOrder._id,
    });
  } catch (error) {
    console.error("Error processing successful checkout:", error);
    res
      .status(500)
      .json({
        message: "Error processing successful checkout",
        error: error.message,
      });
  }
};
