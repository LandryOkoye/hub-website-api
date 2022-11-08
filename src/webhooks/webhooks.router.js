const router = require("express").Router();

import transactionsService from "../../modules/transactions/transactions.service";
import response from "../../utils/response";
import { UnAuthorizedError } from "../../config/errors";
import fs from "fs";
import registrationController from "../controllers/registration";
import Registration from "../models/registration";
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC, process.env.FLW_SECRET);



const getFlutterwaveWebhook = async (req, res) => {
  // If you specified a secret hash, check for the signature
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers["verif-hash"];
  if (!signature || signature !== secretHash) {
    throw new UnAuthorizedError("Invalid signature");
    res.status(401).end();
  }

  const payload = req.body;
  const transactionId = payload.data.id; 

  //check if the payment exist in the flutterwave database
  const checkPayment = await flw.Transaction.verify({ id: transactionId })
  if (checkPayment.data === null || !checkPayment)
    throw new UnAuthorizedError('Your Payment was not found, kindly contact support if your bank payment was successful');

  const checkRegistration = await Registration.findOne({ paymentId: checkPayment.data.tx_ref });
  if (!checkRegistration)
    throw new UnAuthorizedError('Your Transaction was not found, kindly contact support if your bank payment was success');

  if (
    checkPayment.data.status === "successful"
    && checkPayment.data.amount >= + checkRegistration.transaction.amount
    && checkPayment.data.currency === "NGN"
  ) {

    //update the registration model
    const updateRegistration = await Registration.findByIdAndUpdate(checkRegistration._id, {
      transaction: {
        hasPaid: true
      }
    }, { new: true });
    
    if (!updateRegistration) throw new UnAuthorizedError('Registration payment was not updated successfully, kindly contact support');

  }

  

  return updateRegistration;
};

router.post("/webhooks/flutterwave", async (req, res) => {
  const data = getFlutterwaveWebhook(req);
  if (!data) throw new UnAuthorizedError("Cannot access link");
  
 
  res.send(response("transaction complete", result));
});

export default router;
