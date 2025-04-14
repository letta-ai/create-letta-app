if (!process.env.LETTA_BASE_URL) {
    throw new Error('Missing LETTA_BASE_URL environment variable');
}

export const LETTA_BASE_URL: string = process.env.LETTA_BASE_URL;
export const LETTA_API_KEY = process.env.LETTA_API_KEY;