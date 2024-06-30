import { Request, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import Wallet, { IWallet } from "../../models/Wallet";
import Transaction, { ITransaction, TransactionStatus, TransactionType, TTransaction } from "../../models/Transaction";
import producer from "../../eventControllers/producer";
import * as mongoose from "mongoose";

export const initiateTransaction = async (req: Request, res: Response) => {
  const walletId = req.params.walletId;
  const { amount, description } = req.body;

  if (!walletId) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [
        {
          msg: "Wallet Id required",
        },
      ],
    });
  }

  if (!amount && parseFloat(amount) !== Number.NaN) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [
        {
          msg: "Amount required",
        },
      ],
    });
  }

  try {
    const wallet: IWallet = await Wallet.findOne({_id: walletId});

    if (!wallet) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({msg: "Wallet not found"});
    }

    const updatedBalance = wallet.balance + parseFloat(amount) ?? 0.0000;

    if ((updatedBalance) <= 0) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .send({ response: 'Insufficient Balance' });
    }

    const transactionInfo : TTransaction = {
      amount: parseFloat(amount),
      description: description,
      walletId: walletId,
      balance: parseFloat(amount),
      type: parseFloat(amount) > 0 ? TransactionType.CREDIT : TransactionType.DEBIT,
      status: TransactionStatus.PENDING
    }

    const transactionData = await Transaction.create(transactionInfo);
    await producer.send(transactionData);

  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
}

export const updateWallet =  async (transactionInfo: ITransaction) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { _id: transactionId, walletId, amount } = transactionInfo;

      const transaction = await Transaction.findOne({_id: transactionId});
      if (transaction && transaction.status === TransactionStatus.PENDING) {
        return new Error("Money Already Added");
      }

      const wallet: IWallet = await Wallet.findOne({_id: walletId});
      if (!wallet) {
        return new Error("Wallet Not Found");
      }

      const updatedBalance = wallet.balance + amount ?? 0.0000;

      await Wallet.updateOne({ _id: walletId }, {'$set': { balance: updatedBalance }});
      await transaction.updateOne({_id: transactionId }, {'$set': { status: TransactionStatus.SUCCESS }});

    });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return err
  } finally {
    await session.endSession();
  }
}
