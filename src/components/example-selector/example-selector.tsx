import {Box, render, Text, useInput} from 'ink';
import React, {useMemo, useState} from 'react';

import {ExampleApp} from "../../types.js";
import {LETTA_LOGO, LETTA_TEXT} from "../logos/logos.js";
import {APP_LIST} from "./examples/list.js";

export interface AdditionalOperationsResponse {
    env?: Record<string, string>
}

interface DemosInterface {
    [key: string]: {
        apps: ExampleApp[];
        label: string;
    }
}

const demos: DemosInterface = {
    'nextjs': {
        apps: [],
        label: 'Next.js',
    }
}

interface SelectedAppPayload extends ExampleApp {
    framework?: string
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

        for (const [framework, demoApps] of Object.entries(APP_LIST)) {
            // @ts-ignore
            demos[framework].apps.push(...demoApps);
            // @ts-ignore
            for (const app of demoApps) {
                const appWithFramework: SelectedAppPayload = {
                    ...app,
                    framework,
                };
                apps.push(appWithFramework);
            }
        }

        return apps;
    }, [demos]);



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
                    {Object.entries(demos).map(([frameworkKey, framework]) => (
                        <Box
                            display="flex"
                            flexDirection="column"
                            key={frameworkKey}
                            marginBottom={1}
                        >
                            <Text color="blueBright">{framework.label}</Text>
                            {framework.apps.map(app => (
                                <Box key={app.id} paddingLeft={1}>
                                    <Text
                                        backgroundColor={selectedApp.id === app.id ? 'blue' : ''}
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
                <Text>Select from the following example apps to be generated in your current
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