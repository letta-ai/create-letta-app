import {getLettaClient} from "../get-letta-client/get-letta-client.js";

export async function canConnectToCloud(apiKey: string) {
    try {
        const lettaClient = getLettaClient(apiKey);

        const response = await lettaClient.health.check() 
        
        return Boolean(response.status);
    } catch {
        return false;
    }
}