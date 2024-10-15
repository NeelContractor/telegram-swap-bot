import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import * as dotenv from 'dotenv';

dotenv.config();

const connection = new Connection(clusterApiUrl('devnet'));

export const getWallet = () => {
    const secretKey = process.env.SOLANA_SECRET_KEY;
  
    if (!secretKey) {
      throw new Error('SOLANA_SECRET_KEY is not set or invalid in .env file.');
    }
  
    const secretArray = JSON.parse(secretKey); 
    return Keypair.fromSecretKey(Uint8Array.from(secretArray));
};

export const sendTransaction = async (signedTx: Buffer) => {
    const txid = await connection.sendRawTransaction(signedTx);
    await connection.confirmTransaction(txid);
    return txid;
}