'use client'
import {AgentState, useListAgents} from "@letta-ai/letta-react";
import classNames from "classnames";
import {useEffect} from "react";
import {LettaAgentIcon} from "@/components/icons/LettaAgentIcon";
import {Avatar} from "@/components/Avatar/Avatar";

interface AgentRowProps {
    agent: AgentState
    onSelect: () => void
    isSelected: boolean
}

function AgentRow(props: AgentRowProps) {
    const {agent, onSelect, isSelected} = props;

    return (
        <li onClick={onSelect} key={agent.id}
            className={classNames('flex items-center  h-[72px] rounded flex-row  gap-5 px-4 py-3 cursor-pointer hover:bg-gray-100', isSelected ? 'bg-gray-50' : '')}>
            <div
                className={classNames('p-2 h-6 w-6 flex items-center justify-center text-xs  rounded-sm', isSelected ? 'bg-blue-200' : 'bg-gray-100')}>
                <Avatar className={isSelected ? 'bg-blue-200' : 'bg-gray-100'} name={agent.name} />
            </div>
            <div className="hidden md:flex flex-col">
                <div className="text-sm font-bold line-clamp-1">{agent.name}</div>
                <div className="text-sm text-gray-500 line-clamp-1">{agent.description || 'No description'}</div>
            </div>
        </li>
    )
}

interface AgentInnerListProps {
    agents?: AgentState[]
    onSelect: (agent: AgentState) => void;
    selectedAgent: AgentState | null;
}

function AgentInnerList(props: AgentInnerListProps) {
    const {agents, onSelect, selectedAgent} = props;

    //
    if (!agents) {
        return (
            new Array(10).fill(0).map((_, i) => (
                <div className="w-[100%] min-h-[72px] h-4 bg-gray-50 animate-pulse" key={i}/>
            ))
        )
    }

    return agents?.map(agent => (
        <AgentRow
            key={agent.id}
            agent={agent}
            isSelected={selectedAgent?.id === agent.id}
            onSelect={() => onSelect(agent)}
        />
    ))
}

interface AgentsListProps {
    onSelectAgent: (agent: AgentState) => void;
    selectedAgent: AgentState | null;
}


export function AgentsList(props: AgentsListProps) {
    const {data} = useListAgents();
    const {onSelectAgent, selectedAgent} = props;

    useEffect(() => {
        if (data?.data.length) {
            onSelectAgent(data.data[0])
        }
    }, [data?.data, onSelectAgent]);

    return (
        <div className="flex flex-col border-r h-full  md:w-[300px] max-w-[300px] overflow-hidden">
            <div className="h-[64px] min-h-[64px] flex items-center justify-center md:justify-start border-b items-center gap-3 p-5">
                <div className="w-5 flex items-center justify-center">
                    <LettaAgentIcon/>
                </div>
                <div className="md:block hidden">
                    <div className="text-sm font-bold ">My Agent Chat</div>
                </div>
            </div>

            <ul className={classNames('gap-2 p-2 flex flex-col w-full', !data ? 'overflow-hidden' : 'overflow-y-auto')}>
                <AgentInnerList
                    agents={data?.data}
                    onSelect={onSelectAgent}
                    selectedAgent={selectedAgent}
                />
            </ul>
        </div>
    )
}