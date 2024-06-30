import { Router, Request, Response} from 'express';
import { getWallet, setupWallet } from "./api/wallet";
import { getWalletTransactions } from "./api/transaction";
import { initiateTransaction } from "./api/transact";

export const router = Router();

router.get('/healthCheck', (req: Request, res: Response) => {
  return res.send('Wallet Service is Running!');
});

router.post('/setup', async (req: Request, res: Response) => {
  return await setupWallet(req, res);
});

router.post('/transact/:walletId', async (req: Request, res: Response) => {
  return await initiateTransaction(req, res);
});

router.get('/transactions', async (req: Request, res: Response) => {
  return await getWalletTransactions(req, res);
});

router.get('/wallet/:walletId', async (req: Request, res: Response) => {
  return await getWallet(req, res);
});

router.get('/*', (req: Request, res: Response) => {
  return res.status(404).send('Invalid Path');
});