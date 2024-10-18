import TelegramBot from 'node-telegram-bot-api';
import { getSwapRoutes, executeSwap } from './jup';
import { getWallet, sendTransaction } from './utils';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

const wallet = getWallet();

bot.onText(/\/start/, async (msg) => {
  const publicKey = (await wallet).publicKey.toBase58();
  bot.sendMessage(msg.chat.id, `Welcome to Swaper\nSolana’s fastest bot to trade any coin (SPL token), built by the Neel Contractor!\n\nYou currently have no SOL in your wallet. To start trading, deposit SOL to your Swaper bot wallet address:\n\n${publicKey}\n\nUse /swap <amount> <from_token> <to_token>\n\nTo retrieve your private key, /expose.If you expose your private key we can't protect you!\n\nWe suggest you to import secret key to you wallet (like Phantom or Backpack) before swaping or, take out you funds after the swap as you will/may lose your funds after a hard refresh\n\nrun /help for all commands we offer.`);
});

bot.onText(/\/expose/, async (msg) => {
  const secret = (await wallet).secretKey;
  const secretKey = Uint8Array.from(secret);

  bot.sendMessage(msg.chat.id, `Your Secret Key: [${secretKey}]\n\nUse Your Secret Key to pull out your token (use Wallets will Phantom or Backpack for better experince)\n\nIf you lost access to your secret key you will lose your funds.Keep your Secret Key safe.`)
})

bot.onText(/\/swap (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  const publicKey = (await wallet).publicKey.toString();
  if (!match) {
    bot.sendMessage(chatId, 'Invalid command! Use /swap <amount> <from_token> <to_token>.');
    return;
  }

  const [amount, fromToken, toToken] = match[1].split(' ');

  try {
    bot.sendMessage(chatId, `Finding the best route for swapping ${amount} ${fromToken} to ${toToken}...\n\nwith slippage of 1 percentage.`);

    // Fetch swap route
    const route = await getSwapRoutes(fromToken, toToken, parseFloat(amount) * 1000000000); // Convert to lamports
    if (!route) throw new Error('No route found!');

    bot.sendMessage(chatId, `Route found! Executing swap...`);

    console.log("Route.tx: ", route) // error solving

    const txResponse = await executeSwap(route, publicKey);

    // Execute swap transaction (for simplicity, assuming it's signed directly here)
    // const tx = route.tx;
    const txid = await sendTransaction(Buffer.from(txResponse, 'base64'));

    bot.sendMessage(chatId, `Swap successful! Transaction ID: ${txid}`);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `Error: ${error}`);
  }
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `If you're new to the Bot Api below is the commands and there descriptions.\n\nYou can control me by sending these commands:\n\n/start - This command will generate a keypair for your to trade.\n/swap - This command it's you swap tokens, Command to /swap <amount> <from_token> <to_token>\n/expose - This command will expose your secret key for you to pull out you funds.\n\nWe suggest you to import secret key to you wallet (like Phantom or Backpack) before swaping or, take out you funds after the swap as you will/may lose your funds after a hard refresh`)
})