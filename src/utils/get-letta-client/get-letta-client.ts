import {LettaClient} from "@letta-ai/letta-client";

export function getLettaClient(apiKey: string) {
    return new LettaClient({
        baseUrl: process.env.LETTA_DEV_BASE_URL || 'https://api.letta.com',
        token: apiKey,
    })
}