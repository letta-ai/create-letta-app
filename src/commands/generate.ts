import {confirm, input, password} from '@inquirer/prompts'
import {Command} from '@oclif/core'
import {execSync} from "node:child_process";
import * as fs from 'node:fs'
// eslint-disable-next-line unicorn/import-style
import * as path from "node:path";

import {getSelectedExample} from "../components/example-selector/example-selector.js";
import {GenerateCommandConfig} from "../types.js";
import {canConnectToCloud} from "../utils/can-connect-to-cloud/can-connect-to-cloud.js";
import {getIsDevEnv} from "../utils/get-is-dev-env/get-is-dev-env.js";
import {projectSelector} from "../utils/project-selector/project-selector.js";


export default class Generate extends Command {
    static aliases = ['g']
    static args = {}
    static description = 'Generate a new Letta project'
    static examples = [
        `<%= config.bin %> <%= command.id %>
        Generate a new Letta project (./src/commands/start.ts)
        `,]
    static flags = {}

    async run(): Promise<void> {

        const selectedApp = await getSelectedExample()

        this.log(`[Selected app: ${selectedApp.label}]`);

        const config: GenerateCommandConfig = {}

        config.shouldUseLettaCloud = await confirm({
            default: true,
            message: 'Do you want to use letta cloud?'
        });

        config.serverUrl = 'http://localhost:8283'
        if (!config.shouldUseLettaCloud) {
            config.serverUrl = await input({
                default: 'http://localhost:8283',
                message: 'What is the name of the server you want to connect to?'
            });
        }

        config.apiKey = await password({
            mask: true,
            message: `What is your API Key? [${config.shouldUseLettaCloud ? 'https://app.letta.com/api-keys' : 'optional'}]`,
        });

        if (config.shouldUseLettaCloud) {
            if (!config.apiKey) {
                this.error('API key is required for Letta Cloud');
            }

            this.log('Connecting to Letta Cloud...');
            const response = await canConnectToCloud(config.apiKey);


            if (!response) {
                this.error('Unable to connect to Letta Cloud. Please check your API key and internet connection.');
            }

            this.log('Connected to Letta Cloud');

            const project = await projectSelector(config.apiKey);

            config.projectSlug = project.slug;
            config.projectId = project.id;
        }

        const workingDirectory = getIsDevEnv() ? path.join(process.cwd(), 'tmp') : path.join(process.cwd());

        const additionalEnv = [];

        if (selectedApp?.additionalOperations) {
            const additionalOperationsResponse = await selectedApp.additionalOperations(config);

            if (additionalOperationsResponse?.env) {
                for (const [key, value] of Object.entries(additionalOperationsResponse.env)) {
                    additionalEnv.push(`${key}=${value}`);
                }
            }
        }

        this.log(`Generating project in ${workingDirectory}...`);

        // fetch the latest version of the selected app
        const cmds = [
            `mkdir -p ${workingDirectory ?? ''} && ${workingDirectory ? `cd ${workingDirectory}`: ''}`,
            `git clone --depth=1  ${selectedApp.preview}`
        ];

        const cmd = cmds.join(' && ');
        const output = execSync(cmd);
        this.log(output.toString());

        // create .env file in the current working directory
        const envFilePath = path.join(workingDirectory, selectedApp.id, '.env');
        const envContent = `
            LETTA_API_KEY=${config.apiKey}
            LETTA_BASE_URL=${config.shouldUseLettaCloud ? 'https://app.letta.com' : config.serverUrl}
            ${additionalEnv.join('\n')}
            `;
        fs.writeFileSync(envFilePath, envContent);

        // post install
        const postInstallCommands = selectedApp.postInstallCommands || [];
        for (const command of postInstallCommands) {
            this.log(`Running post setup command: ${command}`);
            execSync(command, {cwd: workingDirectory, stdio: 'inherit'});
        }

        const successMessage = `Project generated successfully, you can visit ${workingDirectory} to start working on your project.\n\n=============================\\n`;

        this.log(successMessage);
        this.exit(0);
    }
}