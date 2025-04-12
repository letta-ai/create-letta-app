import {Box, render, Text, useInput} from 'ink';
import React, {useEffect, useMemo, useState} from 'react';

import {NEXT_JS_LOGO} from "../logos/logos.js";

interface ExampleApp {
    description: string;
    id: string;
    label: string;
}

interface SupportedFramework {
    demoApps: ExampleApp[];
    icon: string;
    label: string;
}

const supportedFrameworks: SupportedFramework[] = [
    {
        demoApps: [
            {
                description: "A simple chat that uses next.js to talk to a single agent",
                id: 'next-js-single-agent',
                label: "Single agent chat app"
            },
            {
                description: "A chat app that multiple users sign up and talk to a specific type of agent",
                id: 'next-js-multi-agent',
                label: "Multi-user chat app"
            },
        ],
        icon: NEXT_JS_LOGO,
        label: 'Next.js'
    },
    {
        demoApps: [
            {
                description: "A simple chat that uses next.js to talk to a single agent",
                id: 'nuxt-js-single-agent',
                label: "Single agent chat app"
            }
        ],
        icon: NEXT_JS_LOGO,
        label: 'Nuxt'
    },
    {
        demoApps: [
            {
                description: "An AI chat app that allows users to sign up and talk to a selection of different fantasy agents",
                id: 'expo-single-agent',
                label: "Fantasy agent chat app"
            }
        ],
        icon: NEXT_JS_LOGO,
        label: 'React Native'
    }
]

interface SelectedAppPayload extends ExampleApp {
    framework: string;
    icon: string;
}

function SelectedExample(props: SelectedAppPayload) {
    const {label, description} = props;

    return (
        <Box display="flex" flexDirection="column">
            <Box alignItems="center" display="flex" flexDirection="row" gap={1}>

                <Text color="blueBright">
                    {label}
                </Text>
            </Box>
            <Box>
                <Text>
                    {description}
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
                    icon: framework.icon
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
        <Box display="flex" flexDirection="row">
            <Box borderStyle="single" display="flex" flexDirection="column" flexGrow={1} gap={1} padding={1}>
                <Box>
                    <Text>Explore our demo apps</Text>
                </Box>
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
            <Box flexGrow={2} padding={2}>
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


    return (
        <Box borderStyle="doubleSingle" display="flex" flexDirection="row">
            <ExampleView
                onSelect={(example) => {
                    onComplete(example);
                }}
            />
        </Box>
    );
}

export async function getSelectedExample() {
    return new Promise((resolve) => {
        // clear the console
        process.stdout.write('\u001Bc')

        function onComplete(payload: SelectedAppPayload) {
            process.stdout.write('\u001Bc')
            resolve(payload);
        };

        render(<Example onComplete={onComplete}/>);
    });
}