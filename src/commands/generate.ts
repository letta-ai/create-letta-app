import {confirm, input, password} from '@inquirer/prompts'
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

        this.log(`[Selected app: ${selectedApp.label}]`);

        const shouldUseLettaCloud = await confirm({
            default: true,
            message: 'Do you want to use letta cloud?'
        });

        let serverUrl: string = 'localhost:8283'
        if (!shouldUseLettaCloud) {
            serverUrl = await input({
                default: 'localhost:8283',
                message: 'What is the name of the server you want to connect to?'
            });
        }

        const apiKey = await password({
            mask: true,
            message: `What is your API Key? [${shouldUseLettaCloud ? 'https://app.letta.com/api-keys' : 'optional'}]`,
        });

        //
        // const config = {
        //     apiKey,
        //     selectedApp,
        //     serverUrl: shouldUseLettaCloud ? 'letta_cloud' : serverUrl,
        //     useLettaCloud: shouldUseLettaCloud,
        // };

        // this.log('Configuration:', config);

        this.exit(0);
    }
}