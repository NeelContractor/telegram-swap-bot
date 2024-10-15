import TelegramBot from 'node-telegram-bot-api';
import { getSwapRoutes, executeSwap } from './jup';
import { getWallet, sendTransaction } from './utils';

// Initialize the Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });

// Wallet instance
const wallet = getWallet();

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Welcome to BonkSwap! Use /swap <amount> <from_token> <to_token> to swap.');
});

bot.onText(/\/swap (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!match) {
    bot.sendMessage(chatId, 'Invalid command! Use /swap <amount> <from_token> <to_token>.');
    return;
  }

  const [amount, fromToken, toToken] = match[1].split(' ');

  try {
    bot.sendMessage(chatId, `Finding the best route for swapping ${amount} ${fromToken} to ${toToken}...`);

    // Fetch swap route
    const route = await getSwapRoutes(fromToken, toToken, parseFloat(amount) * 10 ** 6); // Convert to lamports
    if (!route) throw new Error('No route found!');

    bot.sendMessage(chatId, `Route found! Executing swap...`);

    // Execute swap transaction (for simplicity, assuming it's signed directly here)
    const tx = route.tx;
    const txid = await sendTransaction(Buffer.from(tx, 'base64'));

    bot.sendMessage(chatId, `Swap successful! Transaction ID: ${txid}`);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, `Error: ${error}`);
  }
});

