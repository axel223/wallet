import { Request, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import Wallet, { IWallet } from "../../models/Wallet";

export const setupWallet = async (req: Request, res: Response) => {
  const { name, balance } = req.body;

  if (name === undefined ) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [
        {
          msg: "Name required to setup wallet",
        },
      ],
    });
  }

  try {
    const wallet = await Wallet.create({
      name: name,
      balance: balance,
    });

    res.send(wallet);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
}

export const getWallet = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(HttpStatusCodes.BAD_REQUEST).json({
      errors: [
        {
          msg: "Wallet Id required",
        },
      ],
    });
  }

  try {
    const wallet: IWallet = await Wallet.findOne({_id: id});

    if (!wallet) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({msg: "Wallet not found"});
    }

    res.json(wallet);
  } catch (err) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
  }
}

