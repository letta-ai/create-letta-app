import {Box, render, Text, useInput} from 'ink';
import React, {useMemo, useState} from 'react';

import {LETTA_LOGO, LETTA_TEXT} from "../logos/logos.js";

interface ExampleApp {
    description: string;
    id: string;
    label: string;
    postInstallCommands?: string[];
    preview: string,
    toolsUsed: string[];
}

interface SupportedFramework {
    demoApps: ExampleApp[];
    label: string;
}

const supportedFrameworks: SupportedFramework[] = [
    {
        demoApps: [
            {
                description: "A simple Next.JS powered web app that allows you to chat to all the agents in your Letta server, there is no authentication.",
                id: 'next-js-personal-agent',
                label: "Personal agent chat",
                postInstallCommands: ['npm install'],
                preview: 'https://github.com/letta-ai/create-letta-app/tree/main/example-apps/next-js-personal-agent',
                toolsUsed: ['next.js', 'ai-sdk', 'react', 'tailwind'],
            },
            // {
            //     description: "A Next.js powered web agent-chat app that supports multiple users. Using SQLLite as a external database and the identities api, this app allows users to sign up with a username and password and talk to their own agents",
            //     id: 'next-js-multi-agent',
            //     label: "Multi-user agent chat",
            //     preview: 'https://google.com',
            //     toolsUsed: ['next.js',  'ai-sdk', 'sqlite', 'react', 'tailwind', 'shadcn'],
            // },
            // {
            //     description: "A Next.js powered web agent-chat app that supports multiple users. Authentication is handled by Auth0 and the app uses MongoDB as a external database. This app allows users to sign up with social providers and talk to their own agents",
            //     id: 'remote-db-next-js-multi-agent',
            //     label: "OAuth multi-user chat",
            //     preview: 'https://google.com',
            //     toolsUsed: ['auth0',  'ai-sdk', 'next.js', 'mongodb', 'react', 'tailwind', 'shadcn'],
            // },
        ],
        label: 'Next.js'
    },
    // {
    //     demoApps: [
    //         {
    //             description: "A simple Nuxt powered web app that allows you to chat to all the agents in your Letta server, there is no authentication.",
    //             id: 'single-agent-chat',
    //             label: "Personal agent chat",
    //             preview: 'https://google.com',
    //             toolsUsed: ['ai-sdk', 'nuxt', 'vuejs', 'tailwind'],
    //         }
    //     ],
    //     label: 'Nuxt'
    // },
    // {
    //     demoApps: [
    //         {
    //             description: "A React Native powered app that lets you talk to all the agents in your Letta server.",
    //             id: 'expo-single-agent',
    //             label: "Agent mobile app",
    //             preview: 'https://google.com',
    //             toolsUsed: ['expo',  'ai-sdk', 'react-native', 'tailwind'],
    //         }
    //     ],
    //     label: 'React Native'
    // },
    // {
    //     demoApps: [
    //         {
    //             description: "A flask powered web app with a react frontend that allows you to chat to all the agents in your Letta server, there is no authentication.",
    //             id: 'flask-react-single-agent',
    //             label: "Personal agent chat",
    //             preview: 'https://google.com',
    //             toolsUsed: ['react', 'flask', 'tailwind'],
    //         }
    //     ],
    //     label: 'Flask+React'
    // }
]

interface SelectedAppPayload extends ExampleApp {
    framework: string;
}

function SelectedExample(props: SelectedAppPayload) {
    const {description, label} = props;

    return (
        <Box display="flex" flexDirection="column">
            <Box display="flex" flexDirection="row" gap={1} paddingBottom={1}>
                <Text bold color="blueBright">
                    {label}
                </Text>
            </Box>
            <Box width={100}>
                <Text>
                    {description}
                </Text>

            </Box>
            <Box paddingTop={1}>
                <Text>
                    <Text>Tools used:</Text>
                    {props.toolsUsed.map((tool, index) => (
                        <Text color="blueBright" key={index}>{` ${tool}`}</Text>
                    ))}
                </Text>
            </Box>
            <Box>
                <Text>
                    <Text>Preview:</Text>
                    <Text color="blueBright">{` ${props.preview}`}</Text>
                </Text>
            </Box>
        </Box>
    )
}

interface ExampleViewProps {
    onSelect: (example: SelectedAppPayload) => void;
}

function ExampleView(props: ExampleViewProps) {
    const {onSelect} = props;
    const [selectedIndex, setSelectedIndex] = useState(0);

    const exampleApps = useMemo(() => {
        const apps = [] as SelectedAppPayload[];
        for (const framework of supportedFrameworks) {
            for (const app of framework.demoApps) {
                apps.push({
                    ...app,
                    framework: framework.label,
                });
            }
        }

        return apps;
    }, [supportedFrameworks]);

    useInput((_, key) => {
        if (key.upArrow) {
            setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (key.downArrow) {
            setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, exampleApps.length - 1));
        } else if (key.return) {
            const selectedApp = exampleApps[selectedIndex];
            onSelect(selectedApp);
        }
    });

    const selectedApp = useMemo(() => exampleApps[selectedIndex], [selectedIndex, exampleApps]);

    return (
        <Box borderStyle="single" display="flex" flexDirection="row">

            <Box borderBottom={false} borderLeft={false} borderStyle="single" borderTop={false} display="flex"
                 flexDirection="column" gap={1} minWidth={30} paddingX={1} width={30}>
                <Box display="flex" flexDirection="column">
                    {supportedFrameworks.map((framework, index) => (
                        <Box display="flex" flexDirection="column" key={index} marginBottom={1}>
                            <Text color="blueBright">{framework.label}</Text>
                            {framework.demoApps.map((app) => (
                                <Box key={app.id} paddingLeft={1}>
                                    <Text backgroundColor={selectedApp.id === app.id ? 'blue' : ''}
                                    >
                                        {app.label}
                                    </Text>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>

            </Box>
            <Box flexGrow={1} padding={2}>
                <SelectedExample {...selectedApp}/>
            </Box>

        </Box>
    )
}


interface ExampleProps {
    onComplete: (payload: SelectedAppPayload) => void;
}

export function Example(props: ExampleProps) {
    const {onComplete} = props;

    const [selectedApp, setSelectedApp] = useState<null | SelectedAppPayload>(null);

    useInput(() => {
        // keep to prevent UI from closing app, this is kind of hacking so it doesn't close
    });

    if (selectedApp) {
        return (
            <Box/>
        )
    }

    return (
        <Box borderStyle="doubleSingle" display="flex" flexDirection="column" padding={1}>
            <Box alignItems="center" display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
                <Box>
                    <Text>{LETTA_LOGO}</Text>
                </Box>
                <Box>
                    <Text>{LETTA_TEXT}</Text>
                </Box>

            </Box>
            <Box borderStyle="single" display="flex" flexDirection="column" paddingX={1}>
                <Text bold>npx create-letta-app generate</Text>
                <Text>Pick below from the following example apps to be generated in your current
                    directory: {process.cwd()}/[sample-app-name]</Text>
                <Box borderBottom={false} borderLeft={false} borderRight={false} borderStyle="single" borderTop
                     display="flex" flexDirection="column">
                    <Text bold>Use arrow keys to navigate ↓ ↑</Text>
                </Box>
            </Box>
            <ExampleView
                onSelect={(example) => {
                    setSelectedApp(example);
                    onComplete(example);
                }}
            />
        </Box>
    );
}

export async function getSelectedExample() {
    return new Promise<SelectedAppPayload>((resolve) => {
        // clear the console
        process.stdout.write('\u001Bc')

        function onComplete(payload: SelectedAppPayload) {
            resolve(payload);
        }

        render(<Example onComplete={onComplete}/>);
    });
}