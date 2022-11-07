const router = require("express").Router();

import transactionsService from "../../modules/transactions/transactions.service";
import response from "../../utils/response";
import { UnAuthorizedError } from "../../config/errors";
import fs from "fs";
import registrationController from "../controllers/registration";

const getFlutterwaveWebhook = async (req, res) => {
  // If you specified a secret hash, check for the signature
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== secretHash) {
    // This request isn't from Flutterwave; discard
    res.status(401).end();
  }
  const payload = req.body;
  // It's a good idea to log all received events.
  fs.writeFileSync("flw-webhook.json", JSON.stringify(payload));

  return payload;
};

router.post("/webhooks/flutterwave", async (req, res) => {
  const data = getFlutterwaveWebhook(req);
  if (!data) throw new UnAuthorizedError("Cannot access link");
  
  const trans = await registrationController.create(txn);
  res.send(response("transaction complete", trans));
});

export default router;
