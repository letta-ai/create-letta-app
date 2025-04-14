import {confirm, input, password} from '@inquirer/prompts'
import {Command} from '@oclif/core'
import * as fs from 'node:fs'
import * as path from "node:path";
import {fileURLToPath} from 'node:url';
import {execSync} from "node:child_process";

import {getSelectedExample} from "../components/example-selector/example-selector.js";


export default class Generate extends Command {
    static args = {}
    static description = 'Generate a new Letta project'
    static examples = [
        `<%= config.bin %> <%= command.id %>
Generate a new Letta project (./src/commands/start.ts)
`,
    ]
    static flags = {}

    async run(): Promise<void> {

        const selectedApp = await getSelectedExample()

        this.log(`[Selected app: ${selectedApp.label}]`);

        const shouldUseLettaCloud = await confirm({
            default: true,
            message: 'Do you want to use letta cloud?'
        });

        let serverUrl: string = 'http://localhost:8283'
        if (!shouldUseLettaCloud) {
            serverUrl = await input({
                default: 'http://localhost:8283',
                message: 'What is the name of the server you want to connect to?'
            });
        }

        const apiKey = await password({
            mask: true,
            message: `What is your API Key? [${shouldUseLettaCloud ? 'https://app.letta.com/api-keys' : 'optional'}]`,
        });

        const workingDirectory = path.join(process.cwd(), 'tmp', selectedApp.id);

        this.log(`Generating project in ${workingDirectory}...`);

        const dirName = fileURLToPath(import.meta.url);

        const templatePath = path.join(dirName, '..', '..', 'example-apps', selectedApp.id);

        // copy the template files to the current working directory
        fs.cpSync(templatePath, workingDirectory, {
            recursive: true,
        })

        // create .env file in the current working directory
        const envFilePath = path.join(workingDirectory, '.env');

        const envContent = `
LETTA_API_KEY=${apiKey}
LETTA_BASE_URL=${shouldUseLettaCloud ? 'https://app.letta.com' : serverUrl}
`;

        fs.writeFileSync(envFilePath, envContent);

        const postInstallCommands = selectedApp.postInstallCommands || [];

        for (const command of postInstallCommands) {
            this.log(`Running post setup command: ${command}`);
            execSync(command, {cwd: workingDirectory, stdio: 'inherit'});
        }


        const successMessage = `Project generated successfully, you can visit ${workingDirectory} to start working on your project.\n\n Run 'npm run dev' to start the development server.`;

        this.log(successMessage);
        this.exit(0);
    }
}