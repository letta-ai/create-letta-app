import {AgentState, ListMessages200, useListAgents, useListMessages} from "@letta-ai/letta-react";
import {useEffect, useMemo, useRef} from "react";
import {useChat} from "@ai-sdk/react";
import {convertToAiSdkMessage} from "@letta-ai/vercel-ai-sdk-provider";
import {LettaMessageUnion} from "@letta-ai/letta-client/api";
import {SleepingAgentIcon} from "@/components/icons/SleepingAgentIcon";
import * as humps from 'humps'
import classNames from "classnames";

interface AgentMessagesProps {
    initialMessages: LettaMessageUnion[]
    agentId: string
}

function AgentMessages(props: AgentMessagesProps) {
    const {initialMessages, agentId} = props;

    const {messages, status, input, handleInputChange, handleSubmit} = useChat({
        body: {
            agentId
        },
        initialMessages: convertToAiSdkMessage(initialMessages, {
            allowMessageTypes: ['user_message', 'assistant_message', 'tool_return_message', 'reasoning_message']
        }),
    });

    const messageScrollRef = useRef<HTMLDivElement | null>(null);
    const lastMessageCount = useRef<number>(0);

    useEffect(() => {
        if (!messageScrollRef.current) {
            return;
        }

        if (messages.length !== lastMessageCount.current) {
            messageScrollRef.current.scrollTop = messageScrollRef.current.scrollHeight;
        }
    }, [messages.length]);

    const isLoading = useMemo(() => {
        return status === 'streaming' || status === 'submitted'
    }, [status]);


    return (
        <div className="flex flex-col w-full h-full p-5 gap-4 overflow-hidden   w-full">
            <div ref={messageScrollRef} className="h-full gap-2 flex px-2   flex-col  overflow-y-auto">
                {messages.map(message => (
                    <div key={message.id} className="whitespace-pre-wrap w-full gap-2">
                        <div
                            className={classNames('px-3 py-2 text-sm rounded-sm', message.role === 'user' ? 'justify-self-end bg-foreground text-background' : 'bg-gray-100 dark:bg-gray-900 justify-self-start')}>
                            {message.parts.map((part, i) => {
                                switch (part.type) {
                                    case 'text':
                                        return <div key={`${message.id}-${i}`}>{part.text}</div>;
                                }
                            })}
                        </div>
                    </div>
                ))}
            </div>
            {isLoading && (
                <div className="flex items-center justify-center w-full ">
                    Streaming...
                </div>
            )}
            <form className="flex items-center border rounded-md px-1.5 py-2 gap-2" onSubmit={handleSubmit}>

                <input
                    className="w-full h-[42px] w-full text-sm   px-3 py-2   bg-gray-50 dark:bg-gray-900 rounded-sm "
                    value={input}
                    disabled={status !== 'ready'}
                    placeholder="Say something..."
                    onChange={handleInputChange}
                />
                <button
                    className="bg-foreground h-[42px] items-center justify-center flex font-bold text-sm text-background px-3 py-2 rounded-sm">
                    Send
                </button>
            </form>
        </div>
    );
}


interface AgentContentProps {
    agent: AgentState | null;
}

export function AgentContent(props: AgentContentProps) {
    const {agent} = props;

    const { isLoading } = useListAgents()

    const {data: initialMessages} = useListMessages(agent?.id || '', {limit: 100,}, {
        query: {
            enabled: !!agent?.id,
        }
    });


    if (!agent?.id) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="bg-gray-200 dark:bg-gray-800 max-w-[400px] rounded p-5 gap-2 flex flex-col">
                    <div className="w-25 flex">
                        <SleepingAgentIcon/>
                        <SleepingAgentIcon/>
                        <SleepingAgentIcon/>
                    </div>
                    <div className="font-bold">
                        {isLoading ? 'Loading Chat Environment...' : 'Please select an agent from the sidebar to start chatting'}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full h-full">
            <header className="min-h-[64px] border-b">
                <div className="flex px-5 h-full justify-center flex-col">
                    <div className="font-bold line-clamp-1">
                        {agent.name}
                    </div>
                    <div className="text-sm  line-clamp-1">
                        {agent.id}
                    </div>
                </div>
            </header>
            {!!initialMessages &&
                <AgentMessages
                    initialMessages={humps.camelizeKeys<ListMessages200>(initialMessages.data) as LettaMessageUnion[]}
                    agentId={agent.id}/>}
        </div>
    )
}