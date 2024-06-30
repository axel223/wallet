import { Request, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import Transaction from "../../models/Transaction";

export const getWalletTransactions = async (req: Request, res: Response) => {
  const walletId = req.query.walletId;
  const skip = parseInt(req.query.skip + '', 10) ?? 0;
  const limit = parseInt(req.query.limit + '', 10) ?? 100;

  if (!walletId) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [
        {
          msg: "Wallet Id required",
        },
      ],
    });
  }

  try {
    const transactionList = await Transaction.find({walletId: walletId })
      .sort({ createdDate: 'desc' })
      .skip(skip)
      .limit(limit);

    if (!transactionList) {
      return res.status(HttpStatusCodes.NOT_FOUND)
        .send({
          response: 'Transaction Not Found'
        });
    }

    return res.send(transactionList);

  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
}
