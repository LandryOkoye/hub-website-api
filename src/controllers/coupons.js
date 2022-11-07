const response = require("../utils/response");

const couponService = require("../services/coupons");
const eventService = require("../services/event");
const { getRandomKey } = require("../utils/random");

class CouponsController {
  async getAll(req, res) {
    const coupons = await couponService.getAllCoupons();
    res.send(response("All Coupons retrieved successfully", coupons));
  }

  async getByEvent(req, res) {
    const coupons = await couponService.findByEvent(req.params.eventId);

    res.send(response("Coupons retrieved successfully", coupons));
  }

  async create(req, res) {
    const event = await eventService.findById(req.body.eventId);
    if (!event) return res.send(response("Invalid Event"));

    const couponCode = getRandomKey(4).toUpperCase();
    await couponService.create({ event: req.body.eventId, couponCode });
    const coupons = await couponService.findByEvent(req.body.eventId);

    res.send(response("Coupon was created successfully", coupons));
  }

  async update(req, res) {
    let updatedCoupon = await couponService.update(req.params.id, req.body);
    if (!updatedCoupon) return res.send(response("Invalid Coupon"));

    res.send(response("Coupon updated successfully", updatedCoupon));
  }

  async delete(req, res) {
    await couponService.delete(coupon.id);
    res.send(response("Coupon deleted successfully"));
  }
}

module.exports = new CouponsController();
