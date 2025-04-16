import autocomplete from 'inquirer-autocomplete-standalone';

import {debounceAsyncFn} from "../debounce-async-fn/debounce-async-fn.js";
import {getLettaClient} from "../get-letta-client/get-letta-client.js";


export async function templateSelector(projectId: string, apiKey: string): Promise<string> {
    const client = getLettaClient(apiKey);
    const debouncedListTemplates = debounceAsyncFn((args: { name?: string }) => client.templates.listtemplates(
        {
            name: typeof args.name === 'string' ? args.name : undefined,
            projectId,
            limit: 5,
        }
    ), 500);

    return autocomplete({
        message: 'Please select a template',
        async source(input) {

            const response = await debouncedListTemplates({
                name: input,
            });

            if (!response || !response.templates) {
                return [];
            }

            return response.templates.map(template => ({
                name: template.name,
                value: template.name
            }))
        }
    })

}