
import {ExampleApp} from "../../../types.js";
import {AdditionalOperationsResponse} from "../example-selector.js";

export const CHATBOT_TEMPLATE: ExampleApp = {
    async additionalOperations(): Promise<AdditionalOperationsResponse> {
        const env: Record<string, string> = {}
        env.USE_COOKIE_BASED_AUTHENTICATION = 'true'
        env.NEXT_PUBLIC_CREATE_AGENTS_FROM_UI = 'true'

        return {
            env,
        }

    },
    description: "A simple Next.js application that integrates with Letta AI to create a chat app.",
    id: "letta-chatbot-example", // MUST BE SAME NAME AS THE REPO
    label: "Next.js Chatbot Template",
    postInstallCommands: ["npm install"],
    preview: "https://github.com/letta-ai/letta-chatbot-example.git",
    toolsUsed: ["letta sdk", "next.js", "react", "typescript", "shadcn", "react markdown"]
}