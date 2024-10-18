import axios from "axios";

const JUP_API_URL = 'https://quote-api.jup.ag/v6/';

export const getSwapRoutes = async (inputMint: string, outputMint: string, amount: number) => {
    try {
        console.log("inside getSwapRoute function");
        const response = await axios.get(`${JUP_API_URL}quote`, {
            params: {
                inputMint: 'So11111111111111111111111111111111111111112', // SOL
                outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
                amount,
                slippage: 1,
            },
        });

        console.log("Full API Response:", JSON.stringify(response.data.routePlan?.[0], null, 2));

        if (!response.data || !response.data.routePlan || response.data.routePlan.length === 0) {
            throw new Error('No route found!');
        }
    
        const data = await response.data.routePlan?.[0];
        console.log(`GetSwapRoute Response: ${JSON.stringify(data, null, 2)}`);
        return data;
    } catch (error) {
        console.error("Error fetching swap route:", error);
        throw error;
    }
}

export const executeSwap = async (route: string, userPublicKey: string) => {
    try {
        const swapPayload = {
            route, // Route from the quote response
            userPublicKey, // Provide the wallet address initiating the swap
            wrapAndUnwrapSol: true, // Use this if swapping SOL
        };

        console.log("Executing swap with payload:", JSON.stringify(swapPayload, null, 2));

        try {
            const response = (await axios.post(`${JUP_API_URL}swap`, swapPayload));
            console.log("Swap API Response:", JSON.stringify(response.data, null, 2));
            console.log("Swap executed successfully:", response.data);
            return response.data;
        } catch (error) {
            console.log(`swap error: ${error}`);
        }
    } catch (error) {
        console.error("Error executing swap:", error);
        throw error;
    }
}