import {GenerateCommandConfig} from "../../../types.js";
import {AdditionalOperationsResponse} from "../example-selector.js";
import {CHATBOT_TEMPLATE} from "./chatbot-template.js";

interface DemoAppInterface {
    additionalOperations?: (config: GenerateCommandConfig) => Promise<AdditionalOperationsResponse>;
    description: string;
    id: string;
    label: string;
    postInstallCommands?: string[];
    preview: string;
    toolsUsed: string[];
}

interface AppListInterface {
    [key: string]: DemoAppInterface[];
}

export const APP_LIST: AppListInterface = {
    'nextjs': [
        CHATBOT_TEMPLATE,
    ]
}