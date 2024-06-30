import { Document, model, Schema } from "mongoose";

export type TWallet = {
  name: string;
  balance: number;
};

export interface IWallet extends TWallet, Document {}

const walletSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    set: (val: number) => Math.round(val * 10000) / 10000
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Wallet = model<IWallet>("Wallet", walletSchema);

export default Wallet;
