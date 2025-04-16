export function getIsDevEnv() {
    return process.env.NODE_ENV === 'create-letta-dev';
}