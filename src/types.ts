import {AdditionalOperationsResponse} from "./components/example-selector/example-selector.js";

export interface GenerateCommandConfig {
    apiKey?: string;
    projectId?: string;
    projectSlug?: string;
    serverUrl?: string;
    shouldUseLettaCloud?: boolean;
}

export interface ExampleApp {
    additionalOperations?: (config: GenerateCommandConfig) => Promise<AdditionalOperationsResponse>,
    description: string;
    id: string;
    label: string;
    postInstallCommands?: string[];
    preview: string,
    toolsUsed: string[];
}