import { Command } from '@oclif/core'
import { input, confirm, select } from '@inquirer/prompts'

export default class Start extends Command {
  static args = {}
  static description = 'Generate a new Letta project'
  static examples = [
    `<%= config.bin %> <%= command.id %>
Generate a new Letta project (./src/commands/start.ts)
`,
  ]
  static flags = {}

  async run(): Promise<void> {
    const useLettaCloud = await confirm({
      message: 'Do you want to use letta cloud?',
      default: true
    });

    let serverUrl: string = 'localhost:8283'
    if (!useLettaCloud) {
      serverUrl = await input({
        message: 'What is the name of the server you want to connect to?',
        default: 'localhost:8283'
      });
    }

    const apiKey = await input({
      message: 'What is your API Key?',
    });

    const framework = await select({
      message: 'What framework do you want to use?',
      choices: [
        { value: 'nextjs', name: 'NextJS + React' },
        { value: 'nuxt', name: 'Nuxt + Vue.js' },
        { value: 'expo', name: 'Expo + React Native' },
        { value: 'sveltekit', name: 'SvelteKit' },
        { value: 'flask', name: 'Flask + React' },
        { value: 'streamlit', name: 'Streamlit' },
      ],
    });

    const config = {
      useLettaCloud,
      apiKey,
      serverUrl: useLettaCloud ? 'letta_cloud' : serverUrl,
      framework,
    };

    this.log('Configuration:', config);
  }
}