const response = require("../utils/response");
const { generateAuthToken } = require("../utils/token");
const { getRandomKey } = require("../utils/random");
const registrationService = require("../services/registration");
const eventService = require("../services/event");
const couponService = require("../services/coupons");

const { DuplicateError, BadRequestError } = require("../lib/errors");

const { omit } = require("lodash");

class RegistrationController {
  async create(req, res) {
    const event = await eventService.findByEventCode(req.body.eventCode);
    if (!event) throw new BadRequestError("Invalid Event");
    req.body.event = event._id;

    const paymentId = event.eventCode + getRandomKey(5);
    const transaction = { amount: 1000, hasPaid: false, paymentId };

    if (req.body.ticket === "VIP") transaction.amount = 5000;

    const couponCode = req.body?.couponCode;
    if (couponCode) {
      const coupon = await couponService.findByCode(event.id, couponCode);
      if (!coupon) throw new BadRequestError("Invalid Coupon");
      if (coupon.ticket !== req.body.ticket) {
        throw new BadRequestError(
          `Coupon is not valid for the ${req.body.ticket} ticket`
        );
      }

      transaction.hasPaid = true;
    }
    req.body.transaction = transaction;
    const existingRegistration = await registrationService.findByEvent(
      event.id,
      req.body.email
    );
    if (existingRegistration && existingRegistration.transaction.hasPaid) {
      throw new BadRequestError("You are already registered for this event");
    }
    let registration;
    if (existingRegistration && !existingRegistration.transaction.hasPaid) {
      registration = await registrationService.update(
        existingRegistration.id,
        req.body
      );
    } else {
      registration = await registrationService.create(req.body);
    }

    res.send(response("Event Registration created successfully", registration));
  }
}

module.exports = new RegistrationController();
