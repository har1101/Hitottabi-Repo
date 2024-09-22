import { defineFunction } from '@aws-amplify/backend';

export const receiveMessage = defineFunction({
    name: 'receiveMessage',
    entry: './handler.ts',
    runtime: 20,
    timeoutSeconds: 60
});
