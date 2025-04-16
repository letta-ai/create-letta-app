import {NextRequest, NextResponse} from "next/server";
import {lettaServerClient} from "@/lettaServerClient";
import {LETTA_PROJECT_ID, LETTA_PROJECT_SLUG, LETTA_TEMPLATE_NAME} from "@/environment";
import {Identity} from "@letta-ai/letta-client/api";
import * as fs from "fs";
import path from "node:path";


const isCloudWorkflow = !!(LETTA_TEMPLATE_NAME && LETTA_PROJECT_SLUG && LETTA_PROJECT_ID);

export async function POST(req: NextRequest) {
    const {email, name} = await req.json();

    // first look up the user by email in identities
    const [foundIdentity] = await lettaServerClient.client.identities.list({
        identifierKey: email,
        ...isCloudWorkflow ? { projectId: LETTA_PROJECT_ID } : {},
    });

    let identity: Identity | null = foundIdentity;

    if (identity) {
        if (identity.agentIds.length > 0) {
            // if the user already has an agent, return it
            return NextResponse.json({
                agentId: identity.agentIds[0],
            });
        }
    } else {
        // create a new identity
        identity = await lettaServerClient.client.identities.create({
            identifierKey: email,
            identityType: 'user',
            name,
            ...isCloudWorkflow ? { projectId: LETTA_PROJECT_ID } : {},
        });
    }

    if (!identity?.id) {
        return NextResponse.json({
            error: 'An error occurred while creating the identity',
        }, {
            status: 500,
        });

    }

    // no cloud workflow
    if (!isCloudWorkflow) {
        const agentFile = await new Promise<string>((resolve, reject) => fs.readFile(path.join(process.cwd(), 'default-customer-support.af'), 'utf-8', (err, data) => {
            if (err) {
                console.error(err);
                return reject(err);
            }

            resolve(data);
        }));

        const agentFileAsFile = new File([agentFile], 'default-customer-support.af', {
            type: 'application/json',
        });

        const response = await lettaServerClient.client.agents.importAgentSerialized(agentFileAsFile, {

        })



        await lettaServerClient.client.identities.modify(identity.id, {
            agentIds: [response.id],
        });

        if (!response) {
            return NextResponse.json({
                error: 'An error occurred while creating the agent',
            }, {
                status: 500,
            });
        }

        return NextResponse.json({
            agentId: response.id,
        });
    }

    const response = await lettaServerClient.client.templates.createAgents(LETTA_PROJECT_SLUG, LETTA_TEMPLATE_NAME, {
        memoryVariables: {
            name: identity.name || 'Unnamed',
            email: identity.identifierKey,
        }
    })

    if (!response.agents || response.agents.length === 0) {
        return NextResponse.json({
            error: 'An error occurred while creating the agent',
        }, {
            status: 500,
        });
    }

    const agentId = response.agents[0].id;

    // add the agent to the identity
    await lettaServerClient.client.identities.modify(identity.id, {
        agentIds: [agentId],
    });

    return NextResponse.json({
        agentId,
    });
}