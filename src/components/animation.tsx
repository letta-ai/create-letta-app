import {Box, Text, useStdout} from 'ink'
import React, {useEffect, useState} from 'react'

interface Props {
    fps: number
    frames: string[]
}

export const Animation: React.FC<Props> = ({frames, fps}) => {
    const [idx, setIdx] = useState(0)
    const {write} = useStdout()

    // advance the frame index
    useEffect(() => {
        const interval = setInterval(() => {
            setIdx(i => (i + 1) % frames.length)
        }, 1000 / fps)
        return () => clearInterval(interval)
    }, [fps, frames.length])

    // clear screen on each frame
    useEffect(() => {
        write('\u001B[2J\u001B[0;0H')  // ANSI: clear + home
    }, [idx])

    return (
        <Box flexDirection="column">
            <Text>{frames[idx]}</Text>
        </Box>
    )
}
