import axios from "axios";

const JUP_API_URL = 'https://quote-api.jup.ag/v6/';

export const getSwapRoutes = async (inputMint: string, outputMint: string, amount: number) => {
    const response = await axios.get(`${JUP_API_URL}quote`, {
        params: {
            inputMint: 'So11111111111111111111111111111111111111112', // SOL
            outputMint: 'So11111111111111111111111111111111111111112', // wSOL
            amount: 1000000,
            slippage: 1,
        },
    });

    console.log(`GetSwapRoute Response: ${response.data.data[0]}`);
    return response.data.data[0];
}

export const executeSwap = async (tx: string) => {
    const response = await axios.post(`${JUP_API_URL}swap`, { tx });
    console.log(`ExecuteSwap Response: ${response.data}`);
    return response.data;
}