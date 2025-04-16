
import {ExampleApp, GenerateCommandConfig} from "../../../types.js";
import {templateSelector} from "../../../utils/template-selector/template-selector.js";
import {AdditionalOperationsResponse} from "../example-selector.js";

export const CUSTOMER_SERVICE_WIDGET: ExampleApp = {
    async additionalOperations(config: GenerateCommandConfig): Promise<AdditionalOperationsResponse> {

        const env: Record<string, string> = {}

        let templateName = '';
        
        if (config.shouldUseLettaCloud) {
            if (!config.projectId || !config.apiKey) {
                throw new Error('Project ID and API key are required for Letta Cloud');
            }
            
            templateName  = await templateSelector(config.projectId, config.apiKey);

            // check if user enters in a specific version
            if (!templateName.includes(':')) {
                templateName = `${templateName}:latest`;
            }

            env.LETTA_TEMPLATE_NAME = templateName;
            env.LETTA_PROJECT_SLUG = config.projectSlug || '';
        }

        return {
            env,
        }

    },
    description: "A demo of a possible-customer support widget that's connected to a user signup flow and allows users to a single personalized agent based on a template (cloud-only) or agentfile (local).",
    id: 'next-js-customer-support-bot',
    label: "Customer support widget",
    postInstallCommands: ['npm install'],
    preview: 'https://github.com/letta-ai/create-letta-app/tree/main/example-apps/next-js-customer-support-bot',
    toolsUsed: ['next.js', 'ai-sdk', 'react', 'tailwind', 'sqlite'],
}