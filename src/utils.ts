import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import * as dotenv from 'dotenv';

dotenv.config();

const connection = new Connection(clusterApiUrl('devnet'));

export const getWallet = async () => {

  const keypair = Keypair.generate();
  return keypair;
};

export const sendTransaction = async (signedTx: Buffer) => {
    const txid = await connection.sendRawTransaction(signedTx);
    await connection.confirmTransaction(txid);
    return txid;
}