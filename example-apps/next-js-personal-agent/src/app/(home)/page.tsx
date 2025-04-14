'use client'
import {AgentsList} from "@/components/AgentsList/AgentsList";
import {useState} from "react";
import {AgentContent} from "@/components/AgentContent/AgentContent";
import {AgentState} from "@letta-ai/letta-react";

export default function Homepage() {
    const [selectedAgent, setSelectedAgent] = useState<AgentState | null>(null);

    return (
        <div className=" p-4 flex absolute w-[100vw] top-0 left-0 overflow-hidden h-[100vh]">
           <div className="w-full shadow-md h-full border rounded flex">
               <AgentsList
                   selectedAgent={selectedAgent}
                   onSelectAgent={setSelectedAgent}
               />
                <div className="flex-1 h-full ">
                    <AgentContent agent={selectedAgent} />
                </div>
           </div>

        </div>
    )
}