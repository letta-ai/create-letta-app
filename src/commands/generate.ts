import {confirm, input} from '@inquirer/prompts'
import {Command} from '@oclif/core'

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


        
        
        const useLettaCloud = await confirm({
            default: true,
            message: 'Do you want to use letta cloud?'
        });

        let serverUrl: string = 'localhost:8283'
        if (!useLettaCloud) {
            serverUrl = await input({
                default: 'localhost:8283',
                message: 'What is the name of the server you want to connect to?'
            });
        }

        const apiKey = await input({
            message: 'What is your API Key?',
        });
        

        const config = {
            apiKey,
            selectedApp,
            serverUrl: useLettaCloud ? 'letta_cloud' : serverUrl,
            useLettaCloud,
        };

        this.log('Configuration:', config);

        process.exit(0);
    }
}