'use client'
import {SleepingAgentIcon} from "@/components/icons/SleepingAgentIcon";
import {Input} from "@/components/Input/Input";
import {FormEvent, useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {LettaAgentIcon} from "@/components/icons/LettaAgentIcon";
import classNames from "classnames";
import {AgentChat} from "@/components/AgentChat/AgentChat";


interface NotSignedInViewProps {
    onStartChat: (agentId: string) => void;
}


function NotSignedInView(props: NotSignedInViewProps) {
    const {onStartChat} = props;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const {mutate, isPending} = useMutation({
        mutationFn: () => fetch('/api/start-chat', {
            body: JSON.stringify({name, email}),
            method: 'POST',
        }).then(res => {
            if (!res.ok) {
                throw new Error("Failed to start chat");
            }
            return res.json() as Promise<{ agentId: string }>;
        })
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!name || !email) {
            alert("Please enter your name and email");
            return;
        }


        mutate(undefined, {
            onSuccess: (data) => {
                const {agentId} = data;
                if (!agentId) {
                    alert("Failed to start chat");
                    return;
                }
                onStartChat(agentId);
            },
            onError: (error) => {
                console.error(error);
                alert(`Failed to start chat, check your logs`);
            }
        })
    }


    return (
        <div className="p-8 pb-14 gap-4 flex flex-col">
            <div className={classNames(
                'absolute transition-opacity ease-in left-0 top-0 w-full h-full items-center flex justify-center bg-background',
                isPending ? 'opacity-100 ' : 'opacity-0 pointer-events-none\n'
            )}>
                <div className="w-12 animate-pulse">
                    <LettaAgentIcon/>
                </div>
            </div>
            <div className="w-10">
                <SleepingAgentIcon/>
            </div>
            <div>
                <h1 className="font-bold text-xl">Welcome!</h1>
                <div>Enter your name and email to start chatting with our support team</div>
            </div>
            <form className="pt-2" onSubmit={handleSubmit}>
                <Input label="Name" name="name" placeholder="Name" value={name}
                       onChange={(e) => setName(e.target.value)}/>
                <Input label="Email" name="email" placeholder="Email" value={email}
                       onChange={(e) => setEmail(e.target.value)}/>
                <button
                    type="submit"
                    className="w-full bold bg-gray-900 text-white p-2 rounded-sm"
                >
                    Start Chatting
                </button>
            </form>
        </div>
    )
}


export default function Home() {
    const [agentIdToChatWith, setAgentIdToChatWith] = useState<string | null>(null);

    return (
        <div className="w-[100vw] bg-gray-50 absolute h-[100vh] flex items-center justify-center">
            <div
                className={
                    classNames('max-w-[400px] bg-background border  relative  rounded-sm w-full   shadow-md',
                        agentIdToChatWith ? 'max-h-[600px] h-full' : '')
                }>
                {!agentIdToChatWith ? <NotSignedInView
                    onStartChat={(agentId) => {
                        setAgentIdToChatWith(agentId);
                    }}
                /> : (<AgentChat agentId={agentIdToChatWith}/>)}

            </div>
        </div>
    );
}
