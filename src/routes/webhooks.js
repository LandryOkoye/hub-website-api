const router = require("express").Router();

const response = require("../utils/response");
const fs = require("fs");
const registrationService = require("../services/registration");
const { BadRequestError, UnAuthorizedError } = require("../lib/errors");

const Flutterwave = require("flutterwave-node-v3");
const flw = new Flutterwave(process.env.FLW_PUBLIC, process.env.FLW_SECRET);

const getFlutterwaveWebhook = (req) => {
  console.log("FLW Webhook", req.body);

  // If you specified a secret hash, check for the signature
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== secretHash)
    throw new UnAuthorizedError("Invalid signature");

  fs.writeFileSync("flw-webhook.json", JSON.stringify(req.body));
  return req.body;
};

module.exports = function () {
  router.post("/webhooks/flutterwave", async (req, res) => {
    const payload = getFlutterwaveWebhook(req);

    //check if the payment exist in the flutterwave database
    const validPayment = await flw.Transaction.verify({ id: payload.data.id });

    console.log("Valid Payment", validPayment);
    if (
      validPayment.data.status !== "successful" ||
      validPayment.data.currency !== "NGN"
    )
      throw new BadRequestError("Invalid Payment");

    const validRegistration = await registrationService.findOneAndUpdate(
      {
        "transaction.paymentId": validPayment.data.tx_ref,
        "transaction.amount": validPayment.data.amount.toString(),
      },
      { transaction: { hasPaid: true } }
    );
    console.log("Valid Registration", validRegistration);

    if (!validRegistration) throw new BadRequestError("Invalid Registration");

    res.send(response("Payment Successful"));
  });

  return router;
};
