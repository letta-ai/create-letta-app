import {useEffect, useMemo, useRef} from "react";
import {useChat} from "@ai-sdk/react";
import {convertToAiSdkMessage} from "@letta-ai/vercel-ai-sdk-provider";
import {LettaMessageUnion} from "@letta-ai/letta-client/api";
import classNames from "classnames";
import {useLettaQuery} from "@letta-ai/letta-react";
import {LettaAgentIcon} from "@/components/icons/LettaAgentIcon";

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
                <div
                    className="rounded-sm animate-pulse bg-gray-50 dark:bg-gray-800 p-2 text-xs flex gap-2 items-center justify-center w-full ">
                    <div className="w-4">
                        <LettaAgentIcon/>
                    </div>
                    Thinking...
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
    agentId: string;
}

export function AgentChat(props: AgentContentProps) {
    const {agentId} = props;


    const {data: initialMessages, isPending, isError } = useLettaQuery((client) => client.agents.messages.list(agentId || '', {
        limit: 1000,
    }), {
        retry: true,
        queryKey: ['messages', agentId],
        enabled: !!agentId,
    });

    if (isError) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <div className="w-12 animate-pulse">
                    <LettaAgentIcon/>
                </div>
                <div className="text-sm text-red-500">
                    Failed to load messages. Please try again later.
                </div>
            </div>
        )
    }

    if (isPending) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <div className="w-12 animate-pulse">
                    <LettaAgentIcon/>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full  h-full">
            <div className="flex items-center gap-2 justify-start px-5 w-full h-12 bg-gray-100 dark:bg-gray-900">
                <div className="w-4">
                    <LettaAgentIcon  />
                </div>
                <span className="font-semibold text-sm">
                    Chatting with your personal agent
                </span>
            </div>
            {!!initialMessages &&
                <AgentMessages
                    initialMessages={initialMessages}
                    agentId={agentId}/>}
        </div>
    )
}