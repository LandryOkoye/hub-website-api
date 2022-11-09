const router = require("express").Router();

import response from "../../utils/response";
import { UnAuthorizedError } from "../../config/errors";
import fs from "fs";
import registrationService from "../services/registration";
import { BadRequestError } from "../lib/errors";

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

router.post("/webhooks/flutterwave", async (req, res) => {
  const payload = await getFlutterwaveWebhook(req);

  //check if the payment exist in the flutterwave database
  const validPayment = await flw.Transaction.verify({ id: payload.data.id });
  console.log("Valid Payment", validPayment);
  if (
    !validPayment?.data ||
    validPayment.data.status !== "successful" ||
    validPayment.data.currency !== "NGN"
  )
    throw new BadRequestError("Invalid Payment");

  const validRegistration = await registrationService.findAndUpdate(
    {
      paymentId: validPayment.data.tx_ref,
      "transaction.amount": validPayment.data.amount,
    },
    { transaction: { hasPaid: true } }
  );
  console.log("Valid Registration", validRegistration);

  if (!validRegistration) throw new BadRequestError("Invalid Registration");

  res.send(response("Payment Successful"));
});

export default router;
