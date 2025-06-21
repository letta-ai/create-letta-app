import autocomplete from 'inquirer-autocomplete-standalone';

import {debounceAsyncFn} from "../debounce-async-fn/debounce-async-fn.js";
import {getLettaClient} from "../get-letta-client/get-letta-client.js";

interface Response {
    id: string;
    slug: string;
}

export  async function projectSelector(apiKey: string): Promise<Response> {
    const client = getLettaClient(apiKey);
    const debouncedListProjects = debounceAsyncFn((args: { name?: string }) => client.projects.list({
        ...args,
        limit: 5,
    }), 500);

    const response = await autocomplete({
        message: 'Please select a project',
        async source(input) {

            const response = await debouncedListProjects({
                name: input,
            });

            if (!response || !response.projects) {
                return [];
            }

            return response.projects.map(project => ({
                name: project.name,
                value: `${project.id}__${project.slug}`,
            }))
        }
    })

    const [id, slug] = response.split('__');

    return {
        id,
        slug,
    }
}