import {streamText} from 'ai';
import {lettaServerClient} from "@/lettaServerClient";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, agentId } = await req.json();

    if (!Array.isArray(messages)) {
        throw new Error('Invalid messages');
    }

    const result = streamText({
        model: lettaServerClient(agentId),
        /* we only need to send the last message to the model */
        messages: [messages[messages.length - 1]],
    });

    return result.toDataStreamResponse()
}