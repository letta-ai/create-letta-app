import {useLettaQuery} from "@letta-ai/letta-react";

export function useLettaAgentsList() {
    return useLettaQuery((client) => client.agents.list({limit: 100}), {
        queryKey: ['list-agents', {limit: 100}],
    })
}