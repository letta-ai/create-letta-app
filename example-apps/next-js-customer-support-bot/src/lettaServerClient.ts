import { createLetta } from "@letta-ai/vercel-ai-sdk-provider";
import {LETTA_API_KEY, LETTA_BASE_URL} from "@/environment";

export const lettaServerClient = createLetta({
    baseUrl: LETTA_BASE_URL,
    token: LETTA_API_KEY,
})