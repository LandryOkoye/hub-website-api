const Coupon = require("../models/coupons");

class CouponService {
  getAllCoupons() {
    return Coupon.find().select("-__v");
  }

  create(coupon) {
    return Coupon.create(coupon);
  }

  findById(id) {
    return Coupon.findById(id);
  }

  findByEvent(eventId) {
    return Coupon.find({ event: eventId });
  }

  update(id, updateQuery) {
    return Coupon.findByIdAndUpdate(id, updateQuery, { new: true });
  }

  delete(id) {
    return Coupon.findByIdAndDelete(id);
  }
}

module.exports = new CouponService();
