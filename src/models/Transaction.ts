import { Document, model, Schema } from "mongoose";
import { IWallet } from "./Wallet";

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS'
}

export type TTransaction = {
  walletId: IWallet["_id"];
  amount: number;
  balance: number;
  description: string;
  status: TransactionStatus;
  type: TransactionType;
};

export interface ITransaction extends TTransaction, Document {
}

const transactionSchema: Schema = new Schema({
  walletId: {
    type: Schema.Types.ObjectId,
    ref: "Wallet",
  },
  amount: {
    type: Number,
    required: true,
    set: (val: number) => Math.round(val * 10000) / 10000
  },
  balance: {
    type: Number,
    required: true,
    set: (val: number) => Math.round(val * 10000) / 10000
  },
  status: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = model<ITransaction>("Transaction", transactionSchema);

export default Transaction;
